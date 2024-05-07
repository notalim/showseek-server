import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
});

enum EnumMediaType {
    MOVIE = "MOVIE",
    SHOW = "SHOW",
}

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

/**
 * Fetches detailed information about a movie or TV show from TMDB
 * @param {number} mediaId - The ID of the media
 * @param {EnumMediaType} type - The type of media (MOVIE or SHOW)
 * @returns {Promise<any>} - Detailed information about the media
 */

export const fetchMediaDetail = async (
    mediaId: number,
    type: EnumMediaType
): Promise<any> => {
    const endpoint = type === EnumMediaType.MOVIE ? "movie" : "tv";
    const response = await axiosInstance.get(`/${endpoint}/${mediaId}`, {
        params: {
            api_key: process.env.TMDB_API_KEY,
            language: "en-US",
        },
    });
    return response.data;
};
