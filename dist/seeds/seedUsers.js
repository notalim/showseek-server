import { createUser } from "../utils/firebaseUserUtils.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { getAllMediaIds, } from "../utils/firebaseMediaUtils.js";
import { seedUserWatchedMedia } from "./seedUserWatchedMedia.js";
import { getAllUsers } from "../utils/firebaseUserUtils.js";
import { clearUsersCollection } from "../utils/firebaseDeleteUtils.js";
const users = [
    { phoneNumber: "1234567890", password: "Password123" },
    { phoneNumber: "1234567891", password: "Password123" },
    { phoneNumber: "1234567892", password: "Password123" },
    { phoneNumber: "1234567893", password: "Password123" },
];
const seedUsers = async () => {
    for (const user of users) {
        const hashedPassword = await hashPassword(user.password);
        const userData = {
            phoneNumber: user.phoneNumber,
            password: hashedPassword,
        };
        try {
            const userId = await createUser(userData);
            console.log(`User created with ID: ${userId}`);
        }
        catch (error) {
            console.error("Error creating user:", error);
        }
    }
};
const seedWatchedMediaForUsers = async () => {
    const users = await getAllUsers();
    const mediaIds = await getAllMediaIds();
    for (const user of users) {
        await seedUserWatchedMedia(user.id, mediaIds, 3, 6); // Each user watches 3-6 random media
    }
};
const clearAndSeedAll = async () => {
    try {
        await clearUsersCollection(); // Clear users collection
        await seedUsers();
        await seedWatchedMediaForUsers(); // Seed watched media
        console.log("All seeding tasks completed successfully.");
    }
    catch (error) {
        console.error("Error during seeding:", error);
    }
    finally {
        process.exit();
    }
};
clearAndSeedAll();
