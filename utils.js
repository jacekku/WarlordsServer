function stringifyMap(terrain) {
    const excluded = ['chunk', 'terrain']
    return JSON.stringify(terrain, (key,value) => {
        if(excluded.includes(key)) {
            return undefined
        }
        return value
    })
}

function clampNumber(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

module.exports = {
    stringifyMap,
    clampNumber
}