// requires: create
{
    let wrapBlockEntity = func => (level, pos) => func(level.getBlockEntity(pos))

    appendPotTicks(
        {
            spout: wrapBlockEntity(be => {
                if (be.processingTicks > 6) {
                    be.processingTicks = 6
                } else if (be.processingTicks <= 4) {
                    be.processingTicks = -1
                }
            }),
            mechanical_press: wrapBlockEntity(be => {
                let presser = be.pressingBehaviour
                if (!presser.running) return
                if (presser.runningTicks < 119) {
                    presser.runningTicks = presser.prevRunningTicks = 119
                } else if (presser.runningTicks > 120) {
                    presser.runningTicks = presser.prevRunningTicks = 240
                }
            }),
            helve_hammer: wrapBlockEntity(be => {
                if (be.timer > 50) {
                    be.timer = 50
                    be.sendData()
                }
            }),
        },
        {
            spout: 4,
            mechanical_press: 4,
            helve_hammer: 10,
        },
    )
}
