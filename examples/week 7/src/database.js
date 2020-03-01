import config from '../knexfile.js'
import knex from 'knex'
import pg from 'pg'

// Tell PG to return counts as numbers, not strings
pg.types.setTypeParser(20, 'text', parseInt);

export default knex(
  config[process.env.NODE_ENV || 'development']
);
