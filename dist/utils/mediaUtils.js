import db from "../config/firebase-admin.js";
/**
 * Fetches all media from the Firestore database
 * @returns {Promise<DocumentData[]>} - An array of media objects
 */
export const getMediaCollection = async () => {
    try {
        const snapshot = await db.collection("media").get();
        return snapshot.docs.map((doc) => doc.data());
    }
    catch (error) {
        throw new Error("Failed to get media collection");
    }
};
/**
 * Fetches a single media by ID from the Firestore database
 * @param mediaId
 * @returns {Promise<DocumentData | null>} object with the attached mediaId
 */
export const getMediaById = async (mediaId) => {
    try {
        const doc = await db.collection("media").doc(mediaId).get();
        return doc.exists ? doc.data() : null;
    }
    catch (error) {
        throw new Error(`Failed to get media by ID: ${mediaId}`);
    }
};
/**
 * Fetches media by genre from the Firestore database
 * @param genre
 * @returns {Promise<DocumentData[]>} - An array of media objects
 */
export const createMedia = async (mediaData) => {
    try {
        const mediaRef = db.collection("media").doc();
        await mediaRef.set(mediaData);
        return mediaRef.id;
    }
    catch (error) {
        throw new Error("Failed to create new media");
    }
};
/**
 * Gets the all media Ids from the Firestore database
 * @param userId
 * @returns {Promise<string[]>} - An array of media IDs
 */
export const getAllMediaIds = async () => {
    const mediaRef = db.collection("media");
    const snapshot = await mediaRef.get();
    return snapshot.docs.map((doc) => doc.id);
};
