// priority: 1000

/**@type {Record<string,(lvl:Internal.ServerLevel,pos:BlockPos,data:Internal.CompoundTag)=>void>}*/
let potTickFuncs = {
    potted_oak_sapling(level, pos, data) {
        let ptr = pos.mutable()
        let { x: ix, z: iz } = pos

        function doBonemeal(at) {
            let block = level.getBlock(at)
            let state = block.blockState
            /**@type {Internal.BonemealableBlock}*/
            let bbb = state.block
            if (bbb.isValidBonemealTarget && bbb.isValidBonemealTarget(level, at, state, level.isClientSide())) {
                bbb.performBonemeal(level, level.random, at, state)
                level.levelEvent(1505, at, 0)
                return true
            }
        }

        let tc = Math.floor(level.server.tickCount / 30)
        // use cache
        if (tc % 4 && data.cache) {
            let invalid = []
            for (let posRaw of Object.keys(data.cache)) {
                if (!doBonemeal(posRaw.split(',').map(Number))) invalid.push(posRaw)
            }
            for (const i of invalid) delete data.cache[i]
            return
        }
        // refresh cache
        data.cache = {}
        for (let x = ix - 4; x <= ix + 4; x++) {
            ptr.setX(x)
            for (let z = iz - 4; z <= iz + 4; z++) {
                ptr.setZ(z)
                if (doBonemeal(ptr)) data.cache[PotUtils.getPosKey(ptr)] = true
            }
        }
    },
    potted_cherry_sapling(level, pos) {
        let { x, y, z } = pos
        let range = AABB.of(x - 4, y - 1, z - 4, x + 4, y + 1, z + 4)
        for (let e of level.getEntitiesWithin(range)) {
            if (!e.setInLove) continue
            if (!e.isBaby()) {
                e.setAge(0)
                e.setInLove(null)
            } else {
                e.addMotion(Math.random() - 0.5, 0.5, Math.random() - 0.5)
            }
        }
    },
    potted_crimson_fungus(level, pos, data) {
        if (level.dimension != 'minecraft:overworld' || pos < 0) throw 'stop'
        let h = data.h
        if (h === undefined) h = pos.y + 20
        let ptr = pos.mutable().setY(h)

        let setter =
            h < pos.y - 1
                ? () => {
                      let block = level.getBlock(ptr)
                      if (block.hasTag('forge:stone') || block.hasTag('forge:cobblestone')) return
                      level.setBlockAndUpdate(ptr, Blocks.GRAY_CONCRETE.defaultBlockState())
                  }
                : h >= pos.y
                ? () => {
                      if (ptr.equals(pos)) return
                      level.setBlockAndUpdate(ptr, Blocks.AIR.defaultBlockState())
                  }
                : () => {
                      let { x, z } = ptr
                      x %= 32
                      z %= 32
                      if (x < 0) x += 32
                      if (z < 0) z += 32
                      let xx = x % 8,
                          zz = z % 8
                      if (!x || !z || x == 31 || z == 31) {
                          level.setBlockAndUpdate(ptr, ((x + z) % 2 ? Blocks.YELLOW_CONCRETE : Blocks.BLACK_CONCRETE).defaultBlockState())
                      } else if (x == 15 || x == 16 || z == 15 || z == 16) {
                          level.setBlockAndUpdate(ptr, Blocks.LIGHT_GRAY_CONCRETE.defaultBlockState())
                      } else if ((xx == 3 || xx == 4) && (zz == 3 || zz == 4)) {
                          level.setBlockAndUpdate(ptr, Blocks.PEARLESCENT_FROGLIGHT.defaultBlockState())
                      } else {
                          level.setBlockAndUpdate(ptr, Blocks.WHITE_CONCRETE.defaultBlockState())
                      }
                  }
        if (level.isInWorldBounds(ptr)) PotUtils.iterChunk(ptr, setter /* , 32 */)
        data.h = h - 1
        if (data.h < pos.y - 30) {
            level.tell('platform building end')
            throw 'stop'
        }
    },
    potted_warped_fungus(level, pos, data) {
        let h = data.h
        if (h === undefined) h = pos.y - 1
        // chunk range
        let ptr = pos.mutable().setY(h),
            canDig = level.isInWorldBounds(ptr),
            allAir = true
        while (allAir && canDig) {
            PotUtils.iterChunk(ptr, c => {
                let state = level.getBlock(ptr).blockState
                if (!state.isAir()) allAir = false
                let bb = state.block
                if (bb.defaultDestroyTime() < 0) {
                    canDig = false
                    c()
                }
            })
            if (allAir) {
                h--
                ptr = pos.mutable().setY(h)
                canDig = canDig && level.isInWorldBounds(ptr)
            }
        }
        if (canDig) {
            let tryChest = level.getBlock(pos.above())?.inventory
            PotUtils.iterChunk(ptr, () => {
                level.destroyBlock(ptr, true)
                level.setBlockAndUpdate(ptr, Blocks.AIR.defaultBlockState())
            })
            for (let e of level.getEntitiesWithin(PotUtils.getChunkHitbox(ptr))) {
                switch (e.type) {
                    case 'minecraft:experience_orb':
                        e.discard()
                        break
                    case 'minecraft:item':
                        if (tryChest) {
                            tryChest.insertItem(e.item, false)
                            e.discard()
                        } else {
                            e.setPosition(pos.x + 0.5, pos.y + 1, pos.z + 0.5)
                            e.setMotion(0, Math.random() * 0.3 + 0.2, 0)
                        }
                        break
                }
            }
            data.h = h - 1
        } else throw 'stop'
    },
    potted_brown_mushroom(level, pos, data) {
        let h = data.h,
            ptr = pos.mutable()
        if (h === undefined || !level.isInWorldBounds(ptr.setY(h))) {
            h = pos.y - 1
            ptr.setY(h)
        }
        let tryChest = level.getBlock(pos.above())?.inventory
        let oreList = level.server.persistentData.oreScanned
        if (!oreList?.contains) return
        oreList = Object.keys(oreList)
        let randId = oreList[Math.floor(Math.random() * oreList.length)]
        let drop = Item.of(randId, 16)
        if (tryChest) {
            tryChest.insertItem(drop, false)
        } else {
            let item = level.createEntity('item')
            item.item = drop
            item.setPosition(pos.x + 0.5, pos.y + 1, pos.z + 0.5)
            item.setMotion(0, Math.random() * 0.3 + 0.2, 0)
            item.spawn()
        }
    },
    potted_red_mushroom(level, pos, data) {
        let h = data.h,
            ptr = pos.mutable()
        if (h === undefined) {
            level.tell(`scan started`)
            h = pos.y - 1
            ptr.setY(h)
        } else if (!level.isInWorldBounds(ptr.setY(h))) {
            level.tell(`scan finished, added ${data.n || 0} types`)
            level.destroyBlock(pos, true)
        }
        /**@type {Internal.ListTag} */
        let oreList = level.server.persistentData.oreScanned
        if (!oreList?.contains) {
            level.server.persistentData.oreScanned = {}
            oreList = level.server.persistentData.oreScanned
            oreList['minecraft:cobblestone'] = 1
        }
        PotUtils.iterChunk(ptr, () => {
            let target = level.getBlock(ptr)
            if (!target.hasTag('forge:ores')) return
            for (let drop of target.getDrops()) {
                if (!oreList.contains(drop.id)) {
                    oreList[drop.id] = 1
                    data.n = (data.n || 0) + 1
                    level.tell(Text.of(`scanned: `).append(drop.displayName.green()))
                }
            }
        })
        data.h = h - 1
    },
}

/**@type {Record<string,number>}*/
let potTickCooldowns = {
    potted_oak_sapling: 30,
    potted_cherry_sapling: 100,
    potted_warped_fungus: 10,
    potted_brown_mushroom: 10,
    potted_red_mushroom: 5,
}
