let PotUtils = {
    getPosKey(pos) {
        return `${pos.x},${pos.y},${pos.z}`
    },
    getBlockName(id) {
        return Text.translate(`block.${id.replace(':', '.')}`)
    },
    getSimpleBlockMsg(postfix, id, pos) {
        let blockName = PotUtils.getBlockName(id)
        let key = PotUtils.getPosKey(pos)
        return Text.translate('pot.block.' + postfix, blockName, key)
    },
    iterChunk(pos, callback, overrdeSize) {
        let chunkSize = overrdeSize || 16
        if (!pos.setX) pos = pos.mutable()
        let cx = Math.floor(pos.x / chunkSize) * chunkSize,
            cz = Math.floor(pos.z / chunkSize) * chunkSize,
            canceller = () => (canceller = null)
        for (let dx = 0; canceller && dx < chunkSize; dx++) {
            pos.setX(cx + dx)
            for (let dz = 0; canceller && dz < chunkSize; dz++) {
                pos.setZ(cz + dz)
                callback(canceller, pos)
            }
        }
    },
    getChunkHitbox(pos) {
        let cx = Math.floor(pos.x / 16) * 16,
            cz = Math.floor(pos.z / 16) * 16
        return AABB.of(cx, pos.y, cz, cx + 16, pos.y + 1, cz + 16)
    },
}
