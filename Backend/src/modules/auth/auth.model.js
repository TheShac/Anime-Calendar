import { db } from "../../config/db.js";
import { users } from "./user.schema.js";
import { eq } from "drizzle-orm";

export async function findUserByUsername(username) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return user;
}