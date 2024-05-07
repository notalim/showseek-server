import { addMediaToUserWatched } from "../utils/userUtils.js";
import { getMediaById } from "../utils/mediaUtils.js";

export const seedUserWatchedMedia = async (
    userId: string,
    mediaIds: string[],
    min: number,
    max: number
): Promise<void> => {
    const numberOfMediaToWatch =
        Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffledMediaIds = mediaIds.sort(() => 0.5 - Math.random());
    const selectedMediaIds = shuffledMediaIds.slice(0, numberOfMediaToWatch);
   ;

    for (const mediaId of selectedMediaIds) {
        const title = (await getMediaById(mediaId))?.title;
        const rating = Math.floor(Math.random() * 10) + 1; // Random rating between 1 and 5
        const watchedOn = new Date().toISOString();
        const success = await addMediaToUserWatched(
            userId,
            mediaId,
            title,
            rating,
            watchedOn
        );
        if (!success) {
            console.error(`Failed to add media ${mediaId} to user ${userId}`);
        }
    }
};
