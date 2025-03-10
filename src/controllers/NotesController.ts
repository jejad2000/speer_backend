
import prisma from '../models/prismaClient';
import { successResponse, notFoundResponse, validationError, successResponseWithData, errorResponse } from "../utils/ApiResponse";

export class NotesController {

    // Method to create a new note
    public static async createNote (req: any, res: any) {
        const userId = req.user?.userId;
        const { title, content } = req.body;

        if (!title || !content) {
            return validationError(res, "Title and content are required");
        }

        try {
            await prisma.note.create({ data: { title, content, user_id: userId } });
            return successResponse(res, "Note created successfully");
        } catch (err) {
            return errorResponse(res, "Failed to create note");
        }
    }

    // Method to update an existing note
    public static async updateNote (req: any, res: any) {
        const { id } = req.params;
        const userId = req.user?.userId;
        const { title, content } = req.body;

        if (!title || !content) {
            return validationError(res, "Title and content are required");
        }

        try {
            // Check if note exists
            const existingNote:any = await prisma.$queryRaw`
                SELECT n.* FROM "Note" n
                LEFT JOIN "SharedNotes" s ON n.id = s.notes_id
                WHERE n.id = ${parseInt(id)} AND (n.user_id = ${userId} OR s.user_id = ${userId});
            `;

            if (existingNote.length === 0) {
                return notFoundResponse(res, 'Note not found');
            }

            await prisma.note.update({ 
                where: { id: parseInt(id) },
                data: { title, content } 
            });

            return successResponse(res, "Note update successfully");
        } catch (err) {
            return errorResponse(res, "Failed to update note");
        }
    }

    // Method to share a note
    public static async shareNote (req: any, res: any) {
        const { id } = req.params;
        const myUserId = req.user?.userId;
        const { userId } = req.body;

        if (!userId) {
            return validationError(res, "User ID is required");
        }

        try {

            if (parseInt(userId) === parseInt(myUserId)) {
                return validationError(res, "Cannot share note with yourself");
            }

            // Check if note exists
            const existingNote = await prisma.note.findFirst({
                where: { id: parseInt(id), user_id: myUserId }
            });

            if (!existingNote) {
                return notFoundResponse(res, 'Note not found');
            }

            const existingShare = await prisma.sharedNotes.findFirst({
                where: { notes_id: parseInt(id), user_id: userId }
            }); 

            if (existingShare) {
                return validationError(res, 'Note already shared with user');
            }

            await prisma.sharedNotes.create({ data: { notes_id: parseInt(id), user_id: userId } });

            return successResponse(res, "Note shared successfully");
        } catch (err) {
            return errorResponse(res, "Failed to share note");
        }
    }

    // Method to get all notes
    public static async getAllNotes (req: any, res: any) {
        const userId = req.user?.userId;

        try {
            const notes = await prisma.$queryRaw`
                SELECT n.* FROM "Note" n
                LEFT JOIN "SharedNotes" s ON n.id = s.notes_id
                WHERE n.user_id = ${userId} OR s.user_id = ${userId};
            `;
            
            return successResponseWithData(res, "Notes retrieved successfully", notes);
        } catch (err) {
            return errorResponse(res, "Failed to get notes");
        }
    }

    // Method to get note
    public static async getNote (req: any, res: any) {
        const userId = req.user?.userId;
        const { id } = req.params;

        try {
            const note:any = await prisma.$queryRaw`
                SELECT n.* FROM "Note" n
                LEFT JOIN "SharedNotes" s ON n.id = s.notes_id
                WHERE n.id = ${parseInt(id)} AND (n.user_id = ${userId} OR s.user_id = ${userId});
            `;

            if (note.length === 0) {
                return notFoundResponse(res, 'Note not found');
            }

            return successResponseWithData(res, "Note retrieved successfully", note[0]);
        } catch (err) {
            return errorResponse(res, "Failed to get note");
        }
    }

    // Method to search note
    public static async getSearchNote (req: any, res: any) {
        const userId = req.user?.userId;
        const query = req.query.q as string;

        console.log(query);
        if (!query) {
            return validationError(res, "Search query is required");
        }
    
        try {
            const notes = await prisma.$queryRaw`
                SELECT n.* FROM "Note" n
                LEFT JOIN "SharedNotes" s ON n.id = s.notes_id
                WHERE (to_tsvector('english', n.title || ' ' || n.content) @@ plainto_tsquery('english', ${query}))
                AND (n.user_id = ${userId} OR s.user_id = ${userId})
                ORDER BY ts_rank(to_tsvector('english', n.title || ' ' || n.content), plainto_tsquery('english', ${query})) DESC;
            `;

            return successResponseWithData(res, "Notes retrieved successfully", notes);
        } catch (err) {
            console.log(err);
            return errorResponse(res, "Failed to get notes");
        }
    }

    // Method to delete note
    public static async deleteNote (req: any, res: any) {
        const userId = req.user?.userId;
        const { id } = req.params;

        try {
            const note = await prisma.note.findFirst({
                where: { id: parseInt(id), user_id: userId }
            });

            if (!note) {
                return notFoundResponse(res, 'Note not found');
            } else {
                await prisma.note.delete({
                    where: { id: parseInt(id) }
                });

                return successResponse(res, "Note deleted successfully");
            }
            
        } catch (err) {
            return errorResponse(res, "Failed to get note");
        }
    }
}

export default NotesController;