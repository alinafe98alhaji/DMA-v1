// import { NextResponse } from "next/server";
// import clientPromise from "../../lib/mongodb";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const { userId, questionID, responses } = body;

//     // Validate the request body
//     if (!userId || !questionID || !responses) {
//       return NextResponse.json(
//         {
//           error:
//             "Invalid request body. 'userId', 'questionID', and 'responses' are required."
//         },
//         { status: 400 }
//       );
//     }

//     // Wait for the MongoDB client promise to resolve
//     const client = await clientPromise;

//     // Check if the client is undefined (connection failed)
//     if (!client) {
//       return NextResponse.json(
//         { error: "Failed to connect to the database" },
//         { status: 500 }
//       );
//     }

//     const db = client.db("test");

//     // Insert the data into the "data quality" collection
//     const result = await db.collection("data quality").insertOne({
//       userId,
//       questionID,
//       responses,
//       submittedAt: new Date()
//     });

//     return NextResponse.json(
//       { message: "Data saved successfully", result },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error saving responses:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

//--------------
//--------------
//--------------

import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userId, questionID, responses, completionId } = body;

    // Validate the request body
    if (!userId || !questionID || !responses || !completionId) {
      return NextResponse.json(
        {
          error:
            "Invalid request body. 'userId', 'questionID', 'responses', and 'completionId' are required."
        },
        { status: 400 }
      );
    }

    // Wait for the client promise to resolve
    const client = await clientPromise;

    // Ensure client is defined before accessing the db
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    }

    const db = client.db("test");

    // Insert the data into the "data quality" collection, including completionId
    const result = await db.collection("data quality").insertOne({
      userId,
      questionID,
      responses,
      completionId, // Include the completionId in the database
      submittedAt: new Date()
    });

    return NextResponse.json(
      { message: "Data saved successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
