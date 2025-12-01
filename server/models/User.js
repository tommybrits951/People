const pool = require("../config/PGconfig");
const db = require('../config/DBconfig');

async function getById(user_id) {
    return await db('users').where({user_id}).first();
}

async function insertUser(user) {
    const [user_id] = await db('users').insert(user).returning('user_id');
    console.log(user_id)
    const newUser = await getById(user_id);
    return newUser;
}


async function getByEmail(email) {
    return await db('users').where({email}).first();
}
async function getAllUsers() {
    return await db('users');
}
module.exports = {
    getById,
    insertUser,
    getByEmail
};