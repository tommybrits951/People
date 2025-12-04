const db = require("../config/DBconfig")


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
    
    const result = await db("friends")
        .where(function() {
            this.where("friend_1_id", user_id).orWhere("friend_2_id", user_id)
        })
        .andWhere("status", "accepted")
    return result
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