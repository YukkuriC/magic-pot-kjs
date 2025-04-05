/**
 * @param {Internal.MinecraftServer} server
 * @param {Internal.ServerLevel} level
 */
function getTickRecorder(server, level) {
    let storage = server.persistentData
    if (!('potTicks' in storage)) storage.potTicks = {}
    storage = storage.potTicks
    let key = String(level.dimension)
    if (!storage.contains(key)) storage[key] = {}
    return storage[key]
}
