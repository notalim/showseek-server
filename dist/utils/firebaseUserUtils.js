import db from "../config/firebase-admin.js";
import { generateRandomUsername } from "./usernameUtils.js";
// * Returns an array of all users as DocumentData objects
export const getUserCollection = async () => {
    try {
        const snapshot = await db.collection("users").get();
        return snapshot.docs.map((doc) => doc.data());
    }
    catch (error) {
        throw new Error("Failed to get user collection");
    }
};
// * Returns a single user by ID as DocumentData, or null if not found
export const getUserById = async (userId) => {
    try {
        const doc = await db.collection("users").doc(userId).get();
        return doc.exists ? { userId, ...doc.data() } : null;
    }
    catch (error) {
        throw new Error(`Failed to get user by ID: ${userId}`);
    }
};
// * Returns a single user by email as DocumentData and prepends the id, or returns undefined if not found
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
// * Returns a single user by phone number as DocumentData and prepends the id, or returns undefined if not found
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
// * Creates a new user with given data, returns the Firestore Document ID of the newly created user
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
export const checkUsernameExists = async (username) => {
    const snapshot = await db
        .collection("users")
        .where("username", "==", username)
        .get();
    return !snapshot.empty;
};
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
