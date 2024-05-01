// userResolvers.ts
import {
    getUserById,
    getUserByEmail,
    getUserByPhoneNumber,
    createUser,
} from "../utils/firebaseUserUtils.js";
import handleError from "../utils/ApolloErrorHandling.js";

const resolvers = {
    Query: {
        getUserById: async (_: any, { id }: { id: string }) => {
            try {
                return await getUserById(id);
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to retrieve user by ID",
                    "USER_FETCH_FAILED",
                    { id }
                );
            }
        },
        getUserByEmail: async (_: any, { email }: { email: string }) => {
            try {
                return await getUserByEmail(email);
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to retrieve user by email",
                    "USER_FETCH_FAILED",
                    { email }
                );
            }
        },
        getUserByPhoneNumber: async (
            _: any,
            { phoneNumber }: { phoneNumber: string }
        ) => {
            try {
                return await getUserByPhoneNumber(phoneNumber);
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to retrieve user by phone number",
                    "USER_FETCH_FAILED",
                    { phoneNumber }
                );
            }
        },
    },
    Mutation: {
        createUser: async (
            _: any,
            { userData }: { userData: Record<string, any> }
        ) => {
            try {
                const userId = await createUser(userData);
                return { ...userData, id: userId };
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to create user",
                    "USER_CREATION_FAILED",
                    { userData }
                );
            }
        },
    },
};

export default resolvers;
