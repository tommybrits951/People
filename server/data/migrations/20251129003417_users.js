/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    // Basic Info
    tbl.bigIncrements("user_id").primary();
    tbl.string("first_name", 50).notNullable()
    tbl.string("last_name", 50).notNullable()
    tbl.string("email", 100).notNullable().unique()
    tbl.string("password").notNullable()
    
    // Profile Info
    tbl.date("dob").notNullable()
    tbl.string("gender", 20).defaultTo("Private")
    tbl.string("phone", 20)
    tbl.text("bio")
    tbl.string("location", 100)
    tbl.string("city", 50)
    tbl.string("state", 50)
    tbl.string("postal", 10)
    tbl.string("country", 50)
    
    // Social & Professional
    tbl.string("occupation", 100)
    tbl.string("company", 100)
    tbl.string("education", 150)
    tbl.string("website")
    tbl.string("facebook_url")
    tbl.string("twitter_url")
    tbl.string("instagram_url")
    tbl.string("linkedin_url")
    tbl.string("github_url")
    
    // Interests & Preferences
    tbl.json("interests")
    tbl.json("skills")
    tbl.string("relationship_status", 30)
    tbl.boolean("looking_for_work").defaultTo(false)
    tbl.string("timezone")
    tbl.boolean("notifications_enabled").defaultTo(true)
    tbl.boolean("profile_public").defaultTo(true)
    
    // Account Activity
    tbl.dateTime("joined").notNullable().defaultTo(knex.fn.now())
    tbl.dateTime("last_login")
    tbl.dateTime("updated_at")
    
    // Account Status
    tbl.boolean("is_verified").defaultTo(false)
    tbl.boolean("is_active").defaultTo(true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
