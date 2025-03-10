import { NotesController } from "../../controllers/NotesController";
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

describe("NoteController Unit Tests", () => {
    beforeAll(async () => {
        await prismaRun.$executeRawUnsafe(`TRUNCATE TABLE "Note", "SharedNotes" RESTART IDENTITY CASCADE;`);
    });

    afterEach(async () => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test("createNote - should create a note", async () => {
        const req = { user: { userId: 1 }, body: { title: "Test Note", content: "This is a test." } } as Partial<Request>;
        const res = mockResponse();
        
        await NotesController.createNote(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Note created successfully" }));
    });

    test("createNote - should not create a note", async () => {
        const req = { user: { userId: 1 }, body: { title: "Test Note" } } as Partial<Request>;
        const res = mockResponse();
        
        await NotesController.createNote(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Title and content are required" }));
    });

    test("getNote - should return a note", async () => {
        const req = { user: { userId: 1 }, params: { id: "1" } } as Partial<Request>;
        const res = mockResponse();

        await NotesController.getNote(req as Request, res);
        
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ id: 1 }) }));
    });

    test("getSearchNote - should return search results", async () => {
        const req = { user: { userId: 1 }, query: { q: "test" } } as Partial<Request>;
        const res = mockResponse();

        await NotesController.getSearchNote(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Array) }));
    });

    test("updateNote - should update a note", async () => {
        const req = { user: { userId: 1 }, params: { id: "1" }, body: { title: "Updated Title", content: "Updated content" } } as Partial<Request>;
        const res = mockResponse();

        await NotesController.updateNote(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Note updated successfully" }));
    });

    test("deleteNote - should delete a note", async () => {
        const req = { user: { userId: 1 }, params: { id: "1" } } as Partial<Request>;
        const res = mockResponse();

        await NotesController.deleteNote(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Note deleted successfully" }));
    });
});
