import { gql } from "apollo-server";

export const socialSchema = gql`
    type Group {
        id: ID!
        name: String!
        members: [User]
        leaderboard: [User]
        awards: [Award]
        groupCreationDate: String
        groupInviteUrl: String
        pictureUrl: String
    }

    type Award {
        id: ID!
        title: String!
        description: String
        recipient: User
    }

    type GroupRecap {
        totalMinutesWatched: Int
        totalWatched: Int
        topGenres: [String]
        vibeOfTheWeek: String
        groupAwards: [Award]
    }

    extend type Query {
        getGroupById(groupId: ID!): Group
        getAllGroups: [Group]
    }

    extend type Mutation {
        createGroup(groupData: GroupInput!): Group
        updateGroupName(groupId: ID!, newName: String!): Group
        updateGroupPicture(groupId: ID!, newPictureUrl: String!): Group
        joinGroup(groupId: ID!, userId: ID!): Group
        leaveGroup(groupId: ID!, userId: ID!): Group
        deleteGroup(groupId: ID!): Boolean
    }

    input GroupInput {
        name: String!
        members: [ID]
    }
`;
