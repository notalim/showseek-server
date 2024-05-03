import axios from "axios";
const OPENAI_API_URL = "https://api.openai.com/v1/completions";

const fetchVibeFromOpenAI = async (titles: string[]) => {
    const prompt = `
Create a short, fun, and spicy vibe summary for a week based on watching the following movies and TV shows:
${titles.join(", ")}

Include elements specific to these movies, such as characters, themes, or memorable moments.
Write it in lowercase, start with an infinitive verb, add ONE emoji that relates to the VIBE itself in front of the VIBE, and end with a period.

Examples:
Movies: The Matrix, Inception, The Truman Show
Vibe: 🌀 questioning reality while navigating mind-bending dreamscapes and simulated worlds.

Movies: The Avengers, The Dark Knight, Black Panther
Vibe: 🦸‍♂️ teaming up with superheroes to save the world from villainous threats.

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

        return response.data.choices[0].text.trim() || "no vibe this week :("
    } catch (error) {
        console.error("Error fetching vibe from OpenAI:", error);
    }
};

export { fetchVibeFromOpenAI };
