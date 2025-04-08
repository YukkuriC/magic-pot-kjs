/**@type {Record<string,(lvl:Internal.ServerLevel,pos:BlockPos,plr:Internal.ServerPlayer)=>void>}*/
let potUseFuncs = {
    potted_poppy(lvl, pos, plr) {
        let potions = plr.potionEffects
        potions.add('minecraft:regeneration', 20 * 1800, 0, false, false)
    },
}
