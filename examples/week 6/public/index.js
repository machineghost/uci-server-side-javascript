// All our queries will use this same GraphQL to select joke fields
const jokeSelection = `{
  id
  title
  question
  answer
  created_on
  submitter{
    id
    displayName
  }
  categories {
    id
    title
  }
}`;

/**
 * "Tells" a joke to the user by alerting it's question and answer
 */
const tellJoke = ({ question, answer }) =>
  answer
    ? alert(`Question: ${question + '\n'} Answer: ${answer}`)
    : alert(`${question + '\n'}`);

/**
 * Makes a request to the server using the provide URL/parameters, and then
 * returns a boolean indicating whether or not it was succesful.  If an error
 * occurs it will be logged, and the user notified.
 */
const makeRequest = async (url, params) => {
  try {
    const response = await fetch(url, params);
    // Handle HTTP-level errors
    if (!response.ok) throw new Error(response.statusText);

    const responseJson = await response.json();
    // Handle API/data errors
    if (!responseJson.success) throw new Error(responseJson.message);
    return true;
  } catch (err) {
    console.error(err);
    alert(
      'An error ocurred (please check the console and network tabs of your ' +
      'developer tools).'
    );
  }
  return false;
};


/**
 * Helper function for making GraphQL queries/mutations
 * (We could use a library like Lokka, but plain old fetch works fine for this
 * example.)
 */
const makeQuery = async (query, variables = {}) => {
  // Use string methods to extrat the root field from a query
  // (this is the sort of thing a library would do for us)
  let rootField = query.trim()
  rootField = rootField.substr(rootField.startsWith('mutation') ? 10 : 1);
  rootField = rootField.split('{')[0].split('(')[0].trim();

  const response = await fetch('http://localhost:8000/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await response.json();
  const { data, errors } = json;
  if (errors) {
    alert('An error occurred');
    console.error(errors);
  }

  return data[rootField];
};

/**
 * Fetches a single random joke, then "tells" (alerts) that joke
 */
const alertRandom = async () => {
  const query = `{ randomJoke ${jokeSelection} }`;
  tellJoke(await makeQuery(query));
};

/**
 * Fetches a single random Chuck Norris joke, then "tells" (alerts) that joke
 */
const alertRandomChuckJoke = async () => {
  // Because our Chuck jokes depend on an external API, they'll take longer,
  // so change the cursor to tell the user "this will take a second", and ignore
  // any further clicks while we're retrieving a joke
  if (document.body.className === 'waiting') return;
  const query = `{ chuckJoke ${jokeSelection} }`;
  document.body.className = 'waiting';
  tellJoke(await makeQuery(query));
  document.body.className = '';
};

/**
 * Fetches a single specific joke by ID, then "tells" (alerts) that joke
 */
const alertSpecific = async jokeId => {
  const query = `{ joke(id: ${jokeId}) ${jokeSelection} }`;
  tellJoke(await makeQuery(query));
};


/**
 * Fetches a category's worth of jokes, then alerts the number of jokes in
 * that category, and finally "tells" (alerts) each of those jokes
 */
const alertCategory = async categoryId => {
  const query = `{ jokes(categoryId: ${categoryId}) ${jokeSelection} }`;
  const jokes = await makeQuery(query);
  if (jokes.length > 1) {
    alert(`There were ${jokes.length} jokes in that category...`);
  } else if (jokes.length) {
    alert(`We have one joke in that category.  It is ...`);
  }
  jokes.forEach(tellJoke);
};

/**
 * Finds the indicated field in the indicated form, and returns its value (or
 * placeholder value)
 */
const parseField = (formId, fieldName) => {
  const inputSelector = `#${formId} [name="${fieldName}"]`;
  const input = document.querySelector(inputSelector);
  return input.value || input.placeholder;
};

// List of all of our (input) joke fields.
const fields = ['title', 'question', 'answer', 'created_by', 'category_ids'];

/**
 * Given the ID of a form, parses the values (or placeholder values) in the
 * inputs of that form, to create a joke object
 */
const parseForm = formId => {
  const joke = fields.reduce((joke, field) => {
    joke[field] = parseField(formId, field); // eg. joke.id = "5"
    return joke;
  }, {});
  joke.categoryIds = joke.category_ids.split(',');
  delete joke.category_ids;
  joke.submitter = joke.created_by;
  delete joke.created_by;
  return joke;
};


/**
 * Parse the form to get a new joke's details, then POST them to the server
 */
const addJoke = async e => {
  e.preventDefault();
  const joke = parseForm('addForm');
  const mutation = `mutation ($joke: JokeInput!) {
    addJoke(joke: $joke) ${jokeSelection}
  }`;

  await makeQuery(mutation, { joke });
  alert(`Your joke titled "${joke.title}" was added successfully!`);
};

/**
 * Parse the form to dtermine which joke to delete, then send its ID to the
 * server so it can be deleted
 */
const deleteJoke = async e => {
  e.preventDefault();
  const id = parseField('deleteForm', 'id');
  const mutation = `mutation { deleteJoke(id: ${id}) { wasSuccessful } }`;

  const { wasSuccessful } = await makeQuery(mutation)
  if (wasSuccessful) alert('Your joke was deleted successfully!');
};

// Hook up all of our event listeners
document.getElementById('random').addEventListener('click', alertRandom);
document
  .getElementById('bestKnock')
  .addEventListener('click', () => alertSpecific(5));
document
  .getElementById('chickenJokes')
  .addEventListener('click', () => alertCategory(1));
document
  .getElementById('knockJokes')
  .addEventListener('click', () => alertCategory(2));
document
  .getElementById('chuck')
  .addEventListener('click', () => alertRandomChuckJoke());
document.getElementById('addForm').addEventListener('submit', addJoke);
document.getElementById('deleteForm').addEventListener('submit', deleteJoke);