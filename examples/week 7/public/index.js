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
  // Use string methods to extrat the root field from a query. Normally you
  //  would NOT do things this way ... at all. This is just a hack  to avoid
  // depending on a proper library (eg. Lokka), to keep this example simpler.
  let rootField = query.trim()
  if (rootField.includes('$')) {
    rootField = rootField.substr(rootField.indexOf('{') + 1)
    // rootField = rootField.substr(rootField.lastIndexOf('}') + 1)
    rootField.substr(0, rootField.lastIndexOf('(')).trim()
  }
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
  const joke = parseForm('add-form');
  const mutation = `mutation ($joke: JokeInput!) {
    addJoke(joke: $joke) ${jokeSelection}
  }`;

  const jokeWasAdded = await makeQuery(mutation, { joke });
  if (jokeWasAdded)
    alert(`Your joke titled "${joke.title}" was added successfully!`);
};

/**
 * Parse the form to dtermine which joke to delete, then send its ID to the
 * server so it can be deleted
 */
const deleteJoke = async e => {
  e.preventDefault();
  const id = parseField('delete-form', 'id');
  const mutation = `mutation { deleteJoke(id: ${id}) { wasSuccessful } }`;

  const { wasSuccessful } = await makeQuery(mutation)
  if (wasSuccessful) alert('Your joke was deleted successfully!');
};

const setCurrentUser = currentUser => {
  if (currentUser) {
    document.querySelector('#loginBox').style.display = 'none';
    document.querySelector('#logoutBox').style.display = 'block';
  } else {
    document.querySelector('#logoutBox').style.display = 'none';
    document.querySelector('#loginBox').style.display = 'block';
  }
  return document.querySelector('#welcome-message').innerText =
    currentUser ? `Welcome ${currentUser.username}!` : '';
};

const login = async e => {
  const credentials = {
    username: document.querySelector('#login-username').value,
    password: document.querySelector('#login-password').value,
  };
  const mutation = `mutation ($credentials: LoginInput!) {
    login(loginInput: $credentials) {
      displayName
      username
    }
  }`;
  const user = await makeQuery(mutation, { credentials });
  if (!user) {
    document.querySelector('#login-failure').style.display = 'block'
    return
  }
  setCurrentUser(user);
  $('#login-dialog').modal('hide');
}

const logout = async e => {
  const mutation = `mutation  {
    logout { wasSuccessful }
  }`;
  const user = await makeQuery(mutation);
  setCurrentUser(null);
}

const signup = async e => {
  const user = {
    displayName: document.querySelector('#display_name').value,
    email: document.querySelector('#email_address').value,
    username: document.querySelector('#signup-username').value,
    password: document.querySelector('#signup-password').value,
  };
  const mutation = `mutation ($user: UserInput!) {
    signup(user: $user) {
      displayName
      username
    }
  }`;
  const signedUpUser = await makeQuery(mutation, { user });
  document.querySelector('#signup-failure').style.display =
    signedUpUser ? 'none' : 'block';
  if (!signedUpUser) return;
  setCurrentUser(signedUpUser);
  $('#signup-dialog').modal('hide');
};

const requestReset = async e => {
  e.preventDefault();
  const username = document.querySelector('#login-username').value;
  const mutation = `mutation ($username: String!) {
    requestPasswordReset(username: $username) {
      wasSuccessful
    }
  }`;
  const { wasSuccessful } = await makeQuery(mutation, { username });
  if (wasSuccessful) alert('A reset email has been sent');
  else alert('I\'m sorry, an error ocurred while resetting your password');
}

const resetPassword = async e => {
  const resetInput = {
    username: document.querySelector('#reset-username').value,
    password: document.querySelector('#reset-password').value,
    key: document.querySelector('#key').value
  };
  const mutation = `mutation ($resetInput: PasswordResetInput!) {
    resetPassword(resetInput: $resetInput) {
      displayName
      username
    }
  }`;
  const user = await makeQuery(mutation, { resetInput });
  if (!user) {
    document.querySelector('#reset-failure').style.display = 'block';
    return;
  }
  setCurrentUser(user);
  $('#reset-dialog').modal('hide');
};

document.addEventListener('DOMContentLoaded', async e => {
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
  document.getElementById('add-form').addEventListener('submit', addJoke);
  document.getElementById('delete-form').addEventListener('submit', deleteJoke);
  document.getElementById('login-form').addEventListener('submit', login);
  document.getElementById('logout').addEventListener('click', logout);
  document.getElementById('signup-form').addEventListener('submit', signup);
  document.getElementById('request-reset').addEventListener('click', requestReset);
  document.getElementById('reset-form').addEventListener('submit', resetPassword);
  // Get logged in user
  const query = `{ currentUser { displayName username } }`;
  setCurrentUser(await makeQuery(query));
});