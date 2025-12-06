const Post = require("../models/Post")
const fsPromises = require('fs/promises')
const path = require("path")

async function post(req, res) {
    try {
        const {user_id, post} = req.body;
        const files = req.files
        if (files.length > 0) {
            let posts = `${post}imagePaths`;
            for (let i = 0; i < files.length; i++) {
                const path = `${user_id}_${Date.now()}_${i}.png`
                posts += path;
                fsPromises.writeFile(path.join(__dirname, "..", "images", "gallery", path), files[i].data)
            }
            const time_posted = new Date()
            const response = await Post.insertPost({user_id, post: posts, time_posted})
            res.json(response)
        } else {
            const time_posted = new Date()
            const response = await Post.insertPost({user_id, post, time_posted})
            res.json(response)

        }
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}

module.exports = {
    post
}