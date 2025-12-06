const jwt = require("jsonwebtoken")

function checkAuth(req, res, next) {
    const bearer = req.headers.authorization;
    const token = bearer.split(" ")[1]
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
}

module.exports = {
    checkAuth
}