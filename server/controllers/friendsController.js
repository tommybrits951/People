const Friend = require("../models/Friend")
const User = require("../models/User")


async function sendRequest(req, res) {
    try {
        const {user_id} = req.user
        const {friend_2_id} = req.body
        
        if (!friend_2_id) {
            return res.status(400).json({message: "friend_2_id is required."})
        }
        
        const friend1 = await User.getById(user_id)
        const friend2 = await User.getById(friend_2_id)
        if (!friend1 || !friend2) {
            return res.status(400).json({message: "Could not find users."})
        }

        const existing = await Friend.checkExisting(user_id, friend_2_id)
        if (existing) {
            return res.status(400).json({message: "Friend request already exists."})
        }
        
        const response = await Friend.insertRequest({friend_1_id: user_id, friend_2_id, status: "pending"})
        if (response) {
            return res.status(201).json({message: "Request sent.", friend_request: response})
        }
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}


async function getFriendsList(req, res) {
    try {
        const {user_id} = req.user
        const friends = await Friend.getAll(user_id)
        if (!friends || friends.rows.length === 0) {
            return res.status(200).json([])
        }
        res.status(200).json(friends.rows)
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}

async function getPendingRequests(req, res) {
    try {
        const {user_id} = req.user
        const pending = await Friend.getPending(user_id)
        if (!pending || pending.rows.length === 0) {
            return res.status(200).json([])
        }
        res.status(200).json(pending.rows)
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}

async function acceptRequest(req, res) {
    try {
        const {user_id} = req.user
        const {friend_id} = req.params
        
        const friendRequest = await Friend.getById(friend_id)
        if (!friendRequest) {
            return res.status(404).json({message: "Friend request not found."})
        }

        if (friendRequest.friend_2_id !== user_id) {
            return res.status(403).json({message: "Unauthorized."})
        }
        
        const result = await Friend.accept(friendRequest.friend_1_id, friendRequest.friend_2_id)
        res.status(200).json({message: "Friend request accepted."})
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}

async function rejectRequest(req, res) {
    try {
        const {user_id} = req.user
        const {friend_id} = req.params
        
        const friendRequest = await Friend.getById(friend_id)
        if (!friendRequest) {
            return res.status(404).json({message: "Friend request not found."})
        }

        if (friendRequest.friend_2_id !== user_id && friendRequest.friend_1_id !== user_id) {
            return res.status(403).json({message: "Unauthorized."})
        }
        
        const result = await Friend.reject(friend_id)
        res.status(200).json({message: "Friend request rejected."})
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}

async function getFriendStatus(req, res) {
    try {
        const {user_id} = req.user
        const {user_id: targetUserId} = req.params
        
        const status = await Friend.getStatus(user_id, targetUserId)
        res.status(200).json({status})
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}

module.exports = {
    sendRequest,
    getFriendsList,
    getPendingRequests,
    acceptRequest,
    rejectRequest,
    getFriendStatus
}