import request from "supertest";
import { randomUUID } from "crypto";
import app from "../index"; // Assuming your express app is exported from index.ts
import db, { client } from "../lib/initDB";
import * as schema from "../db/schema";

describe("User Authentication Flow", () => {
  // Clean up the database before running tests
  beforeAll(async () => {
    await db.delete(schema.appointmentServiceTable);
    await db.delete(schema.userTable);
  });

  // Close the database connection after all tests are done
  afterAll(async () => {
    await client.end();
  });

  const userCredentials = {
    email: `test-${randomUUID()}@example.com`,
    // This password meets the validation policy
    password: "Password123!",
    name: "Test User",
  };

  let authToken = "";

  it("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/user/register")
      .send(userCredentials);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userCredentials.email);
    expect(response.body.data.token).toBeDefined();
  });

  it("should log in the user and return a token", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: userCredentials.email,
      password: userCredentials.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userCredentials.email);
    expect(response.body.data.token).toBeDefined();

    // Save the token for the next test
    authToken = response.body.data.token;
  });

  it("should fail to get user profile without a token", async () => {
    const response = await request(app).get("/api/user/me");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should get the user profile with a valid token", async () => {
    const response = await request(app)
      .get("/api/user/me")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(userCredentials.email);
    expect(response.body.data.name).toBe(userCredentials.name);
    expect(response.body.data.password).toBeUndefined();
  });
});
