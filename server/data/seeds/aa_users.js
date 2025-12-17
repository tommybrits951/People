exports.seed = async function(knex) {
  await knex('users').del()
  await knex('users').insert([
    {first_name: "Tommy", last_name: "Brits", email: "tommybrits74@gmail.com", password: "$2b$10$SWuuGNCHLYAlGjJWc4nIeOhRANDb6JtYwm6EGLaXbNmQga0UZvRQy", dob: "1986-07-14", gender: "Male", postal: 92553, joined: "2024-01-01T00:00:00.000Z"},
    {first_name: "Gerald", last_name: "Cramer", email: "gerald@gerald.com", password: "$2b$10$SWuuGNCHLYAlGjJWc4nIeOhRANDb6JtYwm6EGLaXbNmQga0UZvRQy", dob: "1980-09-20", gender: "Male", postal: 92570, joined: "2024-01-01T00:00:00.000Z"},
    {first_name: "Jimmy", last_name: "Smith", email: "jimmy@jimmy.com", password: "$2b$10$SWuuGNCHLYAlGjJWc4nIeOhRANDb6JtYwm6EGLaXbNmQga0UZvRQy", dob: "1990-09-16", gender: "Male", postal: 92543, joined: "2024-01-01T00:00:00.000Z"},
    {first_name: "Jenn", last_name: "Johnson", email: "jenn@jenn.com", password: "$2b$10$SWuuGNCHLYAlGjJWc4nIeOhRANDb6JtYwm6EGLaXbNmQga0UZvRQy", dob: "1991-07-16", gender: "Female", postal: 92543, joined: "2024-01-01T00:00:00.000Z"},
    {first_name: "Tim", last_name: "Madock", email: "tim@tim.com", password: "$2b$10$SWuuGNCHLYAlGjJWc4nIeOhRANDb6JtYwm6EGLaXbNmQga0UZvRQy", dob: "1990-01-12", gender: "Male", postal: 92570, joined: "2024-01-01T00:00:00.000Z"},
    {first_name: "Todd", last_name: "Mills", email: "todd@todd.com", password: "$2b$10$SWuuGNCHLYAlGjJWc4nIeOhRANDb6JtYwm6EGLaXbNmQga0UZvRQy", dob: "1990-01-12", gender: "Male", postal: 92570, joined: "2024-01-01T00:00:00.000Z"},
    {first_name: "Bob", last_name: "Mills", email: "bob@bob.com", password: "$2b$10$SWuuGNCHLYAlGjJWc4nIeOhRANDb6JtYwm6EGLaXbNmQga0UZvRQy", dob: "1990-01-12", gender: "Male", postal: 92570, joined: "2024-01-01T00:00:00.000Z"},
  ]);
};
