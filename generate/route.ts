import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fullName, jobTitle, lang } = await req.json();

    // نستخدم المفتاح من متغيرات البيئة وليس كتابةً
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = lang === 'AR' 
      ? أنت خبير في الموارد البشرية. قم بكتابة نبذة احترافية (About Me) لسيرة ذاتية:
         الاسم: ${fullName}
         الوظيفة: ${jobTitle}
         اجعل الأسلوب جذاباً، قوياً، ومختصراً في 3 أسطر.
      : You are an expert HR Manager. Write a powerful "About Me" summary for:
         Name: ${fullName}
         Job: ${jobTitle}
         Make it professional and impactful in 3 lines.;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ summary: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "API Key issue or Network error" }, { status: 500 });
  }
}
