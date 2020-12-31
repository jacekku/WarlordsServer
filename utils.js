function stringifyMap(terrain) {
    const excluded = ['chunk', 'terrain']
    return JSON.stringify(terrain, (key,value) => {
        if(excluded.includes(key)) {
            return undefined
        }
        return value
    })
}

module.exports = {
    stringifyMap
}