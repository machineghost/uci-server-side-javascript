export default `
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}

type Mutation {
  createJoke (
      body: String
  ): Joke
  # NOTE: No separate mutation for adding/removing categories; updateJoke will
  #       handle this
  updateJoke (
    body: String
  ): Joke
  deleteJoke(id: ID!): Joke
}

schema {
  query: Query
  mutation: Mutation
}
`;