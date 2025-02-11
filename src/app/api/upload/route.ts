import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read the file as ArrayBuffer and convert it to Base64
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || "APIKEY"
    );
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
      `For context, you are a resume parser for a recruitment company who is trying to sell this candidate to the client. Extract the following details from this resume and return a JSON format, In the ProfileSummary, you can put a detailed summary of the candidate, In the WorkExperience Summary, put the description from the resume:
      {
        "Name": "",
        "DateOfBirth": "",
        "Age": "",
        "Gender": "",
        "Race": "",
        "Nationality": "",
        "Residency": "",
        "NoticePeriod": "",
        "Mobile": "",
        "Email": "",
        "ProfileSummary": "",
        "Education": [
          {
            "School": "",
            "Qualification": "",
            "Major": "",
            "From": "",
            "To": ""
          }
        ],
        "WorkExperience": [
          {
            "Company": "",
            "JobTitle": "",
            "Summary": [
              {
                "Description": ""
              }
            ],
            "LeavingReason": "",
            "From": "",
            "To": ""
          }
        ]
      }`,
    ]);

    const jsonResponse = result.response.text();
    const cleanJson = jsonResponse.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const parsedData = JSON.parse(cleanJson);
      // Just send the parsed data directly
      return NextResponse.json(parsedData);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error parsing resume:", error);
    return NextResponse.json(
      { error: "Error parsing resume" },
      { status: 500 }
    );
  }
}
