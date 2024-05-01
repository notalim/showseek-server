// authResolvers.ts
import { getUserByPhoneNumber, createUser, } from "../utils/firebaseUserUtils.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import handleError from "../utils/ApolloErrorHandling.js";
export const authResolvers = {
    Mutation: {
        signUp: async (_, { input }) => {
            try {
                const { phoneNumber, password } = input;
                const existingUser = await getUserByPhoneNumber(phoneNumber);
                if (existingUser) {
                    throw new Error("User already exists");
                }
                const hashedPassword = await hashPassword(password);
                const userId = await createUser({
                    phoneNumber,
                    password: hashedPassword,
                });
                return { userId };
            }
            catch (error) {
                throw handleError(error, "Failed to sign up", "SIGNUP_FAILED", {
                    phoneNumber: input.phoneNumber,
                });
            }
        },
        login: async (_, { input }) => {
            try {
                const { phoneNumber, password } = input;
                const user = await getUserByPhoneNumber(phoneNumber);
                if (!user) {
                    throw new Error("User not found");
                }
                const isPasswordValid = await comparePassword(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }
                // Implement token generation or session handling here instead of returning user directly
                return { userId: user.id }; // Only return user ID or a token
            }
            catch (error) {
                throw handleError(error, "Failed to login", "LOGIN_FAILED", {
                    phoneNumber: input.phoneNumber,
                });
            }
        },
    },
};
