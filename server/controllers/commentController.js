const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')

async function createComment(req, res) {
    try {
        const {post_id, comment, parent_comment_id, user_id} = req.body;
        const user = await User.getById(user_id)
        if (!user) {
            return res.status(401).json({message: "Couldn't verify your user profile."})
        }
        const post = await Post.getById(post_id)
        if (!post) {
            return res.status(400).json({message: "Couldn't verify the post."})
        }
        if (!comment) {
            return res.status(400).json({message: "Missing comment field."})
        }
        const results = await Comment.insertComment({post_id, comment, parent_comment_id, user_id, time_commented: new Date()})
        res.status(201).json(results)
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}
async function getComments(req, res) {
    try {
        const {post_id} = req.params;
        const comments = await Comment.getCommentsByPostId(post_id)
        let arr = []
        for (let i = 0; i < comments.length; i++) {
            const childComments = await Comment.getChildComments(comments[i].comment_id)
            if (childComments) {
                arr.push({...comments[i], child_comments: childComments})
            } else {
                arr.push({...comments[i], child_comments: []})
            }
         }
         res.json(arr)
    } catch (err) {
        return res.status(500).json({message: err.message || "Server error."})
    }
}

module.exports = {
    createComment,
    getComments
}