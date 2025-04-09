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
        level.tell('init:' + data.h)
        level.tell('init2:' + pos.y)
        level.tell('init3:' + h)
        // chunk range
        let cx = Math.floor(pos.x / 16) * 16,
            cz = Math.floor(pos.z / 16) * 16,
            ptr = pos.mutable().setY(h),
            canDig = level.isInWorldBounds(ptr),
            allAir = true
        if (canDig) {
            while (allAir && canDig) {
                for (let dx = 0; dx < 16; dx++) {
                    ptr.setX(cx + dx)
                    for (let dz = 0; dz < 16; dz++) {
                        ptr.setZ(cz + dz)
                        let state = level.getBlock(ptr).blockState
                        if (!state.isAir()) allAir = false
                        let bb = state.block
                        if (bb.defaultDestroyTime() < 0) {
                            canDig = false
                            break
                        }
                    }
                    if (!canDig) break
                }
                if (allAir) {
                    h--
                    ptr = pos.mutable().setY(h)
                    canDig = level.isInWorldBounds(ptr)
                }
            }
        }
        if (canDig) {
            for (let dx = 0; dx < 16; dx++) {
                ptr.setX(cx + dx)
                for (let dz = 0; dz < 16; dz++) {
                    ptr.setZ(cz + dz)
                    level.destroyBlock(ptr, true)
                }
            }
            data.h = h - 1
        } else throw 'stop'
    },
}

/**@type {Record<string,number>}*/
let potTickCooldowns = {
    potted_oak_sapling: 30,
    potted_cherry_sapling: 100,
    potted_warped_fungus: 10,
}
