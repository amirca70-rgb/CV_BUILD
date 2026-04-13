import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fullName, jobTitle, lang } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = lang === 'AR' 
      ? اكتب نبذة احترافية لسيرة ذاتية لـ ${fullName} بصفته ${jobTitle}. اجعلها قوية ومختصرة في 3 أسطر باللغة العربية.
      : Write a professional resume summary for ${fullName}, a ${jobTitle}. Make it impactful and concise in 3 lines.;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ summary: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
