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
}
