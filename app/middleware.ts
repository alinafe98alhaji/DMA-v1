import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "./lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if not authenticated
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    
    // Connect to DB and check if user completed assessment
    const client = await clientPromise;
    if (!client) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: decoded.email });

    if (user?.hasCompletedAssessment) {
      return NextResponse.redirect(new URL("/results", req.url)); // Redirect if assessment is done
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/survey/:path*", "/nationallevel/:path*"], // Protect assessment routes
};
