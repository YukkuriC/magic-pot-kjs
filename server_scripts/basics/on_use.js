BlockEvents.rightClicked(e => {
    let {
        block: { pos, id: idOld },
        level,
        server,
        player,
    } = e
    if (e.hand != 'main_hand') return
    server.scheduleInTicks(1, () => {
        let idFull = level.getBlock(pos).id
        let id = cutNamespace(idFull)
        if (id in potUseFuncs) {
            potUseFuncs[id](level, pos)
        } else if (id in potTickFuncs) {
            let pool = getTickRecorder(server, level)
            let key = `${pos.x},${pos.y},${pos.z}`
            let blockName = Text.translate(`block.${idFull.replace(':', '.')}`)
            if (pool.contains(key)) {
                delete pool[key]
                player.tell(Text.translate('pot.block.disabled', blockName, key).gold())
            } else {
                pool[key] = 0
                player.tell(Text.translate('pot.block.enabled', blockName, key).green())
            }
        }
    })
    idOld = cutNamespace(idOld)
    if (player.crouching && (idOld in potUseFuncs || idOld in potTickFuncs)) e.cancel()
})
