module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'jokes',
      user:     'jokesadmin',
      password: '$ecret'
    }
  }
};
