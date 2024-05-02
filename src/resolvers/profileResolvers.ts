import {
    getUserById,
    checkUsernameExists,
    updateUser,

    deleteUser
} from "../utils/firebaseUserUtils.js";
import { getMediaById } from "../utils/firebaseMediaUtils.js";
import handleError from "../utils/ApolloErrorHandling.js";

const profileResolvers = {
    Mutation: {
        changeUsername: async (
            _: any,
            { userId, newUsername }: { userId: string; newUsername: string }
        ) => {
            try {
                const exists = await checkUsernameExists(newUsername);
                if (exists) {
                    throw new Error("Username already taken");
                }
                return await updateUser(userId, { username: newUsername });
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to change username",
                    "USERNAME_CHANGE_FAILED",
                    { userId, newUsername }
                );
            }
        },
        updatePin: async (
            _: any,
            { userId, mediaId }: { userId: string; mediaId: string }
        ) => {
            try {
                const updatedUser = await updateUser(userId, { pin: mediaId });
                if (!updatedUser) {
                    throw new Error("Failed to update pin");
                }

                const mediaDetails = await getMediaById(mediaId);
                if (!mediaDetails) {
                    throw new Error("Media not found");
                }

                return updatedUser;
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to update pin",
                    "PIN_UPDATE_FAILED",
                    { userId, mediaId }
                );
            }
        },

        addOrUpdateEmail: async (
            _: any,
            { userId, email }: { userId: string; email: string }
        ) => {
            try {
                // Add email verification logic if required
                return await updateUser(userId, { email: email });
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to update email",
                    "EMAIL_UPDATE_FAILED",
                    { userId, email }
                );
            }
        },
        // Additional mutations for handling profile image uploads, etc.
    },
};

export default profileResolvers;
