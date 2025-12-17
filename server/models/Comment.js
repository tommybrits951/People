const db = require("../config/DBconfig");
const pg = require("../config/PGconfig");



function getById(comment_id) {
    return db("comments").where("comment_id", comment_id).first
}

async function insertComment(comment) {
    const result = await db("comments").insert(comment).returning("comment_id");
    const insertedId = result[0]?.comment_id || result[0];
    return await db("comments").where("comment_id", insertedId).first();
}

async function getCommentsByPostId(post_id) {
    return await db("comments")
        .join("users", "comments.user_id", "users.user_id")
        .select(
            "comments.*",
            "users.first_name",
            "users.last_name",
            "users.email"
        )
        .where("comments.post_id", post_id)
        .andWhere("comments.parent_comment_id", null)
        .orderBy('comments.time_commented', 'desc');
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