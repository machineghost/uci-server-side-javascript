module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'jokes',
      user:     'jeremy',
      password: '$ecret'
    }
  },
  test: {
    client: 'postgresql',
    connection: {
      database: 'jokes-test',
      user:     'jeremy',
      password: '$ecret'
    }
  }
};
