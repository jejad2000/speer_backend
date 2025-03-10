import { unauthorizedResponse, notFoundResponse } from "../utils/ApiResponse";
import { verifyToken, verifyRefreshToken } from '../utils/Auth';
import prisma from '../models/PrismaClient';

export const authenticateToken  = async(req:any, res:any, next:any) => {
    const token = req.headers['authorization'];
    
    if (!token) return unauthorizedResponse(res, "Authentication failed");

    const user = verifyToken(token.split(" ")[1]);

    if (user === null) { 
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return unauthorizedResponse(res, "Authentication failed");
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });
    
        if (!storedToken || storedToken?.revoked_at) {
            return notFoundResponse(res, "Invalid or expired token");
        }

        const refreshTokenUser = verifyRefreshToken(refreshToken);

        if (refreshTokenUser === null) {
            // Soft delete refresh token
            await prisma.refreshToken.update({
                where: { token: refreshToken },
                data: { revoked_at: new Date() }
            });

            //logout user
            res.clearCookie('refreshToken');

            return notFoundResponse(res, "Invalid or expired token");
        } else {
            req.user = refreshTokenUser;
            next();
        }
    } else {
        req.user = user;
        next();
    }
};