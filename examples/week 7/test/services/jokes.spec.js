import { expect } from 'chai';
import {
  addJoke,
  deleteJoke,
  getRandomJoke,
  getJokeById,
  getJokesByCategoryId,
  updateJoke
} from '../../src/services/jokes';
import knex from '../../src/database'

describe('jokes services', () => {
  describe('getRandomJoke', () => {
    it('returns a random joke', async () => {
      let jokeIds = [];
      for (let i = 1; i <= 5; i++) {
        const joke = await getRandomJoke();
        jokeIds.push(joke.id);
      };
      const firstId = jokeIds[0];
      /// expect at least one of jokes #2-#4 to not be joke #1
      expect(
        firstId !== jokeIds[1] || firstId !== jokeIds[2] ||
        firstId !== jokeIds[3] || firstId !== jokeIds[4]
      ).to.be.true;
    });
  });

  describe('getJokeById', () => {
    it('returns the expected joke', async () => {
      const { title } = await getJokeById(1);
      expect(title).to.equal('Cross Twice?');
    });
    it('returns null for an invalid id', async () => {
      const joke = await getJokeById(12345);
      expect(joke).to.be.undefined;
    });
  });

  const CHICKEN_JOKES = 1;
  describe('getJokesByCategoryId', () => {
    it('returns two chicken jokes', async () =>
      expect(await getJokesByCategoryId(CHICKEN_JOKES)
      ).to.have.length(2)
    );
    it('returns zero jokes for an invalid category',
      async () =>
        expect(await getJokesByCategoryId(-1))
          .to.be.empty
    );
  });

  const fakeJoke = { question: 'foo', title: 'bar', created_by: 1 };
  describe('fake records tests', () => {
    let joke_id;
    beforeEach(async () => {
      const ids = await knex('jokes').insert(fakeJoke).returning('id');
      joke_id = ids[0]
      await knex('jokes_categories')
        .insert({ category_id: 1, joke_id });
    });
    afterEach(async () => {
      await knex('jokes').del().where({ id: joke_id });
      await knex('jokes_categories').del().where({ joke_id });
    });
    describe('deleteJoke', () => {
      it('deletes the joke & related record', async () => {
        await deleteJoke(joke_id);
        expect(await knex('jokes')
          .where({ id: joke_id })).to.be.empty // no joke
        expect(await knex('jokes_categories')
          .where({ joke_id })).to.be.empty // no JOINs
      });
      it('has no effect on an invalid ID', async () => {
        await deleteJoke(-1);
        expect(await knex('jokes')).to.have.length(6);
        expect(await knex('jokes_categories'))
          .to.have.length(7);
      });
    });

    describe('updateJoke', async () => {
      it('updates the joke\'s title to "baz"', async () => {
        await updateJoke(joke_id, { title: 'baz' });
        const [joke] = await knex('jokes')
          .where({ id: joke_id });
        expect(joke.title).to.equal('baz');
      });
    });
  });
  describe('addJoke', () => {
    it('adds the joke to the database', async () => {
      const { id } = await addJoke(fakeJoke, 1, 2);
      expect(
        await knex('jokes').where({ title: 'bar' })
      ).to.have.length(1);
      expect(
        await knex('jokes_categories').where({ joke_id: id })
      ).to.have.length(2);
    });

    it('throws an error when given no joke', async () => {
      let wasErrorThrown = false;
      try {
        await addJoke(null, 1, 2);
      } catch (err) {
        wasErrorThrown = true;
      }
      expect(wasErrorThrown).to.be.true;
    });
    afterEach(async () => {
      await knex('jokes').where({ title: 'bar' }).del();
    })
  });
});
