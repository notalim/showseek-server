import { getUserByUsername, getUserByPhoneNumber, getUserByEmail } from "./firebaseUserUtils";
import validator from "validator";

export const validateUsername = async (username) => {
    if (!validator.isAlphanumeric(username, "en-US", { ignore: "-_." })) {
        return "Username must be alphanumeric and can include dashes, underscores, and dots.";
    }
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        return "Username already exists.";
    }
    return null; 
};

export const validatePhoneNumber = async (phoneNumber) => {
    const cleanedPhoneNumber = phoneNumber.replace(/-/g, "");
    if (
        !validator.isMobilePhone(cleanedPhoneNumber, "any", {
            strictMode: false,
        })
    ) {
        return "Invalid phone number.";
    }
    const existingUser = await getUserByPhoneNumber(cleanedPhoneNumber);
    if (existingUser) {
        return "Phone number already exists.";
    }
    return null; 
};

export const validateName = (name) => {
    if (!validator.isAlpha(name, "en-US", { ignore: " " })) {
        return "Name must only contain letters and spaces.";
    }
    return null;
};

export const validateEmail = async (email) => {
    if (!validator.isEmail(email)) {
        return "Invalid email format.";
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return "Email already exists.";
    }
    return null;
};

