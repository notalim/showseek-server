import db from "../config/firebase-admin.js";
import { DocumentData } from "firebase-admin/firestore";

export const getUserCollection = async (): Promise<DocumentData[]> => {
    try {
        const snapshot = await db.collection("users").get();
        return snapshot.docs.map((doc) => doc.data() as DocumentData);
    } catch (error) {
        throw new Error("Failed to get user collection");
    }
};

export const getUserById = async (
    userId: string
): Promise<DocumentData | null> => {
    try {
        const doc = await db.collection("users").doc(userId).get();
        return doc.exists ? (doc.data() as DocumentData) : null;
    } catch (error) {
        throw new Error(`Failed to get user by ID: ${userId}`);
    }
};

export const getUserByEmail = async (
    userEmail: string
): Promise<DocumentData | undefined> => {
    try {
        const userCollection = await getUserCollection();
        return userCollection.find((user) => user.email === userEmail);
    } catch (error) {
        throw new Error(`Failed to get user by email: ${userEmail}`);
    }
};

export const getUserByPhoneNumber = async (
    phoneNumber: string
): Promise<DocumentData | undefined> => {
    try {
        const userCollection = await getUserCollection();
        return userCollection.find((user) => user.phoneNumber === phoneNumber);
    } catch (error) {
        throw new Error(`Failed to get user by phone number: ${phoneNumber}`);
    }
};

export const createUser = async (
    userData: Record<string, any>
): Promise<string> => {
    try {
        const defaultUserData = {
            letterboxdId: "",
            letterboxdProfileUrl: "",
            username: "",
            name: "",
            imgUrl: "",
            watchedMedia: [],
            preferences: {
                genresLiked: [],
                filmsLiked: [],
                showsLiked: [],
                actorsLiked: [],
            },
            ...userData, 
        };
        const userRef = db.collection("users").doc();
        await userRef.set(defaultUserData);
        return userRef.id;
    } catch (error) {
        throw new Error("Failed to create new user");
    }
};
