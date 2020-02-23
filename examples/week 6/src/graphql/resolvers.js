import {
  addJoke,
  deleteJoke,
  getJokeById,
  getJokesByCategoryId,
  getRandomJoke,
  updateJoke
} from '../services/jokes';

import { getRandomChuckJoke } from '../services/icndb';


const wrapSubmitter = joke => {
  // Wrap the submitter's displayName in an a "submitter" object"
  joke.submitter = { displayName: joke.submitter_name, id: joke.submitter_id };
  delete joke.submitter_id;
  delete joke.submitter_name;
  return joke;
}

const resolvers = {
  addJoke: async ({ joke }) => {
    // Convert submitter (GraphQL) => created_by (Postgres)
    joke.created_by = parseFloat(joke.submitter); // GraphQL IDs are strings
    delete joke.submitter;

    // Extract category IDs and convert them into numbers
    const categoryIds = joke.categoryIds.map(parseFloat);
    delete joke.categoryIds;
    const { id } = await addJoke(joke, ...categoryIds);
    return wrapSubmitter(await getJokeById(id));
  },
  chuckJoke: async () => wrapSubmitter(await getRandomChuckJoke()),
  deleteJoke: async ({ id }) => {
    try {
      await deleteJoke(parseFloat(id));
    } catch (err) {
      return { wasSuccessful: false };
    }
    return { wasSuccessful: true };
  },
  joke: async ({ id }) => wrapSubmitter(await getJokeById(id)),
  jokes: async ({ categoryId }) =>
    (await getJokesByCategoryId(categoryId)).map(wrapSubmitter),
  randomJoke: async () => wrapSubmitter(await getRandomJoke()),
  updateJoke: async ({ id, update }) => {
    if (update.categories) await updateJokeCategories(parseFloat(id), update.categories);
    delete update.categories;

    await updateJoke(parseFloat(id), update);
    return wrapSubmitter(await getJokeById(id));
  },
};

export default resolvers;
