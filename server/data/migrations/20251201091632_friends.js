exports.up = function(knex) {
  return knex.schema.createTable('friends', tbl => {
    tbl.bigIncrements("friend_id").primary();
    tbl.bigInteger("friend_1_id").unsigned().references("user_id").inTable("users");
    tbl.bigInteger("friend_2_id").unsigned().references("user_id").inTable("users");
    tbl.dateTime("friends_since").notNullable();
    tbl.string("status").defaultTo("pending")
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("friends");
};
