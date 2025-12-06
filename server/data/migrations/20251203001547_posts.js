/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("posts", tbl => {
    tbl.bigIncrements("post_id").primary()
    tbl.string("post").notNullable()
    tbl.dateTime('time_posted').notNullable()
    tbl.bigInteger("user_id").unsigned().references("user_id").inTable("users")
  })
  .createTable("comments", tbl => {
    tbl.bigInteger("comment_id").primary()
    tbl.bigInteger("post_id").unsigned().references("post_id").inTable("posts")
    tbl.bigInteger("parent_comment_id").unsigned().references("comment_id").inTable("comments")
    tbl.dateTime("time_commented").notNullable()
  })
  .createTable("post_images", tbl => {
    tbl.bigIncrements(post_image_id).primary()
    tbl.bigInteger("post_id").unsigned().references("post_id").inTable("posts")
    tbl.string("filename").notNullable()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("post_images").dropTableIfExists("comments").dropTableIfExists("posts")
};
