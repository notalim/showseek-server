import userResolvers from "./userResolvers.js";
import mediaResolvers from "./mediaResolvers.js";
import authResolvers from "./authResolvers.js";
import profileResolvers from "./profileResolvers.js";
const resolvers = [userResolvers, mediaResolvers, authResolvers, profileResolvers];
export default resolvers;
