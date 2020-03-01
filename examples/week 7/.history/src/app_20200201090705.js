import express from 'express';
import graphqlHTTP from 'express-graphql'
import resolvers from './graphql/resolvers'
import schema from './graphql/schema'

const app = express();
app.use(express.json());

// const jokeRoute = async (request, response) => {
//   const { id } = request.params || {};
//   const joke = await getJokeById(parseFloat(id));
//   response.json(joke);
// };
// app.get('/api/joke/:id', jokeRoute);

// const randomRoute = async (request, response) => {
//   const joke = await getRandomJoke();
//   response.json(joke);
// };
// app.get('/api/random', randomRoute);

// const searchRoute = async (request, response) => {
//   const jokes = await getJokesByCategoryId(parseFloat(request.query.category));
//   response.json(jokes);
// };
// app.get('/api/search', searchRoute);

// const handleError = async (response, route) => {
//   try {
//     await route();
//   } catch (err) {
//     response.json({ success: false, message: JSON.stringify(err) });
//   }
// };

// const addJokeRoute = async (request, response) => {
//   handleError(response, async () => {
//     const joke = request.body;
//     joke.created_on = new Date(); // next week we'll learn to make SQL do this
//     await addJoke(joke);
//     response.json({ success: true });
//   });
// };
// app.post('/api/addJoke', addJokeRoute);

// const deleteJokeRoute = async (request, response) => {
//   handleError(response, async () => {
//     const { id } = request.query || {};
//     await deleteJoke(id);
//     response.json({ success: true });
//   });
// };
// app.get('/api/deleteJoke', deleteJokeRoute);
const graphiql = process.env.ENV || 'development';

app.use('/api/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql,
}));

const staticRoute = express.static('public');
app.use('/static', staticRoute);
app.use('/', staticRoute);

export default app;
