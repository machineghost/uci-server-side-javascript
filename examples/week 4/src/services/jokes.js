import knex from '../database'

const selectColumns = ['j.id', 'j.title', 'j.question', 'j.answer',
  'j.created_on', 'u.display_name AS submitter'];

const buildBaseJokesQuery = (whereClause = {}) =>
  knex('jokes AS j')
    .join('users AS u', 'u.id', 'j.created_by')
    .join('jokes_categories AS jc', 'j.id', 'jc.joke_id')
    .join('categories AS c', 'c.id', 'jc.category_id')
    .select(selectColumns)
    .where(whereClause);

const combineJokeRows = jokeRows => jokeRows.reduce((jokes, joke) => {
  const existing = jokes.find(({ 'j.id': id }) => id === joke.id);
  if (existing) { // If it exists, add its category
    existing.categories.push(joke.category);
    return jokes;
  } // If not, add the row (with categories property)
  joke.categories = [joke.category];
  return jokes.concat(joke);
}, []);


const getJokesCount = async () => parseFloat((await knex('jokes').count())[0].count);

export const getRandomJoke = async () => {
  const count = await getJokesCount();
  const query = buildBaseJokesQuery()
    .offset(knex.raw(`floor(random() * ${count})`))
    .limit(1);

  const rows = await query;
  return combineJokeRows(rows)[0];
};

export const getJokeById = async id =>
  combineJokeRows(await buildBaseJokesQuery().where({ 'j.id': id }))[0];

export const getJokesByCategoryId = async id =>
  combineJokeRows(await buildBaseJokesQuery().where({ 'c.id': id }));

export const addJoke = async (joke, ...categoryIds) => {
  const [joke_id] = await knex('jokes').insert(joke).returning('id');
  const categoryRecords = categoryIds.map(
    category_id => ({ joke_id, category_id })
  );
  await knex('jokes_categories')
    .insert(categoryRecords);
  return { ...joke, id: joke_id };
};

export const deleteJoke = async id => {
  await knex('jokes').delete().where({ id });

  await knex('jokes_categories')
    .delete()
    .where({ joke_id: id });
};

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

export const updateJoke = (id, jokeChanges) =>
  knex('jokes').update(jokeChanges).where({ id });
