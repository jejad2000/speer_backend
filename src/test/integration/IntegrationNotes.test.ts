import request from "supertest";
import app from "../../index"; // Import your Express app
import PrismaClient from "../../models/prismaClient";

describe("Note API Integration Tests", () => {
    let token: string;

    beforeAll(async () => {
        await PrismaClient.$executeRawUnsafe(`TRUNCATE TABLE "User", "RefreshToken", "Note", "SharedNotes" RESTART IDENTITY CASCADE;`);
    });

    afterEach(async () => {
       
    });

    test("POST /signup - should create a user", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({ email: "test@email.com", password: "test" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User registered successfully");
    });

    test("POST /login - should login a user", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@email.com", password: "test" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Successfully login");

        token = response.body.token;

        console.log(token);
    });

    test("POST /notes - should create a new note", async () => {
        const response = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "New Note", content: "This is a test note." });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Note created successfully");
    });

    test("GET /notes/:id - should retrieve a note", async () => {
        const note = await PrismaClient.note.create({ data: { title: "Test Note", content: "Content", user_id: 1 } });

        const response = await request(app)
            .get(`/api/notes/${note.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("title", "Test Note");
    });

    test("PUT /notes/:id - should update a note", async () => {
        const note = await PrismaClient.note.create({ data: { title: "Old Title", content: "Old Content", user_id: 1 } });

        const response = await request(app)
            .put(`/api/notes/${note.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Updated Title", content: "Updated Content" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Note updated successfully");
    });

    test("DELETE /notes/:id - should delete a note", async () => {
        const note = await PrismaClient.note.create({ data: { title: "Delete Me", content: "Content", user_id: 1 } });

        const response = await request(app)
            .delete(`/api/notes/${note.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Note deleted successfully");
    });

    test("GET /notes - should retrieve all notes", async () => {
        await PrismaClient.note.create({ data: { title: "Note 1", content: "Content 1", user_id: 1 } });
        await PrismaClient.note.create({ data: { title: "Note 2", content: "Content 2", user_id: 1 } });

        const response = await request(app)
            .get("/api/notes")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(2);
    });

    test("GET /notes/search?q=term - should search notes", async () => {
        await PrismaClient.note.create({ data: { title: "Searchable Note", content: "Content", user_id: 1 } });

        const response = await request(app)
            .get("/api/notes/search?q=Searchable")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toHaveProperty("title", "Searchable Note");
    });
});
       