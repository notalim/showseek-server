import { gql } from "apollo-server";
export const mediaSchema = gql `
    # Defines a media type which can be either a movie or a show
    enum EnumMediaType {
        MOVIE
        SHOW
    }
    
    type Media {
        id: ID!
        title: String!
        mediatype: EnumMediaType!
        dateOfRelease: String
        imgUrl: String
        genres: [String] # Using genre names
        description: String
        runtime: Int
        adult: Boolean
        tmdbId: Int
    }

    # Root Query for media types
    extend type Query {
        getMedia(id: ID!): Media
        listMedia: [Media]
    }

    # Mutations for populating media database
    extend type Mutation {
        populateMedia(type: EnumMediaType!, page: Int!): Int
        bulkPopulateMedia(type: EnumMediaType!, pages: Int!): Int
    }
`;
