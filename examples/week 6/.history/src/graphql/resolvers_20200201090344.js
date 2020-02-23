import { addJoke, deleteJoke, getJokeById, getJokesByCategoryId, getRandomJoke }
  from './services/jokes';

const resolvers = {
  async joke({ id }) {
    return await getJokeById(id);
  },
  jokes({ categoryId }) {
    return await getJokesByCategoryId(categoryId);
  },
  randomJoke() {
    return await getRandomJoke();
  }
};

export default resolvers;