exports.seed = async knex => {
  await knex('users').truncate();
  await knex('users').insert([
    { display_name: 'Jeremy Walker', username: 'jwalker' },
    { display_name: 'Testy McFakington', username: 'test' },
    { display_name: 'Internet Chuck Norris Database (http://www.icndb.com/)', username: 'icndb' },
  ]);
};

