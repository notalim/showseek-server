import { fetchVibeFromOpenAI } from "../utils/vibeUtils.js";
import { getLastWatchedMedia } from "../utils/firebaseUserUtils.js";
const resolvers = {
    Query: {
        getWeeklyRecap: async (_, { userId }) => {
            try {
                const lastWatched = await getLastWatchedMedia(userId);
                if (lastWatched.length === 0) {
                    return { titles: [], vibe: "no vibe this week :(" };
                }
                const titles = lastWatched.map((item) => item.title);
                const vibe = await fetchVibeFromOpenAI(titles);
                return { titles, vibe };
            }
            catch (error) {
                throw new Error("Failed to generate weekly recap: " + error.message);
            }
        },
    },
};
export default resolvers;
