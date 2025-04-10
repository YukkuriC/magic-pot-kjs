/**@type {Record<string,(lvl:Internal.ServerLevel,pos:BlockPos,plr:Internal.ServerPlayer)=>void>}*/
let potUseFuncs = {
    potted_poppy(lvl, pos, plr) {
        let potions = plr.potionEffects
        potions.add('minecraft:regeneration', 20 * 1800, 0, false, false)
        for (let item of plr.inventory.allItems) if (item.damageableItem) item.damageValue = 0
        plr.abilities.mayfly = true
        plr.abilities.flyingSpeed = 0.15
        plr.onUpdateAbilities()
    },
    potted_dandelion(lvl, pos) {
        let range = AABB.of(pos.x - 50, -320, pos.z - 50, pos.x + 51, 320, pos.z + 51)
        for (let e of lvl.getEntitiesWithin(range)) {
            if (!e.isMonster()) continue
            e.setPosition(pos.x + 0.5, pos.y + 1, pos.z + 0.5)
            e.kill()
        }
    },
}
