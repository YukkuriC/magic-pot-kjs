ServerEvents.tags('block', e => {
    e.add('forge:ores', 'amethyst_block')
    if (Platform.isLoaded('create')) e.add('forge:ores', 'andesite')
    if (Platform.isLoaded('irons_spellbooks')) e.add('forge:ores', 'irons_spellbooks:arcane_debris')
})
