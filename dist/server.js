// Continue in server.ts
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schemas/index.js";
import resolvers from "./resolvers/index.js";
import dotenv from "dotenv";
import { verifyToken } from "./auth.js";
dotenv.config();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || "";
        let user = null;
        if (token) {
            try {
                user = verifyToken(token.replace("Bearer ", ""));
            }
            catch (error) {
                console.error("Failed to verify token:", error);
                // Depending on your security requirement, you might want to:
                // - Throw an error here to block the request
                // - Or simply log the error and allow the request to proceed without user info
            }
        }
        return { user }; // Always return a context object, even if `user` is null
    },
});
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
