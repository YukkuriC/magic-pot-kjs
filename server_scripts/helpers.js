function cutNamespace(id) {
    if (id.includes(':')) id = id.substring(id.indexOf(':') + 1)
    return id
}
