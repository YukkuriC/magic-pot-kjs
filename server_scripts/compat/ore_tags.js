ServerEvents.tags('block', e => {
    if (Platform.isLoaded('create')) e.add('forge:ores', 'andesite')
    if (Platform.isLoaded('irons_spellbooks')) e.add('forge:ores', 'irons_spellbooks:arcane_debris')
})
