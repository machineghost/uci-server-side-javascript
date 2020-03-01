import {
  addJoke,
  deleteJoke,
  getJokeById,
  getJokesByCategoryId,
  getRandomJoke,
  updateJoke
} from '../services/jokes';
import { sendResetEmail } from '../email'

import { compareHashed } from '../auth';
import {
  createUser,
  changePassword,
  deleteResets,
  getUserByUsername,
  getPasswordResetKey,
  savePasswordResetKey
} from '../services/users';
import { getRandomChuckJoke } from '../services/icndb';


const wrapSubmitter = joke => {
  // Wrap the submitter's displayName in an a "submitter" object"
  joke.submitter = { displayName: joke.submitter_name, id: joke.submitter_id };
  delete joke.submitter_id;
  delete joke.submitter_name;
  return joke;
}

const convertUserFromDatabase = user => {
  user.displayName = user.display_name;
  delete user.display_name;
  return user;
}

const resolvers = {
  addJoke: async ({ joke }, { session }) => {
    if (!session.user) throw new Error('Only logged in users can add jokes');
    // Convert submitter (GraphQL) => created_by (Postgres)
    joke.created_by = session.user.id; // GraphQL IDs are strings
    delete joke.submitter;

    // Extract category IDs and convert them into numbers
    const categoryIds = joke.categoryIds.map(parseFloat);
    delete joke.categoryIds;
    const { id } = await addJoke(joke, ...categoryIds);
    return wrapSubmitter(await getJokeById(id));
  },
  chuckJoke: async () => wrapSubmitter(await getRandomChuckJoke()),
  currentUser: (args, { session }) => session.user,
  deleteJoke: async ({ id }, session) => {
    try {
      const joke = await getJokeById(id);
      if (!session.user || !joke) throw new Error('not logged in or invalid joke');
      if (!joke.created_by === session.user.id) throw new Error('someone else\'s joke');

      await deleteJoke(parseFloat(id));
    } catch (err) {
      console.error(err);
      return { wasSuccessful: false };
    }
    return { wasSuccessful: true };
  },
  joke: async ({ id }) => wrapSubmitter(await getJokeById(id)),
  jokes: async ({ categoryId }) =>
    (await getJokesByCategoryId(categoryId)).map(wrapSubmitter),
  login: async ({ loginInput: { username, password } }, { session }) => {
    const user = await getUserByUsername(username);
    const matches = await compareHashed(password, user.password);
    session.user = matches ? convertUserFromDatabase(user) : null;
    return session.user;
  },
  logout: async (args, { session }) => {
    delete session.user
    return { wasSuccessful: true };
  },
  randomJoke: async () => wrapSubmitter(await getRandomJoke()),
  requestPasswordReset: async ({ username }) => {
    try {
      const key = await sendResetEmail(await getUserByUsername(username));
      await savePasswordResetKey(username, key);
    } catch (err) {
      console.log(err);
      return { wasSuccessful: false };
    }
    return { wasSuccessful: true };
  },
  resetPassword: async ({ resetInput: { username, password, key } },
    { session }) => {
    const user = await getUserByUsername(username);
    const actualKey = await getPasswordResetKey(user);
    if (key !== actualKey) throw new Error('Invalid password reset key');

    await changePassword(user.id, password);
    await deleteResets(user);
    session.user = convertUserFromDatabase(user);
    return session.user;
  },
  signup: async ({ user }, { session }) => {
    session.user = convertUserFromDatabase(await createUser(user));
    return session.user;
  },
  updateJoke: async ({ id, update }) => {
    if (update.categories) await updateJokeCategories(parseFloat(id), update.categories);
    delete update.categories;

    await updateJoke(parseFloat(id), update);
    return wrapSubmitter(await getJokeById(id));
  },
};

export default resolvers;
