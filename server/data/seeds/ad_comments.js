exports.seed = async function(knex) {
  await knex('comments').del()
  await knex('comments').insert([
    {user_id: 2, post_id: 11, comment: "Comment number 1", time_commented: new Date()},
    {user_id: 4, post_id: 11, comment: "Comment number 1", time_commented: new Date()},
    {user_id: 2, post_id: 11, comment: "Comment number 1", time_commented: new Date()},
    {user_id: 3, post_id: 11, comment: "Comment number 1", time_commented: new Date()},
    {user_id: 2, post_id: 11, comment: "Comment number 1", time_commented: new Date()},
    {user_id: 2, post_id: 11, comment: "Comment number 1", time_commented: new Date()}
  ]);
};
