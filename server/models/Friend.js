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
    
    return pool.query(`select u.*, f.friend_id, f.status, f.friends_since from users as u 
left join friends as f on u.user_id in (f.friend_1_id, f.friend_2_id)
where ${user_id} in (f.friend_1_id, f.friend_2_id) and u.user_id != ${user_id} and f.status = 'accepted';`)
}

async function getPending(user_id) {
    return pool.query(`select u.*, f.friend_id, f.friend_1_id, f.friend_2_id, f.status from users as u
join friends as f on u.user_id = f.friend_1_id
where f.friend_2_id = ${user_id} and f.status = 'pending';`)
}

async function accept(friend_1_id, friend_2_id) {
    return await db("friends")
        .where("friend_1_id", friend_1_id)
        .andWhere("friend_2_id", friend_2_id)
        .update({ status: "accepted", friends_since: new Date() })
}

async function reject(friend_id) {
    return await db("friends").where("friend_id", friend_id).del()
}

async function checkExisting(user1_id, user2_id) {
    const result = await db("friends")
        .where(db.raw(`(friend_1_id = ${user1_id} and friend_2_id = ${user2_id}) or (friend_1_id = ${user2_id} and friend_2_id = ${user1_id})`))
        .first()
    return result
}

async function getStatus(user1_id, user2_id) {
    const request = await db("friends")
        .where(db.raw(`(friend_1_id = ${user1_id} and friend_2_id = ${user2_id}) or (friend_1_id = ${user2_id} and friend_2_id = ${user1_id})`))
        .first()
    
    if (!request) return "none"
    if (request.status === "accepted") return "friends"
    if (request.friend_1_id === user1_id) return "pending"
    return "request"
}

module.exports = {
    getById,
    insertRequest,
    getAll,
    getPending,
    accept,
    reject,
    checkExisting,
    getStatus
}