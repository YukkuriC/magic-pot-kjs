/**@type {Record<string,(lvl:Internal.ServerLevel,pos:BlockPos,data:Internal.CompoundTag)=>void>}*/
let potTickFuncs = {
    potted_oak_sapling(level, pos) {
        let ptr = pos.mutable()
        let { x: ix, z: iz } = pos
        let tc = Math.floor(level.server.tickCount / 10)
        for (let x = ix - 4; x <= ix + 4; x++) {
            ptr.setX(x)
            for (let z = iz - 4; z <= iz + 4; z++) {
                if ((x + z * 2 + tc) % 5) continue
                ptr.setZ(z)
                let block = level.getBlock(ptr)
                let state = block.blockState
                let bbb = state.block
                if (bbb.performBonemeal) {
                    bbb.performBonemeal(level, level.random, ptr, state)
                    level.levelEvent(1505, ptr, 0)
                }
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
                        e.setPosition(pos.x + 0.5, pos.y + 1, pos.z + 0.5)
                        e.setMotion(0, Math.random() * 0.3 + 0.2, 0)
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
        PotUtils.iterChunk(ptr, () => {
            let target = level.getBlock(ptr)
            if (!target.hasTag('forge:ores') && Math.random() > 0.01) return
            for (let drop of target.getDrops()) {
                let item = level.createEntity('item')
                item.item = drop
                item.setPosition(pos.x + 0.5, pos.y + 1, pos.z + 0.5)
                item.setMotion(0, Math.random() * 0.3 + 0.2, 0)
                item.spawn()
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
}
