import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { CustomError } from "../lib/error";
import db from "../lib/initDB";

/**
 * Creates a new account (seller or admin).
 * @param userData The data for the new account.
 * @returns The newly created account.
 */
export async function createUser(
  userData: schema.NewUser
): Promise<Omit<schema.User, "password">> {
  // In a real app, you would hash the password here.
  // For example, using bcrypt:
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const dataToInsert = { ...userData, password: hashedPassword };

  const [newUser] = await db
    .insert(schema.userTable)
    .values(dataToInsert)
    .returning();
  console.log("New user created:", newUser.id);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userInfo } = newUser;
  return userInfo;
}

/**
 * Retrieves a user by email and verifies the password.
 * @param email The user's email.
 * @param password The user's plain-text password.
 * @returns The user object without the password hash if credentials are valid.
 * @throws {CustomError} If the email is not found or the password does not match.
 */
export async function getUserByEmailAndPassword(
  email: string,
  password: string
): Promise<Omit<schema.User, "password">> {
  const [user] = await db
    .select()
    .from(schema.userTable)
    .where(eq(schema.userTable.email, email));

  console.log("email find");

  if (!user) {
    throw new CustomError("Invalid email or password", 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new CustomError("Invalid email or password", 404);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userInfo } = user;
  return userInfo;
}

export async function getUserById(
  userId: string
): Promise<Omit<schema.User, "password">> {
  const [user] = await db
    .select()
    .from(schema.userTable)
    .where(eq(schema.userTable.id, userId));

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userInfo } = user;
  return userInfo;
}
