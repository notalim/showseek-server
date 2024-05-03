import { fetchVibeFromOpenAI } from "../utils/vibeUtils.js";
import { getLastWatchedMedia } from "../utils/firebaseUserUtils.js";

const resolvers = {
    Query: {
        getWeeklyRecap: async (_: any, { userId }: { userId: string }) => {
            try {
                const lastWatched = await getLastWatchedMedia(userId);
                if (lastWatched.length === 0) {   
                    return { titles: [], vibe: "no vibe this week :(" };
                }   
                const titles = lastWatched.map((item: any) => item.title);
                const vibe = await fetchVibeFromOpenAI(titles);
                return { titles, vibe };
            } catch (error: any) {
                throw new Error(
                    "Failed to generate weekly recap: " + error.message
                );
            }
        },
    },
};

export default resolvers;
