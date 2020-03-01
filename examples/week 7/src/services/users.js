import knex from '../database'
import { hashPassword } from '../auth'

export const getUserByUsername = async username =>
  (await knex('users').select().where({ username }))[0];

export const createUser = async ({ username, email, displayName, password }) => {
  const [user] = await knex('users').insert({
    username,
    email,
    display_name: displayName,
    password: await hashPassword(password)
  }).returning(['id', 'email', 'username', 'display_name', 'password']);
  return user;
}

const getOneWeekAgo = () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return oneWeekAgo;
};

export const savePasswordResetKey = async (username, key) =>
  await knex('password_resets').insert({
    key,
    user_id: (await getUserByUsername(username)).id
  });

export const getPasswordResetKey = async ({ id }) => {
  const [result] = await knex('password_resets')
    .select('key')
    .where({ user_id: id })
    .andWhere('created_on', '>', getOneWeekAgo())
    .orderBy('created_on', 'desc');
  return result ? result.key : null;
};

export const changePassword = async (id, password) =>
  knex('users')
    .update({ password: await hashPassword(password) })
    .where({ id });

export const deleteResets = ({ id }) =>
  knex('password_resets')
    .del()
    .where({ user_id: id })
