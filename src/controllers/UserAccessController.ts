
import { compare, hash } from 'bcryptjs';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/Auth';
import { validationError, successResponseWithData, successResponse, notFoundResponse, errorResponse } from "../utils/ApiResponse";
import { isEmailValid } from '../utils/Validator';
import prisma from '../models/PrismaClient';

class UserAccessController {

    public static async login(req: any, res: any) {
        const { email, password } = req.body;

        if (!email || !password) {
            return validationError(res, "Email and password are required"); 
        }

        const emailValid:boolean =  isEmailValid(email);

        if (!emailValid) {
            return validationError(res, "Email is not valid"); 
        }

        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            return validationError(res, "User is not available");
        }

        const isPasswordValid = await compare(password, user.password);
        
        if (!isPasswordValid) {
            return validationError(res, "Invalid password");
        }

        const token        = generateToken(user.id);
        const tokenRefresh = generateRefreshToken(user.id);

        //save refresh token in db
        await prisma.refreshToken.create({ data: { token: tokenRefresh, user_id: user.id } });

        //save to cookie
        res.cookie('refreshToken', tokenRefresh, { httpOnly: true, secure: true, sameSite: 'strict' });

        return successResponseWithData(res, "Successfully login", { token: token, refreshToken: tokenRefresh });
    }

    public static async signup(req: any, res: any) {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return validationError(res, "Email and password are required"); 
        }

        const emailValid:boolean =  isEmailValid(email);

        if (!emailValid) {
            return validationError(res, "Email is not valid"); 
        }

        const hashedPassword = await hash(password, 10);

        try {
            await prisma.user.create({ data: { email, password: hashedPassword } });
            successResponse(res, "User registered successfully");
        } catch (error) {
            return errorResponse(res, "User already exists");
        }
    }

    public static async refreshToken (req: any, res: any) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) validationError(res, "Refresh token required");
    
        // Check if token exists and is not revoked
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });
    
        if (!storedToken || storedToken?.revoked_at) {
            return notFoundResponse(res, "Invalid or expired refresh token");
        }
        
        const refreshTokenUser = verifyRefreshToken(refreshToken);

        if (refreshTokenUser === null) { 
            return notFoundResponse(res, "Invalid or expired refresh token");
        } else {
            const token  = generateToken(refreshTokenUser.id);
            return successResponseWithData(res, "Access token generated", { token: token});
        }
    }

    public static async logout (req: any, res: any) {
        const userId = req.user.userId;

        // Soft delete refresh token
        await prisma.refreshToken.updateMany({
            where: { user_id: userId },
            data: { revoked_at: new Date() }
        });

        res.clearCookie('refreshToken');
        successResponse(res, "Logged out successfully");
    }
    
}

export default UserAccessController;
