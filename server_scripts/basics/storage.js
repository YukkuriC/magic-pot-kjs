{
    let funcGen = keyStorage => {
        /**
         * @param {Internal.MinecraftServer} server
         * @param {Internal.ServerLevel} level
         * @return {Internal.CompoundTag}
         */
        let inner = (server, level) => {
            let storage = server.persistentData
            if (!(keyStorage in storage)) storage[keyStorage] = {}
            storage = storage[keyStorage]
            let key = String(level.dimension)
            if (!storage.contains(key)) storage[key] = {}
            return storage[key]
        }
        return inner
    }

    this.getTickRecorder = funcGen('potTicks')
    this.getCacheRecorder = funcGen('potData')

    /**
     *
     * @param {Internal.CompoundTag} recorder
     * @param {string} key
     */
    this.getCacheFromMap = (recorder, key) => {
        let res = recorder.getCompound(key)
        recorder.put(key, res)
        return res
    }
}
