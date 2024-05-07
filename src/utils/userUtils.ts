import db from "../config/firebase-admin.js";
import { DocumentData } from "firebase-admin/firestore";
import { generateRandomUsername } from "./usernameUtils.js";

import { fetchVibeFromOpenAI } from "./vibeUtils.js";
import { getMediaById } from "./mediaUtils.js";

/**
 * Fetches all users from the Firestore database
 * @returns {Promise<DocumentData[]>} - An array of user objects
 */
export const getAllUsers = async (): Promise<DocumentData[]> => {
    try {
        const snapshot = await db.collection("users").get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Failed to retrieve all users:", error);
        throw new Error("Failed to retrieve all users");
    }
};

/**
 * Fetches a single user by ID from the Firestore database
 * @param userId
 * @returns {Promise<User>} object with the attached userId
 */
export const getUserById = async (
    userId: string
): Promise<DocumentData | null> => {
    try {
        const doc = await db.collection("users").doc(userId).get();
        return doc.exists ? { userId, ...(doc.data() as DocumentData) } : null;
    } catch (error) {
        throw new Error(`Failed to get user by ID: ${userId}`);
    }
};

/**
 * Fetches a single user by email from the Firestore database
 * @param email
 * @returns {Promise<User>} object with the attached userId
 */
export const getUserByEmail = async (
    email: string
): Promise<DocumentData | undefined> => {
    try {
        const userCollectionSnapshot = await db
            .collection("users")
            .where("email", "==", email)
            .get();
        if (userCollectionSnapshot.empty) {
            return undefined;
        } else {
            const userDoc = userCollectionSnapshot.docs[0];
            return { id: userDoc.id, ...(userDoc.data() as DocumentData) };
        }
    } catch (error) {
        throw new Error(`Failed to get user by email: ${email}`);
    }
};

/**
 * Fetches a single user by phone number from the Firestore database
 * @param phoneNumber
 * @returns {Promise<User>} object with the attached userId
 */
export const getUserByPhoneNumber = async (
    phoneNumber: string
): Promise<DocumentData | undefined> => {
    try {
        const userCollectionSnapshot = await db
            .collection("users")
            .where("phoneNumber", "==", phoneNumber)
            .get();

        if (userCollectionSnapshot.empty) {
            return undefined;
        } else {
            const userDoc = userCollectionSnapshot.docs[0];
            return { id: userDoc.id, ...(userDoc.data() as DocumentData) };
        }
    } catch (error) {
        throw new Error(`Failed to get user by phone number: ${phoneNumber}`);
    }
};

/**
 * Creates a new user in the Firestore database
 * @param userData
 * @returns {string} - The ID of the newly created user
 */
export const createUser = async (
    userData: Record<string, any>
): Promise<string> => {
    try {
        const defaultUserData = {
            username: generateRandomUsername(),
            ...userData, // will have phone number and password
            name: "",
            imgUrl: "",
            preferences: {},
            lastWatched: [],
            watchedMedia: [],
            backlog: [],
            groups: [],
            pin: {},
            weeklyRecap: {},
            previousRecaps: [],
            accountCreationDate: new Date().toISOString(),
        };
        const userRef = db.collection("users").doc();
        await userRef.set(defaultUserData);
        return userRef.id; // Returns the auto-generated Firestore Document ID
    } catch (error) {
        throw new Error("Failed to create new user");
    }
};

/**
 * Checks if a username already exists in the Firestore database
 * @param {string} username - The username to check
 * @returns {Promise<boolean>} - True if the username exists, false otherwise
 */
export const checkUsernameExists = async (
    username: string
): Promise<boolean> => {
    const snapshot = await db
        .collection("users")
        .where("username", "==", username)
        .get();
    return !snapshot.empty;
};

/**
 * Updates a user in the Firestore database
 * @param userId
 * @param updates
 * @returns {Promise<User>} - The updated user object
 */
export const updateUser = async (
    userId: string,
    updates: Record<string, any>
): Promise<DocumentData | null> => {
    console.log("Updating user with ID: ", userId);
    console.log("Updates: ", updates);
    const userRef = db.collection("users").doc(userId);
    try {
        await userRef.update(updates);
    } catch (error) {
        console.error("Failed to update user: ", error);
        return null;
    }

    const updatedUser = await getUserById(userId);

    return updatedUser;
};

/**
 * Updates a user's weekly vibe in the Firestore database
 * @param userId
 * @param vibe
 * @returns {Promise<boolean>} - True if the user's vibe was updated, false otherwise
 */
export const updateUserVibe = async (
    userId: string,
    vibe: string
): Promise<boolean> => {
    const userRef = db.collection("users").doc(userId);
    try {
        await userRef.update({ weeklyVibe: vibe });
        console.log(`Updated weekly vibe for user ${userId}: ${vibe}`);
        return true; // Indicate success
    } catch (error) {
        console.error(`Failed to update vibe for user ${userId}:`, error);
        return false; // Indicate failure
    }
};

// ? Not tested yet

/**
 * Deletes a user from the Firestore database
 * @param userId
 * @returns {Promise<boolean>} - True if the user was deleted, false otherwise
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
    const userRef = db.collection("users").doc(userId);
    try {
        await userRef.delete();
    } catch (error) {
        console.error("Failed to delete user: ", error);
        return false;
    }
    return true;
};

/**
 * Adds a media item to a user's watched list
 * @param userId
 * @param mediaId
 * @param rating
 * @param watchedOn
 * @returns {Promise<boolean>} - True if the media was added, false otherwise
 */
export const addMediaToUserWatched = async (
    userId: string,
    mediaId: string,
    title: string,
    rating: number | null,
    watchedOn: string
): Promise<boolean> => {
    const userRef = db.collection("users").doc(userId);
    try {
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.error("No user found with ID: ", userId);
            return false;
        }
        // Asserting userData as non-nullable after checking userDoc.exists
        const userData = userDoc.data() || {}; // Fallback to an empty object if undefined

        const watchedMedia = userData.watchedMedia || [];

        // Check if the media has already been watched
        if (watchedMedia.some((media: any) => media.mediaId === mediaId)) {
            console.error("Media already watched.");
            return false; // Exit if media already watched
        }

        // Update the watched media list with the new entry
        watchedMedia.push({ mediaId, rating, watchedOn, title });
        await userRef.update({
            watchedMedia: watchedMedia,
            // Update the lastWatched 6 media items
            lastWatched: [mediaId, ...(userData.lastWatched || [])].slice(0, 6),
        });
    } catch (error) {
        console.error("Failed to add media to user watched: ", error);
        return false;
    }
    return true;
};

/**
 * Gets the last watched media items for a user
 * @param userId
 * @returns {Promise<DocumentData[]>} - An array of media objects
 */
export const getLastWatchedMedia = async (
    userId: string
): Promise<DocumentData[]> => {
    const user = await getUserById(userId);
    return user?.lastWatched || [];
};

/**
 * Checks if a media item has been watched by a user
 * @param userId
 * @param mediaId
 * @returns {Promise<boolean>} - True if the media has been watched, otherwise false
 */
export const checkIfMediaWatched = async (
    userId: string,
    mediaId: string
): Promise<boolean> => {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        throw new Error(`No user found with ID: ${userId}`);
    }

    const userData = userDoc.data() || {};
    const watchedMedia = userData.watchedMedia || [];

    return watchedMedia.some((media: any) => media.mediaId === mediaId);
};

/**
 * Adds a media item to a user's backlog
 * @param userId
 * @param mediaId
 * @returns {Promise<boolean>} - True if the media was added, false otherwise
 */

export const addMediaToUserBacklog = async (
    userId: string,
    mediaId: string
): Promise<boolean> => {
    const userRef = db.collection("users").doc(userId);
    try {
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.error("No user found with ID: ", userId);
            return false;
        }
        const userData = userDoc.data() || {};
        const backlog = userData.backlog || [];

        if (backlog.includes(mediaId)) {
            console.error("Media already in backlog.");
            return false; // Exit if media already in backlog
        }

        if (userData.watchedMedia.some((media: any) => media.mediaId === mediaId)) {
            console.error("Media already watched.");
            return false; // Exit if media already watched
        }

        backlog.push(mediaId);
        await userRef.update({ backlog: backlog });
    } catch (error) {
        console.error("Failed to add media to user backlog: ", error);
        return false;
    }
    return true;
}

/**
 * Generates a weekly recap for a single user based on their watched media
 * @param {string} userId - The ID of the user to generate the recap for
 */
export const generateUserWeeklyRecap = async (
    userId: string
): Promise<void> => {
    const user = await getUserById(userId) || {};
    console.log(
        `Generating recap for user: ${userId}, lastWatched: ${JSON.stringify(
            user.lastWatched
        )}`
    );

    if (user && user.lastWatched && user.lastWatched.length > 0) {
        const fullMedia = await Promise.all(
            user.lastWatched.map(async (mediaId: string) => {
                return getMediaById(mediaId);
            })
        );

        const totalWatched = fullMedia.length;
        const totalMinutesWatched = fullMedia.reduce((acc, media) => {
            return acc + (media.runtime ? media.runtime : 0);
        }, 0);

        const genreCounts = fullMedia.reduce((acc, media) => {
            if (media.genres && Array.isArray(media.genres)) {
                media.genres.forEach((genre: string) => {
                    acc[genre] = (acc[genre] || 0) + 1;
                });
            }
            return acc;
        }, {});

        const topGenres = Object.entries(genreCounts)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 3)
            .map((entry) => entry[0]);

        const titles = fullMedia.map((media) => media.title);
        const vibe = await fetchVibeFromOpenAI(titles);

        const recap = {
            totalMinutesWatched,
            totalWatched,
            topGenres,
            vibeOfTheWeek: vibe,
        };

        const userRef = db.collection("users").doc(userId);
        await userRef.update({ weeklyRecap: recap });
        console.log(`Weekly recap generated for user ${userId}`);
    } else {
        const emptyRecap = {
            totalMinutesWatched: 0,
            totalWatched: 0,
            topGenres: [],
            vibeOfTheWeek: "no vibe this week :(",
        };
        const userRef = db.collection("users").doc(userId);
        await userRef.update({ weeklyRecap: emptyRecap });
        console.log(`No media watched for user ${userId}, empty recap stored.`);
    }
};

/**
 * Generates weekly recaps for all users based on their watched media
 * @returns {Promise<void>}
 */
export const generateAllUserWeeklyRecaps = async (): Promise<void> => {
    const users = await getAllUsers();
    for (const user of users) {
        await generateUserWeeklyRecap(user.id);
    }
};
