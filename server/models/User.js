const pool = require("../config/PGconfig");
const db = require('../config/DBconfig');


const fields = ["user_id", "first_name", "last_name", "email", "dob", "gender", "postal", "joined"]

async function getById(user_id) {
    return await db('users').where("user_id", user_id).select(fields).first();
}

async function insertUser(user) {
    const [{user_id}] = await db('users').insert(user).returning('user_id');
    const newUser = await getById(user_id)
    return newUser;
}


async function getByEmail(email) {
    return await db('users').where("email", email).first();
}
async function getAllUsers() {
    return await db('users').select(fields);
}
module.exports = {
    getById,
    insertUser,
    getByEmail,
    getAllUsers
};