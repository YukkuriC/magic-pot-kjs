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
                }
            }
        }
    },
}

/**@type {Record<string,number>}*/
let potTickCooldowns = {
    potted_oak_sapling: 10,
}
