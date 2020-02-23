import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'

const icndbUrl =  'https://api.graph.cool/simple/v1/cjb62g9rn0pdv01331wcffmva';

const transport = new Transport(icndbUrl)
const client = new Lokka({ transport });

const randomJokeQuery = `{ getRandomJoke { joke } }`;
const fakeChuckCategory = { id: 6, title: 'Chuck Norris Jokes' };

export const getRandomChuckJoke = async () => {
  const { getRandomJoke: { joke } } = await client.query(randomJokeQuery);
  return {
    id: -1,
    title: 'A random Chuck Norris Joke',
    question: joke,
    answer: null,
    created_on: new Date(),
    submitter_id: 3, 
    submitter_name: 'Internet Chuck Norris Database (icndb.com)',
    categories: [fakeChuckCategory]
  };
};
