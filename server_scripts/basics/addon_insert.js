// priority: 1000
// body in `contents/all_server_tick.js` & `contents/all_right_click.js` (TODO)

/**
 * @param {typeof potTickFuncs} funcs
 * @param {typeof potTickCooldowns} cds
 */
function appendPotTicks(funcs, cds) {
    Object.assign(potTickFuncs, funcs)
    Object.assign(potTickCooldowns, cds)
}
