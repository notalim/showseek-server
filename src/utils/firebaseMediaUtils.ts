import db from "../config/firebase-admin.js";
import { DocumentData } from "firebase-admin/firestore";
import { fetchMedia } from "./api.js";

/**
 * Fetches all media from the Firestore database
 * @returns {Promise<DocumentData[]>} - An array of media objects
 */
export const getMediaCollection = async (): Promise<DocumentData[]> => {
    try {
        const snapshot = await db.collection("media").get();
        return snapshot.docs.map((doc) => doc.data() as DocumentData);
    } catch (error) {
        throw new Error("Failed to get media collection");
    }
};

/**
 * Fetches a single media by ID from the Firestore database
 * @param mediaId
 * @returns {Promise<DocumentData | null>} object with the attached mediaId
 */
export const getMediaById = async (
    mediaId: string
): Promise<DocumentData | null> => {
    try {
        const doc = await db.collection("media").doc(mediaId).get();
        return doc.exists ? (doc.data() as DocumentData) : null;
    } catch (error) {
        throw new Error(`Failed to get media by ID: ${mediaId}`);
    }
};

/**
 * Fetches media by genre from the Firestore database
 * @param genre
 * @returns {Promise<DocumentData[]>} - An array of media objects
 */
export const createMedia = async (
    mediaData: Record<string, any>
): Promise<string> => {
    try {
        const mediaRef = db.collection("media").doc();
        await mediaRef.set(mediaData);
        return mediaRef.id;
    } catch (error) {
        throw new Error("Failed to create new media");
    }
};

/**
 * Fetches media by genre from the Firestore database
 * @param genre
 * @returns {Promise<number>} - The number of media items deleted
 */
export const bulkPopulateMedia = async (type: string, totalPages: number): Promise<number> => {
    let totalAdded = 0;
    for (let page = 1; page <= totalPages; page++) {
        const mediaData = await fetchMedia(type, page);
        const batch = db.batch();
        mediaData.results.forEach((media: any) => {
            const mediaRef = db.collection("media").doc();
            const mediaToSave = {
                title: media.title || media.name,
                dateOfRelease: media.release_date || media.first_air_date,
                imgUrl: `https://image.tmdb.org/t/p/w500${media.poster_path}`,
                genres: media.genre_ids, // You may want to map genre IDs to genre names
                description: media.overview,
                mediatype: type === "MOVIE" ? "MOVIE" : "SHOW",
            };
            batch.set(mediaRef, mediaToSave);
        });
        await batch.commit();
        totalAdded += mediaData.results.length;
        console.log(
            `Page ${page} populated. Total added so far: ${totalAdded}`
        );
    }
    return totalAdded;
};

/**
 * Gets the all media Ids from the Firestore database
 * @param userId
 * @returns {Promise<string[]>} - An array of media IDs
 */
export const getAllMediaIds = async (): Promise<string[]> => {
    const mediaRef = db.collection("media");
    const snapshot = await mediaRef.get();
    return snapshot.docs.map((doc) => doc.id);
};
