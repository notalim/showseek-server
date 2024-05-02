import db from "../config/firebase-admin.js";
import { DocumentData } from "firebase-admin/firestore";
import { generateRandomUsername } from "./usernameUtils.js";

// * Returns an array of all users as DocumentData objects
export const getUserCollection = async (): Promise<DocumentData[]> => {
    try {
        const snapshot = await db.collection("users").get();
        return snapshot.docs.map((doc) => doc.data() as DocumentData);
    } catch (error) {
        throw new Error("Failed to get user collection");
    }
};

// * Returns a single user by ID as DocumentData, or null if not found
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

// * Returns a single user by email as DocumentData and prepends the id, or returns undefined if not found
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

// * Returns a single user by phone number as DocumentData and prepends the id, or returns undefined if not found
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

// * Creates a new user with given data, returns the Firestore Document ID of the newly created user
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

export const checkUsernameExists = async (username: string) => {
    const snapshot = await db
        .collection("users")
        .where("username", "==", username)
        .get();
    return !snapshot.empty;
};

export const updateUser = async (
    userId: string,
    updates: Record<string, any>
) => {
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

// ? Not tested yet
export const deleteUser = async (userId: string) => {
    const userRef = db.collection("users").doc(userId);
    try {
        await userRef.delete();
    } catch (error) {
        console.error("Failed to delete user: ", error);
        return false;
    }
    return true;
};

export const addMediaToUserWatched = async (
    userId: string,
    mediaId: string,
    rating: number | null,
    watchedOn: string
) => {
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
        watchedMedia.push({ mediaId, rating, watchedOn });
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

export const getLastWatchedMedia = async (userId: string) => {
    const user = await getUserById(userId);
    return user?.lastWatched || [];
};

export const checkIfMediaWatched = async (userId:string, mediaId:string) => {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        console.error("No user found with ID: ", userId);
        return false; 
    }

    const userData = userDoc.data() || {};


    const watchedMedia = Array.isArray(userData.watchedMedia)
        ? userData.watchedMedia
        : [];

    return watchedMedia.some((media) => media.mediaId === mediaId);
};

