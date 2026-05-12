import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { users } from "../modules/auth/user.schema.js";

const username = process.env.ADMIN_USER;
const password = process.env.ADMIN_PASSWORD;

async function createAdmin() {
  if (!username || !password) {
    console.error("❌ Define ADMIN_USER y ADMIN_PASSWORD en .env");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({ username, password: hash })
    .returning();

  console.log("✅ Admin creado:", user.username);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});