import { gql } from "apollo-server";
import { mediaSchema } from "./mediaSchema.js";
import { userSchema } from "./userSchema.js";

const linkSchema = gql`
    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }
`;

export const typeDefs = [linkSchema, userSchema, mediaSchema];
