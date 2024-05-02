import axios from "axios";

const OPENAI_API_URL = "https://api.openai.com/v1/engines/davinci/completions";

export const fetchVibeFromOpenAI = async (titles: string[]) => {
    // Build a detailed prompt that encourages the AI to think creatively.
    const prompt = `
    Imagine a weekly movie and TV show watching summary based on the following titles: ${titles.join(
        ", "
    )}.
    Try to capture the essence of the watched content in a fun, brief description. Include a mix of emotions, genres, and activities portrayed in these titles.
    Produce a vibe description that combines elements from the watched media to suggest a thematic summary for the week. Should be all lower-case and about 10-15 words.
    Should start with an infinite verb.
    `;

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                prompt: prompt,
                max_tokens: 60,
                temperature: 0.7,
                
            },
            {
                headers: {
                    Authorization: `Bearer sk-proj-sH5Dycoh1riApulmm7rMT3BlbkFJN5LaZNUprm0U4EmNaC6S`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Error fetching vibe from OpenAI with Axios: ", error);
        throw error;
    }
};
