import { addMediaToUserWatched } from '../utils/firebaseUserUtils.js';

export const seedUserWatchedMedia = async (userId: string, mediaIds: string[], min: number, max: number): Promise<void> => {
    const numberOfMediaToWatch = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffledMediaIds = mediaIds.sort(() => 0.5 - Math.random());
    const selectedMediaIds = shuffledMediaIds.slice(0, numberOfMediaToWatch);

    for (const mediaId of selectedMediaIds) {
        const rating = Math.floor(Math.random() * 10) + 1;  // Random rating between 1 and 5
        const watchedOn = new Date().toISOString();
        const success = await addMediaToUserWatched(userId, mediaId, rating, watchedOn);
        if (!success) {
            console.error(`Failed to add media ${mediaId} to user ${userId}`);
        }
    }
};