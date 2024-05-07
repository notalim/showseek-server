import db from "../config/firebase-admin.js";
import { fetchMedia } from "../services/api.js";
import { sleep } from "../utils/helpers.js";

const mediaResolvers = {
    Query: {
        listMedia: async () => {
            const snapshot = await db.collection("media").get();
            return snapshot.docs.map((doc) => doc.data());
        },
    },
    Mutation: {
        populateMedia: async (
            _: any,
            { type, page }: { type: string; page: number }
        ) => {
            const mediaData = await fetchMedia(type, page);
            const batch = db.batch();
            mediaData.results.forEach((media: any) => {
                const mediaRef = db.collection("media").doc(); // Generate a new doc for each media
                const mediaToSave = {
                    title: media.title || media.name,
                    dateOfRelease: media.release_date || media.first_air_date,
                    imgUrl: `https://image.tmdb.org/t/p/w500${media.poster_path}`,
                    genres: media.genre_ids, // You may want to convert genre IDs to genre names
                    description: media.overview,
                    mediatype: type,
                };
                batch.set(mediaRef, mediaToSave);
            });
            await batch.commit();
            return mediaData.results.length; // Returning the count of items added
        },
        bulkPopulateMedia: async (
            _: any,
            { type, totalPages }: { type: string; totalPages: number }
        ) => {
            let totalAdded = 0;
            for (let page = 1; page <= totalPages; page++) {
                const mediaData = await fetchMedia(type, page);
                const batch = db.batch();
                mediaData.results.forEach((media: any) => {
                    const mediaRef = db.collection("media").doc();
                    const mediaToSave = {
                        title: media.title || media.name,
                        dateOfRelease:
                            media.release_date || media.first_air_date,
                        imgUrl: `https://image.tmdb.org/t/p/w500${media.poster_path}`,
                        genres: media.genre_ids,
                        description: media.overview,
                        mediatype: type,
                    };
                    batch.set(mediaRef, mediaToSave);
                });
                await batch.commit();
                totalAdded += mediaData.results.length;
                console.log(
                    `Page ${page} populated. Total added so far: ${totalAdded}`
                );
                if (page % 40 === 0) {
                    // Every 40 requests, pause to respect the API rate limit
                    await sleep(10500); // Sleep for a bit over 10 seconds
                }
            }
            return totalAdded; // Returning the total count of items added
        },
    },
};

export default mediaResolvers;
