import { expect } from 'chai';
import {
  getRandomChuckJoke
} from '../../src/services/icndb';

describe('icndb services', () => {
  describe('getRandomChuckJoke', () => {
    it('returns a random joke', async () => {
        expect((await getRandomChuckJoke()).question).to.be.a.string;
    });
  });
});
