import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// Get environment variable or throw an error if it's missing
export const getEnv = (key) => {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is missing`);
    }
    return value;
};
export const jwtSecret = getEnv("JWT_SECRET");
export const generateToken = (user) => {
    const payload = {
        userId: user.id,
        username: user.username,
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtSecret);
    }
    catch (error) {
        throw new Error("Invalid token");
    }
};
