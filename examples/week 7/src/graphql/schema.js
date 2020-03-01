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

  input LoginInput {
    username: String!
    password: String!
  }

  input UserInput {
    displayName: String!
    email: String!
    password: String!
    username: String!
  }

  input PasswordResetInput {
    username: String!
    password: String!
    key: String!
  }

  type Query {
    chuckJoke: Joke
    currentUser: User
    joke(id: ID!): Joke
    jokes(categoryId: ID!): [Joke]
    randomJoke: Joke
  }

  type Mutation {
    addJoke (joke: JokeInput!): Joke
    deleteJoke(id: ID!): SuccessResponse
    login(loginInput: LoginInput!): User
    logout: SuccessResponse
    requestPasswordReset(username: String!): SuccessResponse
    resetPassword(resetInput: PasswordResetInput!): User
    signup(user: UserInput!): User
    updateJoke (update: JokeUpdate!): Joke
  }
`);
