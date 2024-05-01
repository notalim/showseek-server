// userResolvers.ts
import { getUserById, getUserByEmail, getUserByPhoneNumber, createUser, } from "../utils/firebaseUserUtils.js";
import handleError from "../utils/ApolloErrorHandling.js";
const resolvers = {
    Query: {
        getUserById: async (_, { id }) => {
            try {
                return await getUserById(id);
            }
            catch (error) {
                throw handleError(error, "Failed to retrieve user by ID", "USER_FETCH_FAILED", { id });
            }
        },
        getUserByEmail: async (_, { email }) => {
            try {
                return await getUserByEmail(email);
            }
            catch (error) {
                throw handleError(error, "Failed to retrieve user by email", "USER_FETCH_FAILED", { email });
            }
        },
        getUserByPhoneNumber: async (_, { phoneNumber }) => {
            try {
                return await getUserByPhoneNumber(phoneNumber);
            }
            catch (error) {
                throw handleError(error, "Failed to retrieve user by phone number", "USER_FETCH_FAILED", { phoneNumber });
            }
        },
    },
    Mutation: {
        createUser: async (_, { userData }) => {
            try {
                const userId = await createUser(userData);
                return { ...userData, id: userId };
            }
            catch (error) {
                throw handleError(error, "Failed to create user", "USER_CREATION_FAILED", { userData });
            }
        },
    },
};
export default resolvers;
