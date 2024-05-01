import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schemas/index.js";
import resolvers from "./resolvers/index.js";
import dotenv from "dotenv";
dotenv.config();
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
