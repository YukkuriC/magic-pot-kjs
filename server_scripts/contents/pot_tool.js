ItemEvents.firstLeftClicked('flower_pot', ev => {
    let {
        target: { block, facing },
        player,
        level,
    } = ev
    if (!player.shiftKeyDown) return
    try {
        // chain miner
        if (block) {
            let isSurvival = !player.isCreative(),
                checker = block.blockState.block
            if (checker.defaultDestroyTime() < 0 && isSurvival) return
            let visited = {},
                selected = [block.pos],
                queue = Array.from(selected)
            visited[PotUtils.getPosKey(selected[0])] = 1
            while (selected.length < 32 && queue.length > 0) {
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
            if (selected.length < 32) {
                for (let p of selected) level.destroyBlock(p, isSurvival)
            } else {
                // todo tunneler
            }
        }
    } catch (e) {
        player.tell(e)
    }
})
