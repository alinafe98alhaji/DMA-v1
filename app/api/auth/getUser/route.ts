import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  console.log("Cookie Header:", cookieHeader); // Debugging

  const token = cookieHeader?.split("token=")[1]?.split(";")[0];
  console.log("Extracted Token:", token); // Debugging

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; name?: string };
    console.log("Decoded User:", decoded); // Debugging

    return NextResponse.json({ email: decoded.email, name: decoded.name || "User" });
  } catch (error) {
    console.error("JWT Verification Error:", error); // Debugging
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
