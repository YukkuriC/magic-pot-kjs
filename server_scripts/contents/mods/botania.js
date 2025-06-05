// priority: -1
// requires: botania
appendPotTicks(
    {
        potted_pure_daisy(level, pos, data) {
            let chest = level.getBlock(pos.above())?.inventory
            if (!chest) return
            for (let item of chest.allItems) {
                if (item.id.startsWith('botania:living')) continue
                if (item.hasTag('logs')) {
                    var oldCount = item.count
                    item.shrink(oldCount)
                    chest.insertItem(Item.of('botania:livingwood_log', oldCount), false)
                    return
                }
                if (item.hasTag('forge:stone')) {
                    var oldCount = item.count
                    item.shrink(oldCount)
                    chest.insertItem(Item.of(`botania:livingrock`, oldCount), false)
                    return
                }
            }
        },
    },
    {
        potted_pure_daisy: 100,
    },
)
