import { expect } from 'chai';
import { getJokeById, getJokes, getRandomJoke } from '../src/jokes';

describe('getJokeById', () => {
  it('can retrieve joke #2', () => {
    const joke = getJokeById(2);
    expect(joke.question)
      .to.equal('Why did the turkey cross the road?');
  });
  it('returns undefined for joke #2a', () => {
    const joke = getJokeById('2a');
    expect(joke).to.equal(undefined);
  });
});

describe('getRandomJoke', () => {
  it('doesn\'t return the same joke 3x times', () => {
    const jokes = [1, 2, 3].map(getRandomJoke);
    const oneAndTwoAreSame = jokes[0] === jokes[1];
    const twoAndThreeAreSame = jokes[1] === jokes[2];
    const threeAndOneAreSame = jokes[2] === jokes[0];
    expect(!oneAndTwoAreSame || !twoAndThreeAreSame ||
           !threeAndOneAreSame);
  });
});

describe('getJokes', () => {
  const EXPECTED_JOKE_TOTAL = 3;
  const CHICKEN_JOKES_TOTAL = 2;
  it('returns all jokes for empty query', () => {
    const jokes = getJokes({});
    expect(jokes).to.have.length(EXPECTED_JOKE_TOTAL);
  });
  it('returns all chicken jokes', () => {
    const jokes = getJokes({ category: 'Chicken' });
    expect(jokes).to.have.length(CHICKEN_JOKES_TOTAL);
  });
  it('returns no jokes for an invalid category', () => {
    const jokes = getJokes({ category: 'invalid type' });
    expect(jokes).to.be.empty;
  });
});


