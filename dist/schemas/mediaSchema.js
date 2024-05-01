// src/schemas/mediaSchema.ts
import { gql } from "apollo-server";
export const mediaSchema = gql `
    # Defines a media type which can be either a movie or a show
    enum EnumMediaType {
        MOVIE
        SHOW
    }
    type Media {
        id: ID!
        letterboxdId: String
        letterboxdMediaUrl: String
        title: String
        mediatype: EnumMediaType!
        dateOfRelease: String
        imgUrl: String
        genres: [String]
        description: String
    }

    # Root Query for media types
    extend type Query {
        getMedia(id: ID!): Media
        listMedia: [Media]
    }

    extend type Mutation {
        populateMedia(type: EnumMediaType!, page: Int!): Int
        bulkPopulateMedia(type: EnumMediaType!, pages: Int!): Int
    }
`;
