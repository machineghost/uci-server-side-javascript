/**
   * "Tells" a joke to the user by alerting it's question and answer
   */
const tellJoke = ({ question, answer }) =>
  alert(`Question: ${question + '\n'} Answer: ${answer}`);

/**
 * Fetches a single random joke, then "tells" (alerts) that joke
 */
const alertRandom = async () => {
  const response = await fetch('/api/random');
  const joke = await response.json();
  tellJoke(joke);
};

/**
 * Fetches a single specific joke by ID, then "tells" (alerts) that joke
 */
const alertSpecific = async jokeId => {
  const response = await fetch('/api/joke/' + jokeId);
  const joke = await response.json();
  tellJoke(joke);
};

/**
 * Fetches a category's worth of jokes, then alerts the number of jokes in
 * that category, and finally "tells" (alerts) each of those jokes
 */
const alertCategory = async category => {
  const response = await fetch('/api/search?category=' + category);
  const jokes = await response.json();
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
// (We'll let the server set the joke's creation date)
const fields = ['id', 'title', 'question', 'answer', 'created_by'];

/**
 * Given the ID of a form, parses the values (or placeholder values) in the
 * inputs of that form, to create a joke object
 */
const parseForm = formId => {
  const joke = fields.reduce((joke, field) => {
    joke[field] = parseField(formId, field); // eg. joke.id = "5"
    return joke;
  }, {});
  joke.id = parseFloat(joke.id);
  joke.created_by = parseFloat(joke.created_by);
  return joke;
};

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
 * Parse the form to get a new joke's details, then POST them to the server
 */
const addJoke = async e => {
  e.preventDefault();
  const joke = parseForm('addForm');
  const wasSuccess = await makeRequest('/api/addJoke', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(joke)
  });
  if (wasSuccess) alert('Your joke was added successfully!');
};

/**
 * Parse the form to dtermine which joke to delete, then send its ID to the
 * server so it can be deleted
 */
const deleteJoke = async e => {
  e.preventDefault();
  const { id } = parseForm('addForm');
  const wasSuccess = await makeRequest('/api/deleteJoke?id=' + id);
  if (wasSuccess) alert('Your joke was deleted successfully!');
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
document.getElementById('addForm').addEventListener('submit', addJoke);
document.getElementById('deleteForm').addEventListener('submit', deleteJoke);