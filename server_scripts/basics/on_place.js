BlockEvents.rightClicked(e => {
    let {
        block: { pos },
        level,
        server,
    } = e
    server.scheduleInTicks(1, () => {
        let id = level.getBlock(pos).id
        id = cutNamespace(id)
        if (id in potUseFuncs) {
            potUseFuncs[id](level, pos)
        } else if (id in potTickFuncs) {
            let pool = getTickRecorder(server, level)
            pool[`${pos.x},${pos.y},${pos.z}`] = 0
        }
    })
})
