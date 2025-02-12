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
      `For context, you are a resume parser for a recruitment company who is trying to sell this candidate to the client. 
      Extract the following details from this resume and return a JSON format. 

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
        "Languages": "",
        "Skills": "",
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
      }
      
      In the ProfileSummary, you can put a detailed summary of the candidate. 
      In the WorkExperience Summary, put the description line by line from the resume so that I can render it in point form on the frontend.
      Any extra carricular activities, sports, leadership positions, achievements can be put in the work experience section in case of cases like a student.
      Be as accurate as possible and do not change the meaning of text in the resume.
      Residency can wither be Citizen, Permanent Resident, Work Permit, S Pass, Employment Pass, Long Term Visit Pass, Student Pass, Dependent Pass.
      If the resume does not state the the residency, there is no need to populate the field.
      
      `,
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
