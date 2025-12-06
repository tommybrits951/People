const pool = require("../config/PGconfig");


function getById(post_id) {
    return pool.query(`SELECT * FROM posts WHERE post_id = ${post_id}`)
}

async function insertPost(post) {
    const result = await pool.query(`INSERT INTO posts ('post', 'time_posted', 'user_id') VALUES (${post.post}, ${post.time_posted}, ${post.user_id});`)
    return result
}

module.exports = {
    getById,
    insertPost
}