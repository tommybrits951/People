const jwt = require("jsonwebtoken")

function checkAuth(req, res, next) {
    const accessToken = req.cookies.jwt
    if (!accessToken) {
        return res.status(401).json({message: "Unauthorized."})
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    req.user = decoded
    next()
}

module.exports = {
    checkAuth
}