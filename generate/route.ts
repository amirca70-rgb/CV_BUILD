import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fullName, jobTitle, lang } = await req.json();
    
    // Use the API Key from Environment Variables for security
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = lang === 'AR' 
      ? Write a professional resume summary for ${fullName} who is a ${jobTitle}. Use Arabic language, make it creative, and limit to 3 lines.
      : Write a professional resume summary for ${fullName} who is a ${jobTitle}. Use English language, make it impactful, and limit to 3 lines.;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ summary: response.text() });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
  }
}
