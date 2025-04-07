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
            let key = PotUtils.getPosKey(pos)
            if (pool.contains(key)) {
                delete pool[key]
                player.tell(PotUtils.getSimpleBlockMsg('disabled', idFull, pos).gold())
            } else {
                pool[key] = 0
                player.tell(PotUtils.getSimpleBlockMsg('enabled', idFull, pos).green())
            }
        }
    })
    idOld = cutNamespace(idOld)
    if (player.crouching && (idOld in potUseFuncs || idOld in potTickFuncs)) e.cancel()
})
