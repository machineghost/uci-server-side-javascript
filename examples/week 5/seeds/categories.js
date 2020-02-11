exports.seed = async knex => {
  await knex('categories').truncate();
  await knex('categories').insert([
    { title: 'Chicken' }, { title: 'Knock Knock' },
    { title: 'One-Line' }, { title: 'Long Form' },
    { title: 'Pun' },
  ]);
};
