import db from "../config/firebase-admin.js";
import { generateRandomUsername } from "./usernameUtils.js";
/**
 * Fetches all users from the Firestore database
 * @returns {Promise<DocumentData[]>} - An array of user objects
 */
export const getAllUsers = async () => {
    try {
        const snapshot = await db.collection("users").get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    catch (error) {
        console.error("Failed to retrieve all users:", error);
        throw new Error("Failed to retrieve all users");
    }
};
/**
 * Fetches a single user by ID from the Firestore database
 * @param userId
 * @returns {Promise<User>} object with the attached userId
 */
export const getUserById = async (userId) => {
    try {
        const doc = await db.collection("users").doc(userId).get();
        return doc.exists ? { userId, ...doc.data() } : null;
    }
    catch (error) {
        throw new Error(`Failed to get user by ID: ${userId}`);
    }
};
/**
 * Fetches a single user by email from the Firestore database
 * @param email
 * @returns {Promise<User>} object with the attached userId
 */
export const getUserByEmail = async (email) => {
    try {
        const userCollectionSnapshot = await db
            .collection("users")
            .where("email", "==", email)
            .get();
        if (userCollectionSnapshot.empty) {
            return undefined;
        }
        else {
            const userDoc = userCollectionSnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        }
    }
    catch (error) {
        throw new Error(`Failed to get user by email: ${email}`);
    }
};
/**
 * Fetches a single user by phone number from the Firestore database
 * @param phoneNumber
 * @returns {Promise<User>} object with the attached userId
 */
export const getUserByPhoneNumber = async (phoneNumber) => {
    try {
        const userCollectionSnapshot = await db
            .collection("users")
            .where("phoneNumber", "==", phoneNumber)
            .get();
        if (userCollectionSnapshot.empty) {
            return undefined;
        }
        else {
            const userDoc = userCollectionSnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        }
    }
    catch (error) {
        throw new Error(`Failed to get user by phone number: ${phoneNumber}`);
    }
};
/**
 * Creates a new user in the Firestore database
 * @param userData
 * @returns {string} - The ID of the newly created user
 */
export const createUser = async (userData) => {
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
    }
    catch (error) {
        throw new Error("Failed to create new user");
    }
};
/**
 * Checks if a username already exists in the Firestore database
 * @param {string} username - The username to check
 * @returns {Promise<boolean>} - True if the username exists, false otherwise
 */
export const checkUsernameExists = async (username) => {
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
export const updateUser = async (userId, updates) => {
    console.log("Updating user with ID: ", userId);
    console.log("Updates: ", updates);
    const userRef = db.collection("users").doc(userId);
    try {
        await userRef.update(updates);
    }
    catch (error) {
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
export const updateUserVibe = async (userId, vibe) => {
    const userRef = db.collection("users").doc(userId);
    try {
        await userRef.update({ weeklyVibe: vibe });
        console.log(`Updated weekly vibe for user ${userId}: ${vibe}`);
        return true; // Indicate success
    }
    catch (error) {
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
export const deleteUser = async (userId) => {
    const userRef = db.collection("users").doc(userId);
    try {
        await userRef.delete();
    }
    catch (error) {
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
export const addMediaToUserWatched = async (userId, mediaId, rating, watchedOn) => {
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
        if (watchedMedia.some((media) => media.mediaId === mediaId)) {
            console.error("Media already watched.");
            return false; // Exit if media already watched
        }
        // Update the watched media list with the new entry
        watchedMedia.push({ mediaId, rating, watchedOn });
        await userRef.update({
            watchedMedia: watchedMedia,
            // Update the lastWatched 6 media items
            lastWatched: [mediaId, ...(userData.lastWatched || [])].slice(0, 6),
        });
    }
    catch (error) {
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
export const getLastWatchedMedia = async (userId) => {
    const user = await getUserById(userId);
    return user?.lastWatched || [];
};
/**
 * Checks if a media item has been watched by a user
 * @param userId
 * @param mediaId
 * @returns {Promise<boolean>} - True if the media has been watched, otherwise false
 */
export const checkIfMediaWatched = async (userId, mediaId) => {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new Error(`No user found with ID: ${userId}`);
    }
    const userData = userDoc.data() || {};
    const watchedMedia = userData.watchedMedia || [];
    return watchedMedia.some((media) => media.mediaId === mediaId);
};
