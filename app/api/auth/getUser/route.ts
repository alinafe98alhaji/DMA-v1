import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  
  // Parse cookies using a regex to get the token
  const token = cookieHeader
    ? cookieHeader.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    : undefined;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, name?: string };

    return NextResponse.json({ email: decoded.userId, name: decoded.name || "User" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
