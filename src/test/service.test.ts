import request from "supertest";
import { randomUUID } from "crypto";
import app from "../index";
import db, { client } from "../lib/initDB";
import * as schema from "../db/schema";

describe("Service CRUD Flow", () => {
  let authToken = "";
  let serviceId = "";
  const shopId = randomUUID();

  // Before all tests, clear tables and create/login a user to get a token
  beforeAll(async () => {
    await db.delete(schema.appointmentServiceTable);
    await db.delete(schema.userTable);

    const userCredentials = {
      email: `service-test-${randomUUID()}@example.com`,
      password: "Password123!",
      name: "Service Tester",
    };

    // Register user
    await request(app).post("/api/user/register").send(userCredentials);

    // Login to get token
    const loginResponse = await request(app).post("/api/user/login").send({
      email: userCredentials.email,
      password: userCredentials.password,
    });

    authToken = loginResponse.body.data.token;
  });

  // Close the database connection after all tests are done
  afterAll(async () => {
    await client.end();
  });

  const servicePayload = {
    name: "Test Haircut",
    description: "A test haircut service.",
    price: 50,
    showTime: 45,
    shopId: shopId,
  };

  it("should create a new service successfully", async () => {
    const response = await request(app)
      .post("/api/service")
      .set("Authorization", `Bearer ${authToken}`)
      .send(servicePayload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(servicePayload.name);
    expect(response.body.data.price).toBe(servicePayload.price);
    expect(response.body.data.id).toBeDefined();

    // Save the ID for the next tests
    serviceId = response.body.data.id;
  });

  it("should get the newly created service by ID", async () => {
    const response = await request(app).get(`/api/service/${serviceId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(serviceId);
    expect(response.body.data.name).toBe(servicePayload.name);
  });

  it("should delete the service (soft delete)", async () => {
    const response = await request(app)
      .delete(`/api/service/${serviceId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(serviceId);
    // The repository returns the updated record, which should now be marked as removed
    expect(response.body.data.isRemove).toBe(true);
  });

  it("should return 404 when trying to get the deleted service", async () => {
    const response = await request(app).get(`/api/service/${serviceId}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Service not found");
  });
});
