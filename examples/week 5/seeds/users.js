exports.seed = async knex => {
  await knex('users').truncate();
  await knex('users').insert([
    { display_name: 'Jeremy Walker', username: 'jwalker' },
    { display_name: 'Testy McFakington', username: 'test' },
  ]);
};

