// api/generate.js
// هذا الملف يعمل على سيرفر Vercel — المفتاح مخفي تماماً عن المستخدمين

export default async function handler(req, res) {
  // السماح بـ CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, maxTokens = 600 } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // ── حد الاستخدام (Rate Limiting بسيط) ──
    // يمكنك لاحقاً استبداله بـ database حقيقية
    // حالياً نعتمد على client-side tracking

    // المفتاح مخفي في Environment Variables في Vercel
    const GEMINI_KEY = process.env.AIzaSyDhQilYxLNkZkjgzUfKdtDtLVAIe1murbc;

    if (!GEMINI_KEY) {
      return res.status(500).json({ error: 'Server not configured' });
    }

    // جرب النماذج بالترتيب
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'];
    let result = null;
    let lastError = '';

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          lastError = data.error?.message || 'Model error';
          continue;
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) { result = text; break; }

      } catch (e) {
        lastError = e.message;
        continue;
      }
    }

    if (!result) {
      return res.status(500).json({ error: lastError || 'AI generation failed' });
    }

    return res.status(200).json({ result });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
