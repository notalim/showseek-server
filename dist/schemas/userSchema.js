import { gql } from "apollo-server";
export const userSchema = gql `
    # Media type used in multiple places
    type Media {
        id: ID!
        title: String!
        mediatype: EnumMediaType!
        dateOfRelease: String
        imgUrl: String
        genres: [String] # Using genre names
        description: String
    }

    # Enum for media type
    enum EnumMediaType {
        MOVIE
        SHOW
    }

    # Group type with members
    type Group {
        id: ID!
        name: String!
        members: [User]
        groupCreationDate: String
        groupInviteUrl: String
    }


    # User type with preferences and new fields
    type User {
        id: ID!
        username: String!
        email: String!
        phoneNumber: String
        password: String
        name: String
        imgUrl: String
        preferences: UserPreferences
        lastWatched: [Media] # Array of last 3 things watched
        watchedMedia: [WatchedMedia] # All watched media with ratings
        groups: [Group] # Groups the user is part of
        pin: Media # User's favorite or pinned media
        weeklyRecap: WeeklyRecap
        previousRecaps: [WeeklyRecap]
        accountCreationDate: String
    }

    # Watched Media with user ratings
    type WatchedMedia {
        media: Media
        rating: Int
        watchedOn: String
    }

    # User Preferences definition
    type UserPreferences {
        genresLiked: [String]
        filmsLiked: [String] # Can consider using Media IDs or titles
        showsLiked: [String]
        actorsLiked: [String] # Can consider actor IDs from TMDb
    }

    # Weekly Recap definition
    type WeeklyRecap {
        totalMinutesWatched: Int
        totalWatched: Int
        topGenres: [String]
        vibeOfTheWeek: String
    }

    # UserInput and UserPreferencesInput for creating and updating users
    input UserInput {
        username: String
        email: String
        phoneNumber: String
        password: String
        name: String
        imgUrl: String
        preferences: UserPreferencesInput
    }

    input UserPreferencesInput {
        genresLiked: [String]
        filmsLiked: [String]
        showsLiked: [String]
        actorsLiked: [String]
    }

    # Root queries and mutations
    extend type Query {
        getUserById(userId: ID!): User
        getUserByEmail(userEmail: String!): User
        getUserByPhoneNumber(phoneNumber: String!): User
        getUserCollection: [User]
    }

    extend type Mutation {
        createUser(userData: UserInput!): User
    }
`;
