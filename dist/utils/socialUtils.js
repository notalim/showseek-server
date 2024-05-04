import db from "../config/firebase-admin.js";
/**
 * Creates a new group in the Firestore database
 * @param creatorId - The ID of the user creating the group
 * @param groupData - The data for the new group
 * @returns - The ID of the newly created group
 */
export const createGroup = async (creatorId, groupData) => {
    const groupRef = db.collection("groups").doc();
    const groupCreationDate = new Date().toISOString();
    const groupInviteUrl = `https://example.com/invite/${groupRef.id}`;
    await groupRef.set({
        ...groupData,
        groupLeader: creatorId,
        groupCreationDate,
        groupInviteUrl,
        members: [creatorId],
        awards: [],
    });
    await updateUserGroups(creatorId, groupRef.id, "add");
    return groupRef.id;
};
/**
 * Fetches a group by ID from the Firestore database
 * @param groupId - Id of the group to fetch
 * @returns {Promise<DocumentData[]>} - An array of group objects
*/
export const getGroupById = async (groupId) => {
    const groupRef = db.collection("groups").doc(groupId);
    const doc = await groupRef.get();
    if (!doc.exists) {
        console.error("No group found with ID:", groupId);
        return null;
    }
    return { id: doc.id, ...doc.data() };
};
/**
 * Fetches all groups from the Firestore database
 * @returns {Promise<DocumentData[]>} - An array of group objects
 */
export const getAllGroups = async () => {
    const groupsRef = db.collection("groups");
    const snapshot = await groupsRef.get();
    if (snapshot.empty) {
        console.error("No groups found");
        return [];
    }
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
/**
 * Updates the name of a group in the Firestore database
 * @param groupId - Id of the group to update
 * @param newName - New name for the group
 * @returns {Promise<void>} - True if the group was updated, false otherwise
 */
export const updateGroupName = async (userId, groupId, newName) => {
    const groupRef = db.collection("groups").doc(groupId);
    const doc = await groupRef.get();
    if (!doc.exists || !doc.data()?.members.includes(userId))
        return false;
    await groupRef.update({ name: newName });
    return true;
};
// * Placeholder for updating group picture
export const updateGroupPicture = async (userId, groupId, newPictureUrl) => {
    const groupRef = db.collection("groups").doc(groupId);
    const doc = await groupRef.get();
    if (!doc.exists || !doc.data()?.members.includes(userId))
        return false;
    await groupRef.update({ pictureUrl: newPictureUrl });
    return true;
};
/**
 * Adds a user to a group in the Firestore database
 * @param userId - The ID of the user to add
 * @param groupId - The ID of the group to add the user to
 * @returns {Promise<void>} - True if the user was added, false otherwise
 */
export const joinGroup = async (userId, groupId) => {
    const groupRef = db.collection("groups").doc(groupId);
    const doc = await groupRef.get();
    if (!doc.exists)
        return false;
    const groupData = doc.data();
    if (groupData.members.length >= 10)
        return false;
    if (!groupData.members.includes(userId)) {
        groupData.members.push(userId);
        await groupRef.update({ members: groupData.members });
        await updateUserGroups(userId, groupId, "add");
        return true;
    }
    return false;
};
/**
 * Removes a user from a group in the Firestore database
 * @param userId - The ID of the user to remove
 * @param groupId - The ID of the group to remove the user from
 * @returns {Promise<boolean>} - True if the user was removed, false otherwise
 */
export const leaveGroup = async (userId, groupId) => {
    const groupRef = db.collection("groups").doc(groupId);
    const doc = await groupRef.get();
    if (!doc.exists)
        return false;
    const groupData = doc.data();
    const updatedMembers = groupData.members.filter((member) => member !== userId);
    if (updatedMembers.length !== groupData.members.length) {
        await groupRef.update({ members: updatedMembers });
        await updateUserGroups(userId, groupId, "remove");
        return true;
    }
    return false;
};
/**
 * Deletes a group from the Firestore database
 * @param userId - The ID of the user deleting the group (should be the group leader)
 * @param groupId - The ID of the group to delete
 * @returns {Promise<boolean>}
 */
export const deleteGroup = async (userId, groupId) => {
    const groupRef = db.collection("groups").doc(groupId);
    const doc = await groupRef.get();
    if (!doc.exists || doc.data()?.groupLeader !== userId)
        return false;
    await groupRef.delete();
    return true;
};
/**
 * Helper to update a user's groups in the Firestore database
 * @param userId - The ID of the user to update
 * @param groupId - The ID of the group to add or remove
 * @param action - The action to perform: "add" or "remove"
 * @returns {Promise<boolean>}
 */
const updateUserGroups = async (userId, groupId, action) => {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        console.error("No user found with ID:", userId);
        return false;
    }
    const userData = userDoc.data() || {};
    const userGroups = userData.groups || [];
    if (action === "add") {
        if (!userGroups.includes(groupId)) {
            userGroups.push(groupId);
        }
    }
    else if (action === "remove") {
        const index = userGroups.indexOf(groupId);
        if (index > -1) {
            userGroups.splice(index, 1);
        }
    }
    await userRef.update({ groups: userGroups });
    return true;
};
