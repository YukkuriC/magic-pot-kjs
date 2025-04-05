/**@type {Record<string,(lvl:Internal.ServerLevel,pos:BlockPos)=>void>}*/
let potTickFuncs = {
    potted_oak_sapling: (level, pos) => {
        let ptr = pos.mutable()
        level.dimension
        let { x: ix, z: iz } = pos
        for (let x = ix - 4; x <= ix + 4; x++) {
            ptr.setX(x)
            for (let z = iz - 4; z <= iz + 4; z++) {
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
        let range = AABB.of(x - 3, y, z - 3, x + 3, y, z + 3)
        for (let e of level.getEntitiesWithin(range)) {
            if (!e.setInLove) continue
            e.setInLove(null)
            e.setAge(0)
        }
    },
}

/**@type {Record<string,number>}*/
let potTickCooldowns = {
    potted_oak_sapling: 10,
    potted_cherry_sapling: 100,
}
