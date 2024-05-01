import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
});

export const fetchMedia = async (type: string, page: number) => {
    const endpoint = type === "MOVIE" ? "discover/movie" : "discover/tv";
    const response = await axiosInstance.get(`/${endpoint}`, {
        params: {
            api_key: process.env.TMDB_API_KEY,
            page: page,
            language: "en-US",
        },
    });
    return response.data;
};
