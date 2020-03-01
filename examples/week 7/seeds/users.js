import { hashPassword } from '../src/auth';

export const seed = async knex => {
  await knex('users').truncate();
  await knex('users').insert([
    {
      display_name: 'Jeremy Walker',
      email: 'not.my.real.email.to.avoid.spam@example.com',
      password: await hashPassword('dev-pass'),
      username: 'jwalker'
    },
    {
      display_name: 'Testy McFakington',
      email: 'testy@example.com',
      password: await hashPassword('fakepass'),
      username: 'test'
    },
    {
      display_name: 'Internet Chuck Norris Database (http://www.icndb.com/)',
      email: 'admin@icndb.com',
      username: 'icndb'
    },
  ]);
};

