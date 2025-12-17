const db = require("../config/DBconfig")
const pg = require("../config/PGconfig")

async function getById(post_id) {
    const post = await pg.query(`SELECT p.*, u.first_name, u.last_name, u.email FROM posts as p LEFT JOIN users as u ON u.user_id = p.user_id WHERE p.post_id = ${post_id};`)
    return post.rows[0]
}

async function getAll() {
    return await pg.query(`select p.*, u.first_name, u.last_name, u.email from posts as p left join users as u on p.user_id = u.user_id order by p.time_posted desc;`)
}
async function insertPost(post) {
    const result = await db("posts").insert(post)
    console.log(result)
    
}
module.exports = {
    getById,
    insertPost,   
    getAll
}