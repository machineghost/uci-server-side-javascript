import express from 'express';
import graphqlHTTP from 'express-graphql'
import session from 'express-session'
import ConnectSessionKnex from 'connect-session-knex'

import resolvers from './graphql/resolvers'
import schema from './graphql/schema'
import knex from './database'

const env = process.env.NODE_ENV || 'development';

const app = express();
app.use(express.json());

// Global Error Handler
if (!['development', 'test'].includes(env)) {
  app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send();
  });
}

const ONE_MONTH = 7 * 24 * 60 * 60 * 1000;
const KnexSessionStore = ConnectSessionKnex(session);
app.use(session({
  store: new KnexSessionStore({ knex }),
  secret: 'a secret can be any text ... hi class',
  cookie: { maxAge: ONE_MONTH }
}));

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
