/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.bigIncrements("user_id").primary();
    tbl.string("first_name", 50).notNullable()
    tbl.string("last_name", 50).notNullable()
    tbl.date("dob").notNullable()
    tbl.string("gender").defaultTo("Private")
    tbl.bigInteger("postal").notNullable()
    tbl.dateTime("joined").notNullable()
    tbl.string("email", 100).notNullable().unique()
    tbl.string("password").notNullable()
    tbl.string("bio")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
