// priority: -1
// requires: create
appendPotTicks(
    {
        spout(level, pos) {
            let be = level.getBlockEntity(pos)
            if (be.processingTicks > 6) {
                be.processingTicks = 6
            } else if (be.processingTicks <= 4) {
                be.processingTicks = -1
            }
        },
        mechanical_press(level, pos) {
            let be = level.getBlockEntity(pos)
            let presser = be.pressingBehaviour
            if (!presser.running) return
            if (presser.runningTicks < 119) {
                presser.runningTicks = presser.prevRunningTicks = 119
            } else if (presser.runningTicks > 120) {
                presser.runningTicks = presser.prevRunningTicks = 240
            }
        },
        helve_hammer(level, pos) {
            let be = level.getBlockEntity(pos)
            if (be.timer > 50) {
                be.timer = 50
                be.sendData()
            }
        },
    },
    {
        spout: 4,
        mechanical_press: 4,
        helve_hammer: 10,
    },
)
