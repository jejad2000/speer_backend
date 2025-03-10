import { NotesController } from "../controllers/NotesController";
import prisma from '../models/prismaClient';
import { Request, Response } from "express";
import { jest } from '@jest/globals';

// Mock response functions
const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res) as unknown as (code: number) => Response;
    res.json = jest.fn().mockReturnValue(res) as unknown as (body: any) => Response;
    return res as Response;
};

// Mock Prisma client
jest.mock("../prismaClient", () => ({
    prisma: {
        note: {
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        sharedNotes: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        $queryRaw: jest.fn().mockImplementation(() => Promise.resolve([])),
    },
}));

describe("NoteController Unit Tests", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test("createNote - should create a note", async () => {
        const req = { user: { userId: 1 }, body: { title: "Test Note", content: "This is a test." } } as Partial<Request>;
        const res = mockResponse();

        (prisma.note.create as jest.Mock).mockResolvedValue({ title: "Test Note", content: "This is a test.", userId: 1 });

        await NotesController.createNote(req as Request, res);

        expect(prisma.note.create).toHaveBeenCalledWith({
            data: { title: "Test Note", content: "This is a test.", user_id: 1 },
        });
        
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Note created successfully" }));
    });

    test("updateNote - should update a note", async () => {
        const req = { user: { userId: 1 }, params: { id: "1" }, body: { title: "Updated Title", content: "Updated content" } } as Partial<Request>;
        const res = mockResponse();

        (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ id: 1, userId: 1 }]);
        (prisma.note.update as jest.Mock).mockResolvedValue({ id: 1, title: "Updated Title", content: "Updated content" });

        await NotesController.updateNote(req as Request, res);

        expect(prisma.note.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { title: "Updated Title", content: "Updated content" },
        });
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Note updated successfully" }));
    });

    test("deleteNote - should delete a note", async () => {
        const req = { user: { userId: 1 }, params: { id: "1" } } as Partial<Request>;
        const res = mockResponse();

        (prisma.note.findFirst as jest.Mock).mockResolvedValue({ id: 1, userId: 1 });
        (prisma.note.delete as jest.Mock).mockResolvedValue({ id: 1 });

        await NotesController.deleteNote(req as Request, res);

        expect(prisma.note.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Note deleted successfully" }));
    });

    test("getNote - should return a note", async () => {
        const req = { user: { userId: 1 }, params: { id: "1" } } as Partial<Request>;
        const res = mockResponse();

        (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ id: 1, title: "Test Note", content: "This is a test.", userId: 1 }]);

        await NotesController.getNote(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ id: 1 }) }));
    });

    test("getSearchNote - should return search results", async () => {
        const req = { user: { userId: 1 }, query: { q: "test" } } as Partial<Request>;
        const res = mockResponse();

        (prisma.$queryRaw as jest.Mock).mockResolvedValue([
            { id: 1, title: "Test Note", content: "This is a test." },
        ]);

        await NoteController.getSearchNote(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Array) }));
    });
});
