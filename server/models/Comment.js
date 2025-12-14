const db = require("../config/DBconfig");
const pg = require("../config/PGconfig");



function getById(comment_id) {
    return db("comments").where("comment_id", comment_id).first
}

async function insertComment(comment) {
    const result = await db("comments").insert(comment).returning("comment_id");
    return await db("comments").where("comment_id", result.comment_id).first();
}

async function getCommentsByPostId(post_id) {
    return await db("comments").where("post_id", post_id).andWhere("parent_comment_id", null).orderBy('time_commented');
}
function getChildComments(parent_comment_id) {
    return db("comments").where("parent_comment_id", parent_comment_id).orderBy("time_commented")
}
module.exports = {
    insertComment,
    getCommentsByPostId,
    getById,
    getChildComments
}