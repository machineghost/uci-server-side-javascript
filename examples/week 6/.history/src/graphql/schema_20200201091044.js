import { buildSchema } from 'graphql'

export default `
type Query {
  joke(id: ID!): Joke
  jokes(categoryId: ID!): Joke
  randomJoke(): Joke
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
  mutation: Mutation
  query: Query
}
`;