module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'jokes',
      user: 'jokesadmin',
      password: '$ecret'
    }
  },
  test: {
    client: 'postgresql',
    connection: {
      database: 'jokes-test',
      user: 'jokesadmin',
      password: '$ecret'
    }
  }
};
