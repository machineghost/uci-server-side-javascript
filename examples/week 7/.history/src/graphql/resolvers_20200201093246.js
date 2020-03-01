import { addJoke, deleteJoke, getJokeById, getJokesByCategoryId, getRandomJoke }
  from '../services/jokes';

const resolvers = {
  async joke({ id }) {
    return await getJokeById(id);
  },
  async jokes({ categoryId }) {
    return await getJokesByCategoryId(categoryId);
  },
  async randomJoke() {
    console.log(await getRandomJoke())
    return await getRandomJoke();
  }
};

export default resolvers;