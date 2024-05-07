import db from "../config/firebase-admin.js";
import { fetchMedia, fetchMediaDetail } from "../services/api.js";
import { genres } from "../data/genres.js";

enum EnumMediaType {
    MOVIE = "MOVIE",
    SHOW = "SHOW",
}

/**
 * Fetches media by genre from the Firestore database
 * @param totalPages - The total number of pages to populate
 * @param {EnumMediaType} type - The type of media to populate
 * @returns {Promise<number>} - The number of media items deleted
 */
export const bulkPopulateMedia = async (
    type: EnumMediaType,
    totalPages: number
): Promise<number> => {
    let totalAdded = 0;
    for (let page = 1; page <= totalPages; page++) {
        const mediaData = await fetchMedia(type, page);
        const batch = db.batch();

        for (const media of mediaData.results) {

            

            const detail = await fetchMediaDetail(media.id, type); // Fetch detailed data
            const mediaRef = db.collection("media").doc();
            const mediaToSave = {
                tmdbId: media.id,
                title: media.title || media.name,
                dateOfRelease: media.release_date || media.first_air_date,
                imgUrl: `https://image.tmdb.org/t/p/w500${media.poster_path}`,
                genres: media.genre_ids.map(
                    (genreId: number) => genres[genreId] || "Unknown"
                ),
                description: media.overview,
                mediatype:
                    type === EnumMediaType.MOVIE
                        ? EnumMediaType.MOVIE
                        : EnumMediaType.SHOW,
                runtime:
                    type === EnumMediaType.MOVIE
                        ? detail.runtime || 0
                        : detail.episode_run_time &&
                          detail.episode_run_time.length > 0
                        ? detail.episode_run_time[0]
                        : 0,
                adult: media.adult,
            };
            batch.set(mediaRef, mediaToSave);
        }
        await batch.commit();
        totalAdded += mediaData.results.length;
        console.log(
            `Page ${page} populated. Total added so far: ${totalAdded}`
        );
    }
    return totalAdded;
};
