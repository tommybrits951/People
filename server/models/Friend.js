const db = require("../config/DBconfig")
const pool = require('../config/PGconfig')

async function getById(id) {
    const result = await db("friends").where("friend_id", id).first()
    return result
}


async function insertRequest(request) {
    const [friend_id] = await db("friends").insert(request).returning("friend_id")
    const result = await getById(friend_id)
    return result
}

async function getAll(user_id) {
    
    return pool.query(`select * from users as u 
left join friends as f on u.user_id in (friend_1_id, friend_2_id)
where ${user_id} in (friend_1_id, friend_2_id) and user_id != ${user_id} and status = 'accepted';`)
}
async function accept(friend_1_id, friend_2_id) {
    
    return await db("friends")
        .where("friend_1_id", friend_1_id)
        .andWhere("friend_2_id", friend_2_id)
        .update({ status: "accepted", friends_since: new Date() })
} 

module.exports = {
    getById,
    insertRequest,
    getAll,
    accept
}