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
      `Extract the following details from this resume and return a JSON format:
      {
        "Name": "",
        "Date of Birth": "",
        "Age": "",
        "Gender": "",
        "Race": "",
        "Nationality": "",
        "Residency": "",
        "Notice Period": "",
        "Mobile": "",
        "Email": "",
        "Education": [
          {
            "School": "",
            "Qualification": "",
            "Major / Department": "",
            "From": "",
            "To": ""
          }
        ],
        "Work Experience": [
          {
            "Company": "",
            "Job Title": "",
            "Summary": [
              {
                "Description": ""
              }
            ],
            "Reason for Leaving": "",
            "From": "",
            "To": ""
          }
        ]
      }`,
    ]);

    const jsonResponse = result.response.text();
    return NextResponse.json({ data: jsonResponse });
  } catch (error) {
    console.error("Error parsing resume:", error);
    return NextResponse.json(
      { error: "Error parsing resume" },
      { status: 500 }
    );
  }
}
