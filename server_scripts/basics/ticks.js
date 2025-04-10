LevelEvents.tick(event => {
    let {
        level,
        server,
        server: { tickCount },
    } = event
    let pool = getTickRecorder(server, level)
    let cache = getCacheRecorder(server, level)
    let poolPairs = Object.entries(pool)
    if (poolPairs.length <= 0) return
    let invalidPos = []
    for (let [posRaw, tick] of poolPairs) {
        if (tick > 0) {
            tick--
            pool[posRaw] = tick
            continue
        }
        let block, pos
        try {
            let posSep = posRaw.split(',').map(Number)
            pos = BlockPos(posSep[0], posSep[1], posSep[2])
            block = level.getBlock(pos)
            let bid = cutNamespace(block.id)
            let func = potTickFuncs[bid]
            if (!func) {
                invalidPos.push(posRaw)
                continue
            }
            func(level, pos, getCacheFromMap(cache, posRaw))
            if (bid in potTickCooldowns) pool[posRaw] = (tickCount % (potTickCooldowns[bid] || 1)) + 1
        } catch (e) {
            if (e != 'stop') {
                if (block && pos) {
                    server.tell(PotUtils.getSimpleBlockMsg('error', block.id, pos).red())
                }
                server.tell(e)
            }
            invalidPos.push(posRaw)
        }
    }

    // detect memory leak
    if (tickCount % 600 == 0)
        for (let key in cache)
            if (!pool.contains(key)) {
                invalidPos.push(key)
                // server.tell('leak: ' + key)
            }

    for (let invalid of invalidPos) {
        delete pool[invalid]
        delete cache[invalid]
    }
})
