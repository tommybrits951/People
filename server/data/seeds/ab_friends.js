exports.seed = async function(knex) {
  await knex('friends').del()
  await knex('friends').insert([
  {friend_1_id: 1, friend_2_id: 2, friends_since: new Date(), status: "pending"},
  {friend_1_id: 3, friend_2_id: 2, friends_since: new Date(), status: "pending"},
  {friend_1_id: 4, friend_2_id: 1, friends_since: new Date(), status: "accepted"},
  {friend_1_id: 1, friend_2_id: 3, friends_since: new Date(), status: "accepted"},
  {friend_1_id: 5, friend_2_id: 1, friends_since: new Date(), status: "accepted"},
  ]);
};
