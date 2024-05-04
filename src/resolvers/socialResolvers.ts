import { fetchVibeFromOpenAI } from "../utils/vibeUtils.js";
import { getLastWatchedMedia } from "../utils/firebaseUserUtils.js";
import handleError from "../utils/ApolloErrorHandling.js";
import {
    getGroupById,
    getAllGroups,
    createGroup,
    updateGroupName,
    updateGroupPicture,
    joinGroup,
    leaveGroup,
    deleteGroup,
} from "../utils/socialUtils.js";

const resolvers = {
    Query: {
        getWeeklyRecap: async (_: any, { userId }: { userId: string }) => {
            try {
                const lastWatched = await getLastWatchedMedia(userId);
                if (lastWatched.length === 0) {
                    return { titles: [], vibe: "no vibe this week :(" };
                }
                const titles = lastWatched.map((item) => item.title);
                const vibe = await fetchVibeFromOpenAI(titles);
                return { titles, vibe };
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to retrieve weekly recap",
                    "WEEKLY_RECAP_FAILED",
                    { userId }
                );
            }
        },
        getGroupById: async (_: any, { groupId }: { groupId: string }) => {
            try {
                const group = await getGroupById(groupId);
                if (!group) {
                    throw handleError(
                        new Error("Group not found"),
                        "Group not found",
                        "GROUP_NOT_FOUND",
                        { groupId }
                    );
                }
                return group;
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to fetch group by ID",
                    "FETCH_GROUP_FAILED",
                    { groupId }
                );
            }
        },
        getAllGroups: async () => {
            try {
                const groups = await getAllGroups();
                return groups;
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to fetch all groups",
                    "FETCH_GROUPS_FAILED"
                );
            }
        },
    },
    Mutation: {
        createGroup: async (
            _: any,
            { userId, groupData }: { userId: string; groupData: any }
        ) => {
            try {
                const groupId = await createGroup(userId, groupData);
                const group = await getGroupById(groupId);
                if (!group) {
                    throw handleError(
                        new Error("Failed to fetch group after creation"),
                        "Failed to fetch group after creation",
                        "FETCH_GROUP_FAILED",
                        { groupId }
                    );
                }
                return group;
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to create group",
                    "CREATE_GROUP_FAILED",
                    { groupData }
                );
            }
        },
        updateGroupName: async (
            _: any,
            {
                userId,
                groupId,
                newName,
            }: { userId: string; groupId: string; newName: string }
        ) => {
            try {
                const updated = await updateGroupName(userId, groupId, newName);
                if (!updated) {
                    throw handleError(
                        new Error(
                            "Failed to update group name or group not found"
                        ),
                        "Failed to update group name",
                        "UPDATE_GROUP_FAILED",
                        { groupId, newName }
                    );
                }
                return await getGroupById(groupId);
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to update group name",
                    "UPDATE_GROUP_FAILED",
                    { groupId }
                );
            }
        },
        updateGroupPicture: async (
            _: any,
            {
                userId,
                groupId,
                newPictureUrl,
            }: { userId: string; groupId: string; newPictureUrl: string }
        ) => {
            try {
                const updated = await updateGroupPicture(
                    userId,
                    groupId,
                    newPictureUrl
                );
                if (!updated) {
                    throw handleError(
                        new Error(
                            "Failed to update group picture or group not found"
                        ),
                        "Failed to update group picture",
                        "UPDATE_GROUP_PICTURE_FAILED",
                        { groupId, newPictureUrl }
                    );
                }
                return await getGroupById(groupId);
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to update group picture",
                    "UPDATE_GROUP_PICTURE_FAILED",
                    { groupId }
                );
            }
        },
        joinGroup: async (
            _: any,
            { userId, groupId }: { userId: string; groupId: string }
        ) => {
            try {
                const joined = await joinGroup(userId, groupId);
                if (!joined) {
                    throw handleError(
                        new Error("Failed to join group or group is full"),
                        "Failed to join group",
                        "JOIN_GROUP_FAILED",
                        { userId, groupId }
                    );
                }
                return await getGroupById(groupId);
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to join group",
                    "JOIN_GROUP_FAILED",
                    { userId, groupId }
                );
            }
        },
        leaveGroup: async (
            _: any,
            { userId, groupId }: { userId: string; groupId: string }
        ) => {
            try {
                const left = await leaveGroup(userId, groupId);
                if (!left) {
                    throw handleError(
                        new Error("Failed to leave group"),
                        "Failed to leave group",
                        "LEAVE_GROUP_FAILED",
                        { userId, groupId }
                    );
                }
                return true;
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to leave group",
                    "LEAVE_GROUP_FAILED",
                    { userId, groupId }
                );
            }
        },
        deleteGroup: async (
            _: any,
            { userId, groupId }: { userId: string; groupId: string }
        ) => {
            try {
                const deleted = await deleteGroup(userId, groupId);
                if (!deleted) {
                    throw handleError(
                        new Error("Failed to delete group or not authorized"),
                        "Failed to delete group",
                        "DELETE_GROUP_FAILED",
                        { userId, groupId }
                    );
                }
                return true;
            } catch (error: any) {
                throw handleError(
                    error,
                    "Failed to delete group",
                    "DELETE_GROUP_FAILED",
                    { userId, groupId }
                );
            }
        },
    },
};

export default resolvers;
