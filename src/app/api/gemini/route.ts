import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt)
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      text:
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI",
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
