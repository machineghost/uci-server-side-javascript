const jokes = [{
  id: 1,
  category: 'Chicken',
  question: "Why did the chicken cross the road twice?",
  answer: "Because he was a double-crosser!",
}, {
  id: 2,
  category: 'Chicken',
  question: 'Why did the turkey cross the road?',
  answer: 'To prove he wasn\'t chicken!',
}, {
  id: 5,
  category: 'Knock Knock',
  title: 'Cow',
  question: 'Knock knock. Who\'s there? Cow. Cow who?',
  answer: 'No, a cow says moo!'
}/* , ... */];

export const getJokeById = id =>
    jokes.find(joke => joke.id === id);

export const getJokes = query =>
    jokes.filter(({ category }) =>
        !query.category ||
        category === query.category);

const { floor, random } = Math;
const getRandom = items =>
   items[floor(random() * items.length)];
export const getRandomJoke = () =>
    getRandom(jokes);

