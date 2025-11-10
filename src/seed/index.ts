import { randomUUID } from "crypto";
import "dotenv/config";
import * as schema from "../db/schema";
import db from "../lib/initDB";
import { createService } from "../repository/service";
import { createUser } from "../repository/user";

async function seed() {
  console.log("Seeding database...");

  console.log("Clearing existing data...");
  await db.delete(schema.appointmentServiceTable);
  await db.delete(schema.userTable);
  console.log("Data cleared.");

  // Create a couple of shop IDs to associate services with.
  const shopId1 = randomUUID();
  const shopId2 = randomUUID();

  // --- Create 10 Users ---
  console.log("Creating mock users...");
  for (let i = 1; i <= 10; i++) {
    try {
      await createUser({
        email: `user${i}@example.com`,
        // Password that meets the policy: 8+ chars, uppercase, lowercase, number, special char
        password: `Password${i}!`,
        name: `User ${i}`,
      });
      console.log(`- Created user ${i}`);
    } catch (error: any) {
      // Handle cases where user might already exist
      if (error.code === "23505") {
        // unique_violation
        console.log(`- User user${i}@example.com already exists, skipping.`);
      } else {
        console.error(`- Failed to create user ${i}:`, error.message);
      }
    }
  }

  // --- Create 10 Services ---
  console.log("\nCreating mock services...");
  const serviceNames = [
    "Classic Haircut",
    "Beard Trim & Shape",
    "Hot Towel Shave",
    "Hair Coloring",
    "Manicure",
    "Pedicure",
    "Relaxing Facial",
    "Deep Tissue Massage",
    "Swedish Massage",
    "Aromatherapy Session",
  ];

  for (let i = 0; i < 10; i++) {
    await createService({
      name: serviceNames[i],
      description: `A wonderful ${serviceNames[
        i
      ].toLowerCase()} experience provided by our top professionals.`,
      price: Math.floor(Math.random() * 100) + 20, // Price between 20 and 120
      showTime: [30, 45, 60, 90][Math.floor(Math.random() * 4)], // 30, 45, 60, or 90 minutes
      order: i + 1,
      shopId: i < 5 ? shopId1 : shopId2, // Assign first 5 to shop1, next 5 to shop2
    });
    console.log(`- Created service: ${serviceNames[i]}`);
  }

  console.log("\nSeeding complete!");
}

seed();
