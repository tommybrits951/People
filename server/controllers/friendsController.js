const Friend = require("../models/Friend")
const User = require("../models/User")


async function sendRequest(req, res) {
    try {
        const {friend_1_id, friend_2_id} = req.body;
        const friend1 = await User.getById(friend_1_id)
        const friend2 = await User.getById(friend_2_id)
        if (!friend1 || !friend2) {
            return res.status(400).json({message: "Could not find users."})
        }
        const friends_since = new Date()
        const response = await Friend.insertRequest({friend_1_id, friend_2_id, friends_since})
        if (response) {
            return res.status(201).json({message: "Request sent."})
        }
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}


async function getFriendsList(req, res) {
    try {
        const {user} = req;
        const {user_id} = user;
        const friends = await Friend.getAll(user_id)
        if (!friends) {
            return res.status(400).json({message: "You don't have friends."})
        }
        res.status(200).json(friends.rows)
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}

module.exports = {
    sendRequest,
    getFriendsList
}