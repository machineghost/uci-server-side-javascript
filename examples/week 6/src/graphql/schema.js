import { buildSchema } from 'graphql'

export default buildSchema(`
  scalar Date

  type Category {
    id: ID!
    title: String!
  }

  type User {
    id: ID!
    displayName: String!
    username: String!
  }

  type Joke {
    id: ID!
    title: String!
    question: String!
    answer: String
    created_on: Date!
    submitter: User!
    categories: [Category!]!
  }

  type SuccessResponse {
    wasSuccessful: Boolean!
  }

  input JokeInput {
    title: String!
    question: String!
    answer: String
    submitter: ID!
    categoryIds: [ID!]!
  }

  input JokeUpdate {
    id: ID!
    title: String
    question: String
    answer: String
    submitter: ID
    categoryIds: [ID]
  }

  type Query {
    chuckJoke: Joke
    joke(id: ID!): Joke
    jokes(categoryId: ID!): [Joke]
    randomJoke: Joke
  }

  type Mutation {
    addJoke (joke: JokeInput!): Joke
    deleteJoke(id: ID!): SuccessResponse
    updateJoke (update: JokeUpdate!): Joke
  }
`);
