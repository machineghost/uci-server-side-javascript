const jokes = [{
  id: 1,
  type: 'Chicken',
  question: "Why did the chicken cross the road twice?",
  answer: "Because he was a double-crosser!",
}, {
  id: 2,
  type: 'Chicken',
  question: 'Why did the turkey cross the road?',
  answer: 'To prove he wasn\'t chicken!',
}, // ...
];

export const getJoke = id =>
    jokes.find(joke => joke.id === id);

export const getJokes = query =>
    jokes.filter(({ type }) =>
        !query.type || type === query.type);

const { floor, random } = Math;
const getRandom = items =>
   items[floor(random() * items.length)];

export const getRandomJoke = () =>
    getRandom(jokes);

