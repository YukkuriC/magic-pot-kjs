let PotUtils = {
    getPosKey(pos) {
        return `${pos.x},${pos.y},${pos.z}`
    },
    getBlockName(id) {
        return Text.translate(`block.${id.replace(':', '.')}`)
    },
}
