/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {first_name: "Tommy", last_name: "Brits", email: "tommybrits74@gmail.com", password: "$2b$10$SWuuGNCHLYAlGjJWc4nIeOhRANDb6JtYwm6EGLaXbNmQga0UZvRQy", dob: "1986-07-14", gender: "Male", postal: 92553, joined: "2024-01-01T00:00:00.000Z"},
  ]);
};
