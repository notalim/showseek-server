import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
export const fetchAndStoreGenres = async () => {
    const response = await axios.get("https://api.themoviedb.org/3/genre/movie/list", {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
        params: {
            language: "en-US",
        },
    });
    const genreMap = {};
    response.data.genres.forEach((genre) => {
        genreMap[genre.id.toString()] = genre.name;
    });
    return genreMap;
};
// Store the genres as a JS module
export const storeGenres = async () => {
    const genres = await fetchAndStoreGenres();
    const genreModuleContent = `export const genres = ${JSON.stringify(genres)};`;
    fs.writeFileSync("./src/data/genres.js", genreModuleContent);
};
await storeGenres();
