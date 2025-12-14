const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")


function buildToken(user, exp) {
    const {first_name, last_name, user_id, email, dob, gender, postal} = user
    const payload = {
        first_name,
        last_name,
        user_id,
        email,
        dob,
        gender,
        postal 
    }
    const options = {
        expiresIn: exp
    }
    return jwt.sign(payload, process.env.JWT_SECRET, options)
}




async function login(req, res) {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "All fields required."})
        }

        const user = await User.getByEmail(email)
        const validated = bcrypt.compareSync(password, user.password)

        if (!user || !validated) {
            return res.status(401).json({message: "Email or Password incorrect."})
        }

        const refreshToken = buildToken(user, "1d")
        const accessToken = buildToken(user, "1h")

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None"    
        })
        res.json(accessToken)
    } catch (err) {
        return res.status(500).json({message: "Server Error."})
    }
}



async function refresh(req, res) {
    try {
        const refreshToken = req.cookies.jwt
        if (!refreshToken) {
            return res.status(401).json({message: "Unauthorized."})
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
        const user = await User.getByEmail(decoded.email)
        const accessToken = buildToken(user, "1h")
        return res.json(accessToken)
    }
    catch (err) {
        return res.status(500).json({message: "Server Error."})
    }
}

async function decode(req, res) {
    try {
        const accessToken = req.headers.authorization
        const auth = accessToken.split(" ")[1]
        
        const decoded = jwt.decode(auth, process.env.JWT_SECRET)
        if (!accessToken) {
            return res.status(401).json({message: "Unauthorized."})
        }
        res.json(decoded)
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}


function logout(req, res) {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        res.json({message: "Logged out successfully."})
    } catch (err) {
        return res.status(500).json({message: "Server Error."})
    }
}

module.exports = {
    login,
    refresh,
    decode,
    logout
}