import { createUser, getAllUsers, generateAllUserWeeklyRecaps } from "../utils/userUtils.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { getAllMediaIds } from "../utils/mediaUtils.js";
import { seedUserWatchedMedia } from "./seedUserWatchedMedia.js";
import { clearUsersCollection, clearGroupsCollection } from "../utils/firebaseDeleteUtils.js";

import { createGroup, joinGroup, generateGroupRecap } from "../utils/socialUtils.js";

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
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
};

async function setupGroup() {
    const allUsers = await getAllUsers();
    if (allUsers.length > 0) {
        const groupData = {
            name: "The Awesome Group",
            description: "A group for awesome people.",
        };
        const groupId = await createGroup(allUsers[0].id, groupData);
        console.log(`Group created with ID: ${groupId}`);

        for (let i = 1; i < allUsers.length; i++) {
            await joinGroup(allUsers[i].id, groupId);
            console.log(`User ${allUsers[i].id} joined the group.`);
        }
        return groupId;
    } else {
        console.error("No users found to create and join group.");
    }
}

const seedWatchedMediaForUsers = async () => {
    const users = await getAllUsers();
    const mediaIds = await getAllMediaIds();

    for (const user of users) {
        await seedUserWatchedMedia(user.id, mediaIds, 3, 6);
        console.log(`Watched media seeded for user ${user.id}`);
    }
};

const clearAndSeedAll = async () => {
    try {
        await clearUsersCollection(); // Clear users collection
        await clearGroupsCollection(); // Clear groups collection
        await seedUsers(); // Seed users
        await seedWatchedMediaForUsers(); // Seed watched media
        const groupId = await setupGroup(); // Create group and add users
        await generateAllUserWeeklyRecaps(); // Generate weekly recaps
        if (groupId) await generateGroupRecap(groupId); // Generate group recap
        console.log("All seeding tasks completed successfully.");
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        process.exit();
    }
};

clearAndSeedAll();
