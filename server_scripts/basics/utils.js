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
    iterChunk(pos, callback) {
        if (!pos.setX) pos = pos.mutable()
        let cx = Math.floor(pos.x / 16) * 16,
            cz = Math.floor(pos.z / 16) * 16,
            canceller = () => (canceller = null)
        for (let dx = 0; canceller && dx < 16; dx++) {
            pos.setX(cx + dx)
            for (let dz = 0; canceller && dz < 16; dz++) {
                pos.setZ(cz + dz)
                callback(canceller, pos)
            }
        }
    },
    getChunkHitbox(pos) {

    },
}
