import { sign, verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

// Load environment variables SECRET KEY if none use default
const SECRET_KEY         = process.env.JWT_SECRET || 'this_is_a_default_secret_key';
const SECRET_REFRESH_KEY = process.env.JWT_REFRESH_SECRET || 'this_is_a_default_refresh_secret_key';

export interface DecodedToken {
    id: number;
}

export const generateToken = (userId: number): string => {
    return sign({ userId }, SECRET_KEY, { expiresIn: '15m' });
};

export const verifyToken = (token: string): DecodedToken | null => {
    try {
        return verify(token, SECRET_KEY) as DecodedToken;
    } catch (err) {
        return null;
    }
};

export const generateRefreshToken = (userId: number): string => {
    return sign({ userId }, SECRET_REFRESH_KEY, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string): DecodedToken | null => {
    try {
        return verify(token, SECRET_REFRESH_KEY) as DecodedToken;
    } catch (err) {
        return null;
    }
};