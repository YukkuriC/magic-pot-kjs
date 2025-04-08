/**@type {Record<string,(lvl:Internal.ServerLevel,pos:BlockPos,data:Internal.CompoundTag)=>void>}*/
let potTickFuncs = {
    potted_oak_sapling: (level, pos) => {
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
    potted_cherry_sapling: (level, pos) => {
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
}

/**@type {Record<string,number>}*/
let potTickCooldowns = {
    potted_oak_sapling: 30,
    potted_cherry_sapling: 100,
}
