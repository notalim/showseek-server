import { deleteAllDocumentsInCollection } from "../utils/firebaseDeleteUtils.js";
import { bulkPopulateMedia } from "../seeds/seedMedia.js";
var EnumMediaType;
(function (EnumMediaType) {
    EnumMediaType["MOVIE"] = "MOVIE";
    EnumMediaType["SHOW"] = "SHOW";
})(EnumMediaType || (EnumMediaType = {}));
async function initializeDatabase() {
    console.log("Deleting all documents in 'media' collection...");
    await deleteAllDocumentsInCollection("media");
    console.log("'Media' collection cleared.");
    console.log("Starting to populate the database with movies...");
    const totalMoviesAdded = await bulkPopulateMedia(EnumMediaType.MOVIE, 5); // Populate 5 pages of movies
    console.log(`Total movies added: ${totalMoviesAdded}`);
    console.log("Starting to populate the database with TV shows...");
    const totalShowsAdded = await bulkPopulateMedia(EnumMediaType.SHOW, 5); // Populate 5 pages of TV shows
    console.log(`Total TV shows added: ${totalShowsAdded}`);
    console.log("Database population completed.");
}
initializeDatabase().catch((error) => {
    console.error("Failed to initialize database:", error);
});
