module.exports = accessChecker = (req, res, next) => {
    if(req.headers.access_key !== process.env.ACCESS_KEY) {
        res.sendStatus(403)
        return
    }
    next()
}