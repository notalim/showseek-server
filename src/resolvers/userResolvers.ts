// userResolvers.ts
import {
    getUserById,
    getUserByEmail,
    getUserByPhoneNumber,
    createUser,
    
    addMediaToUserWatched,
    checkIfMediaWatched,
    getLastWatchedMedia,
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

        getLastWatchedMedia: async (_: any, { userId }: { userId: string }) => {
            try {
                return await getLastWatchedMedia(userId);
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to retrieve last watched media",
                    "USER_WATCHED_MEDIA_FETCH_FAILED",
                    { userId }
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
        watchMedia: async (
            _: any,
            { userId, mediaId, rating }: { userId: string; mediaId: string; rating: number }
        ) => {
            try {
                const mediaWatched = await checkIfMediaWatched(userId, mediaId);
                if (mediaWatched) {
                    throw new Error("Media already watched by user");
                }

                let watchedOn = new Date().toISOString();
                const updatedUser = await addMediaToUserWatched(userId, mediaId, rating, watchedOn);
                if (!updatedUser) {
                    throw new Error("Failed to update user watched media");
                }
                return true;
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to update user watched media",
                    "USER_WATCHED_MEDIA_UPDATE_FAILED",
                    { userId, mediaId }
                );
            }
        }
    },


};

export default resolvers;
