import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function getSession(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Get token from cookies

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    return { userId: decoded.id }; // Return user ID
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
