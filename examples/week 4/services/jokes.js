const baseColumns = ['j.id', 'j.title', 'j.question', 'j.answer', 'j.created_on',
  'u.display_name AS submitter', 'c.title AS category'];

const buildBaseJokesQuery = async (columns = baseColumns) => {
  const jokes = await knex('jokes j')
    .join('users u', 'u.id', 'j.created_by')
    .join('jokes_categories jc', 'j.id', 'jc.joke_id')
    .join('categories c', 'c.id', 'jc.category_id')
    .select(columns)
   return jokes.reduce((jokes, joke) => {
      const existing =
          jokes.find(({ id }) => id === joke.id);
        if (existing) {
          existing.categories.push(joke.category)
        }
      const categories = [joke.category];
        return [...jokes, { ...joke, categories }];
      }, []);
}

export const getRandomJoke = async () => {
  const count = await getJokesCount();
  const query = buildBaseJokesQuery();
  return query.
    .offset(knex.raw(`floor(random() * ${count})`))
    .limit(1);
});

export const getJokeById = id => 
  buildBaseJokesQuery().where({ id });

export const getJokeByCategoryId = id =>
  buildBaseJokesQuery()
    .where({ 'c.id': id });

export const addJoke = (joke, ...categoryIds) => {
  const [joke_id] = await knex('jokes')
                            .insert(joke)
                            .returning('id');
  const categoryRecords = categoryIds.map(
    category_id => ({ joke_id, category_id })
  );
  await knex('jokes_categories')
           .insert(categoryRecords);
  return {... joke, id: joke_id });
}

export const deleteJoke = id => {
  await knex('jokes').delete().where({ id });

  await knex('jokes_categories');
    .delete()
    .where({ joke_id: id });
}

export const addJokeCategory = 
  (joke_id, category_id) =>
    knex('jokes_categories')
      .insert({ category_id, joke_id })
      .where({ id });

export const removeJokeCategory =
  (joke_id, category_id) =>
    knex('jokes_categories')
      .delete()
      .where({ category_id, joke_id });

export const updateJoke =
  (id, jokeChanges) =>
    knex('jokes')
      .update(jokeChanges)
      .where({ id });

