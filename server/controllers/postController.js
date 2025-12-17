const User = require('../models/User')
const Post = require("../models/Post")
const fsPromises = require('fs/promises')
const path = require("path")
const {format} = require('date-fns')
async function post(req, res) {
    try {
        const {user_id, post} = req.body;
        console.log(req.body)
        if (!user_id) {
            return res.status(400).json({message: "Missing user_id."})
        }
        if (!post) {
            return res.status(400).json({message: "Missing post."})
        }
        const time_posted = new Date()
        
        const result = await Post.insertPost({user_id: parseInt(user_id), post, time_posted})
        res.json(result)

    } catch (err) {
        console.error("post error:", err);
        return res.status(500).json({ message: err.message || "Server error." });
    }
}

async function getPosts(req, res) {
    try {
        const posts = await Post.getAll()
        return res.status(200).json(posts.rows);
    } catch (err) {
        console.error("getPosts error:", err);
        return res.status(500).json({ message: err.message || "Server error." });
    }
}

async function deletePost(req, res) {

}

module.exports = {
    post,
    getPosts,
    deletePost
}
