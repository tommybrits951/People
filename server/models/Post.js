const db = require("../config/DBconfig")
const pg = require("../config/PGconfig")

function getById(post_id) {
    const post = pg.query(`SELECT p.*,  FROM posts as p LEFT JOIN users as u ON u.user_id = p.user_id where p.post_id = ${post_id};`)
    return post
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