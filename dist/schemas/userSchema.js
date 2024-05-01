import { gql } from "apollo-server";
export const userSchema = gql `
    # Defines a user type with preferences
    type User {
        id: ID!
        letterboxdId: String
        letterboxdProfileUrl: String
        phoneNumber: String
        username: String
        password: String
        name: String
        imgUrl: String
        watchedMedia: [String]
        preferences: UserPreferences
    }

    # Define UserPreferences as a type
    type UserPreferences {
        genresLiked: [String]
        filmsLiked: [String]
        showsLiked: [String]
        actorsLiked: [String]
    }

    # Define UserInput as an input type for mutations
    input UserInput {
        letterboxdId: String
        letterboxdProfileUrl: String
        phoneNumber: String
        username: String
        password: String
        name: String
        imgUrl: String
        watchedMedia: [String]
        preferences: UserPreferencesInput
    }

    # Define UserPreferencesInput as an input type
    input UserPreferencesInput {
        genresLiked: [String]
        filmsLiked: [String]
        showsLiked: [String]
        actorsLiked: [String]
    }

    # Root Query for user types
    extend type Query {
        getUserById(userId: ID!): User
        getUserByEmail(userEmail: String!): User
        getUserByPhoneNumber(phoneNumber: String!): User
        getUserCollection: [User]
    }

    # Mutation for creating a user
    extend type Mutation {
        createUser(userData: UserInput!): User
    }
`;
