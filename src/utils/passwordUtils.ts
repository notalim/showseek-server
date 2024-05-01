import { compare, hash } from 'bcrypt';

export const hashPassword = async (password: string) => {
    return hash(password, 10);
}

export const comparePassword = async (password: string, hash: string) => {
    return compare(password, hash);
}
