import { compare, hash } from 'bcrypt';
export const hashPassword = async (password) => {
    return hash(password, 10);
};
export const comparePassword = async (password, hash) => {
    return compare(password, hash);
};
