ItemEvents.firstLeftClicked('flower_pot', ev => {
    let {
        target: { block, facing },
        player,
        level,
    } = ev
    if (!player.shiftKeyDown) return

    const CHAIN_LIMIT = 256
    try {
        // try raycast
        if (!block) {
            let res = player.rayTrace(5, false)
            if (res) {
                block = res.block
                facing = res.facing
            }
        }
        // chain miner
        if (block) {
            let isSurvival = !player.isCreative(),
                source = block.pos,
                checker = block.blockState.block
            if (checker.defaultDestroyTime() < 0 && isSurvival) return
            let visited = {},
                selected = [source],
                queue = [source]
            visited[PotUtils.getPosKey(source)] = 1
            while (selected.length < CHAIN_LIMIT && queue.length > 0) {
                let oldPos = queue.shift()
                for (let dx = -1; dx <= 1; dx++)
                    for (let dy = -1; dy <= 1; dy++)
                        for (let dz = -1; dz <= 1; dz++) {
                            let dirs = Math.abs(dx) + Math.abs(dy) + Math.abs(dz)
                            if (dirs < 1 || dirs > 2) continue // adjacent
                            let newPos = oldPos.offset(dx, dy, dz)
                            if (!level.isInWorldBounds(newPos)) continue // in world
                            let newKey = PotUtils.getPosKey(newPos)
                            if (visited[newKey]) continue // new pos
                            let newBlock = level.getBlock(newPos)
                            if (newBlock.id !== block.id) continue // same type
                            visited[newKey] = 1
                            selected.push(newPos)
                            queue.push(newPos)
                        }
            }
            // fallback hammer
            if (selected.length >= CHAIN_LIMIT) {
                selected.length = 0
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx * facing.x) continue
                    for (let dy = -1; dy <= 1; dy++) {
                        if (dy * facing.y) continue
                        for (let dz = -1; dz <= 1; dz++) {
                            if (dz * facing.z) continue
                            selected.push(source.offset(dx, dy, dz))
                        }
                    }
                }
            }

            for (let p of selected) level.destroyBlock(p, isSurvival)
        }
    } catch (e) {
        player.tell(e)
    }
})
