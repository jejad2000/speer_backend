import UserAccessController from "../../controllers/UserAccessController";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { jest } from '@jest/globals';

// Mock response functions
const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res) as unknown as (code: number) => Response;
    res.json = jest.fn().mockReturnValue(res) as unknown as (body: any) => Response;
    res.cookie = jest.fn().mockReturnValue(res) as unknown as (body: any) => Response;
    res.clearCookie = jest.fn().mockReturnValue(res) as unknown as (body: any) => Response;
    return res as Response;
};

const prismaRun = new PrismaClient();

describe("UserController Unit Tests", () => {
    beforeAll(async () => {
        await prismaRun.$executeRawUnsafe(`TRUNCATE TABLE "User", "RefreshToken" RESTART IDENTITY CASCADE;`);
    });

    afterEach(async () => {
        await prismaRun.$disconnect();
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test("sign up - should create a user", async () => {
        const req = { body: { email: "test@email.com", password: "test" } } as Partial<Request>;
        const res = mockResponse();
        
        await UserAccessController.signup(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "User registered successfully" }));
    });

    test("login - should login a user", async () => {
        const req = { body: { email: "test@email.com", password: "test" } } as Partial<Request>;
        const res = mockResponse();
        
        await UserAccessController.login(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Successfully login" }));
    });

    test("logout - should logout a user", async () => {
        const req = { user: { userId: 1 } } as Partial<Request>;
        const res = mockResponse();

        await UserAccessController.logout(req as Request, res);
        
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Logged out successfully" }));
    });
});
