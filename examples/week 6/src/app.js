import express from 'express';
import graphqlHTTP from 'express-graphql'
import resolvers from './graphql/resolvers'
import schema from './graphql/schema'

const app = express();
app.use(express.json());

const env = process.env.NODE_ENV || 'development';
// All of our old dynamic routes used to be here ...
// ... but they've now been replaced with:
app.use('/api/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: env === 'development',
}));

const staticRoute = express.static('public');
app.use('/static/', staticRoute);
app.use('/', staticRoute);

export default app;
