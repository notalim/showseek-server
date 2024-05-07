import axios from "axios";
import { getUserById, getAllUsers, updateUserVibe } from "./userUtils.js";
import dotenv from "dotenv";

const OPENAI_API_URL = "https://api.openai.com/v1/completions";
const DEFAULT_VIBE = "no vibe this week :(";

dotenv.config();

/**
 * Fetches a vibe summary from OpenAI based on the titles of movies and TV shows
 * @param {string[]} titles - Array of movie and TV show titles
 * @returns {Promise<string>} - Vibe summary
 */
const fetchVibeFromOpenAI = async (titles: string[]): Promise<string> => {
    const prompt = `
Create a short, fun, and spicy vibe summary for a week based on watching the following movies and TV shows:
${titles.join(", ")}

Include elements specific to these movies, such as characters, themes, or memorable moments.
Write it in lowercase, start with an infinitive verb, add ONE emoji that relates to the VIBE itself in front of the VIBE, and end with a period.
DON'T include any movie titles in the VIBE.

Examples:
Movies: The Matrix, Inception, The Truman Show
Vibe: 🌀 questioning reality while navigating mind-bending dreamscapes and simulated worlds.

Movies: The Avengers, The Dark Knight, Black Panther
Vibe: 🦸‍♂️ teaming up with superheroes to save the world from villainous threats.

Movies: The Godfather, Scarface, Goodfellas
Vibe: 🕶️ rising through the ranks of the criminal underworld with style and swagger.

Movies: The Lion King, Saving Private Ryan, The Shawshank Redemption
Vibe: 🦁 embarking on emotional journeys of self-discovery, courage, and redemption.

Movies: ${titles.join(", ")}
Vibe:`;

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "davinci-002",
                prompt: prompt,
                max_tokens: 30,
                temperature: 0.01,
                stop: "\n",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // console.log("Vibe:", response.data.choices[0].text.trim());

        return response.data.choices[0].text.trim() || DEFAULT_VIBE;
    } catch (error) {
        console.error("Error fetching vibe from OpenAI:", error);
        return DEFAULT_VIBE;
    }
};

/**
 * Fetches the last watched media for one user and updates their vibe
 * @param {string} userId - The ID of the user
 * @returns {Promise<void>}
 */
const updateOneUserVibe = async (userId: string): Promise<void> => {
    const user = (await getUserById(userId)) || {};
    const lastWatched = user.lastWatched || [];
    if (lastWatched.length > 0) {
        const titles = lastWatched.map((item: any) => item.title);
        const vibe = await fetchVibeFromOpenAI(titles);
        await updateUserVibe(user.id, vibe);
    } else {
        await updateUserVibe(user.id, DEFAULT_VIBE);
    }
};

/**
 * Fetches the last watched media for all users and updates their vibe
 * based on the media they watched
 * @returns {Promise<void>}
 */
const updateAllUserVibes = async (): Promise<void> => {
    const users = await getAllUsers();
    for (const user of users) {
        const lastWatched = user.lastWatched || [];
        if (lastWatched.length > 0) {
            const titles = lastWatched.map((item: any) => item.title);
            const vibe = await fetchVibeFromOpenAI(titles);
            await updateUserVibe(user.id, vibe);
        } else {
            await updateUserVibe(user.id, DEFAULT_VIBE);
        }
    }
};

export { fetchVibeFromOpenAI, updateAllUserVibes };
