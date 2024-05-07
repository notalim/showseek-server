import { getUserByPhoneNumber, createUser } from "../utils/userUtils.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../auth.js";
import handleError from "../utils/ApolloErrorHandling.js";

interface SignUpInput {
    phoneNumber: string;
    password: string;
}

interface LoginInput {
    phoneNumber: string;
    password: string;
}

export const authResolvers = {
    Mutation: {
        signUp: async (_: any, { input }: { input: SignUpInput }) => {
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
                const token = generateToken(userId); // Generate token after user creation
                return { userId, token }; // Include the token in the return
            } catch (error: any) {
                throw handleError(error, "Failed to sign up", "SIGNUP_FAILED", {
                    phoneNumber: input.phoneNumber,
                });
            }
        },
        login: async (_: any, { input }: { input: LoginInput }) => {
            try {
                const { phoneNumber, password } = input;
                const user = await getUserByPhoneNumber(phoneNumber);
                if (!user) {
                    throw new Error("User not found");
                }
                console.log(user);
                const isPasswordValid = await comparePassword(
                    password,
                    user.password
                );
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }
                const token = generateToken(user.id);
                return { userId: user.id, token };
            } catch (error: any) {
                throw handleError(error, "Failed to login", "LOGIN_FAILED", {
                    phoneNumber: input.phoneNumber,
                });
            }
        },
    },
};

export default authResolvers;
