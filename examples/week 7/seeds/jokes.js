exports.seed = async knex => {
  await knex('jokes').del();
  await knex('jokes_categories').truncate();
  await knex('jokes').insert([
    {
      title: 'Cross Twice?',
      question: 'Why did the chicken cross the road twice?',
      answer: 'Because he was a double-crosser!',
      created_by: 1
    },
    {
      title: 'Turkey Cross?',
      question: 'Why did the turkey cross the road?',
      answer: 'To prove he wasn\'t chicken!',
      created_by: 1
    },
    {
      title: 'When life gives ...',
      question: 'When life gives you melons, you\'re dyslexic!',
      created_by: 1
    },
    {
      title: 'What do you call a bee ...',
      question: 'What do you call a bee that can\'t make up its mind?',
      answer: 'A maybe!',
      created_by: 1
    },
    {
      title: 'Cow',
      question: 'Knock knock. Who\'s there? Cow. Cow who?',
      answer: 'No, a cow says moo!',
      created_by: 1
    }
  ]);
  await knex('jokes_categories').insert([
    { joke_id: 1, category_id: 1 },
    { joke_id: 2, category_id: 1 },
    { joke_id: 2, category_id: 3 },
    { joke_id: 3, category_id: 5 },
    { joke_id: 4, category_id: 5 },
    { joke_id: 5, category_id: 2 }
  ]);
};
