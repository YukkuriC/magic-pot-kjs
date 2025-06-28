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
            packager: wrapBlockEntity(be => {
                if (be.animationTicks > 1) {
                    be.animationTicks = 1
                }
            }),
        },
        {
            spout: 4,
            mechanical_press: 4,
            packager: 2,
        },
    )

    if (Platform.isLoaded('vintageimprovements')) {
        appendPotTicks(
            {
                helve_hammer: wrapBlockEntity(be => {
                    if (be.timer > 50) {
                        be.timer = 50
                        be.sendData()
                    }
                }),
            },
            {
                helve_hammer: 10,
            },
        )
    }

    if (Platform.isLoaded('createdieselgenerators')) {
        let Integer = Java.loadClass('java.lang.Integer')
        let int3 = new Integer('3')
        let fDistillTick = Java.class
            .forName('com.jesz.createdieselgenerators.content.distillation.DistillationTankBlockEntity')
            .getDeclaredField('processingTime')
        fDistillTick.setAccessible(true)

        appendPotTicks(
            {
                pumpjack_crank: wrapBlockEntity(be => {
                    if (be.speed) {
                        be.angle += 30
                        be.sendData()
                    }
                }),
                distillation_tank: wrapBlockEntity(be => {
                    if (fDistillTick.get(be) > 3) {
                        fDistillTick.set(be, int3)
                        be.sendData()
                    }
                }),
            },
            {
                pumpjack_crank: 4,
                distillation_tank: 10,
            },
        )
    }
}
