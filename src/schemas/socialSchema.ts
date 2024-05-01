import { gql } from "apollo-server";

export const socialSchema = gql`
    # Group type for user communities
    type Group {
        id: ID!
        name: String!
        members: [User]
        leaderboard: [User]
        awards: [Award]
        groupCreationDate: String
        groupInviteUrl: String
    }

    # Award type for community achievements
    type Award {
        id: ID!
        title: String!
        description: String
        recipient: User
    }

    # Recap for the group
    type GroupRecap {
        totalMinutesWatched: Int
        totalWatched: Int
        topGenres: [String]
        vibeOfTheWeek: String
        groupAwards: [Award]
    }

    # Extending the root Query type for social functionalities
    extend type Query {
        getGroupById(groupId: ID!): Group
        getAllGroups: [Group]
    }

    # Extending the root Mutation type for group management
    extend type Mutation {
        createGroup(groupData: GroupInput!): Group
        joinGroup(groupId: ID!, userId: ID!): Group
        leaveGroup(groupId: ID!, userId: ID!): Group
    }

    # Input types for creating and updating groups
    input GroupInput {
        name: String!
        members: [ID] # List of User IDs
    }
`;
