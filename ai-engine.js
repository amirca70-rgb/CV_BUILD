/**
 * CVPro AI — AI Engine
 * Powered by Google Gemini 1.5 Flash (Free Tier)
 * https://aistudio.google.com/apikey
 */

const AIEngine = {

  // ✅ Gemini API endpoint الصحيح
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',

  // ← ضع مفتاحك الجديد هنا بعد إنشائه من aistudio.google.com/apikey
  API_KEY: 'AIzaSyDhQilYxLNkZkjgzUfKdtDtLVAIe1murbc',

  // ════════════════════════════════
  //  CORE CALL
  // ════════════════════════════════
  async call(prompt, systemPrompt = '', maxTokens = 800) {
    // دمج system prompt مع prompt لأن Gemini لا يدعم system منفصل
    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\n${prompt}`
      : prompt;

    let lastError;

    // إعادة المحاولة مرتين عند الفشل
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: {
              maxOutputTokens: maxTokens,
              temperature: 0.7
            }
          })
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      } catch (err) {
        lastError = err;
        // انتظر قبل إعادة المحاولة
        if (attempt === 0) await new Promise(r => setTimeout(r, 800));
      }
    }

    throw lastError;
  },

  // ════════════════════════════════
  //  GENERATE SUMMARY
  // ════════════════════════════════
  async generateSummary(userInput, standard, lang) {
    const langMap = { english: 'English', french: 'French', arabic: 'Arabic' };
    const stdMap = {
      europass: 'European (Europass)',
      canadian: 'Canadian',
      british: 'British',
      american: 'American'
    };

    const system = `You are a professional CV writer specializing in ${stdMap[standard] || 'international'} CV standards.
Write concise, impactful professional summaries in ${langMap[lang] || 'English'}.
Return ONLY the summary text, no labels or explanations. 3-4 sentences max.`;

    const prompt = `Write a professional CV summary for this person:
${userInput}

Standard: ${stdMap[standard]}
Language: ${langMap[lang]}

Make it ATS-friendly, impactful, and tailored to ${stdMap[standard]} standards.`;

    return await this.call(prompt, system, 300);
  },

  // ════════════════════════════════
  //  ENHANCE EXPERIENCE
  // ════════════════════════════════
  async enhanceExperience(title, company, rawDesc, standard, lang) {
    const system = `You are a professional CV writer. Transform raw job descriptions into polished, ATS-optimized bullet points.
Use strong action verbs and quantify achievements where possible. Return bullet points only, one per line, starting with •.
Language: ${lang === 'arabic' ? 'Arabic' : lang === 'french' ? 'French' : 'English'}.`;

    const prompt = `Job Title: ${title}
Company: ${company}
Raw description: ${rawDesc}

Standard: ${standard}

Rewrite as 3-5 professional bullet points. Use quantifiable results where possible.`;

    return await this.call(prompt, system, 400);
  },

  // ════════════════════════════════
  //  SUGGEST SKILLS
  // ════════════════════════════════
  async suggestSkills(jobTitle, experiences, standard) {
    const system = `You are a CV expert. Suggest relevant professional skills for a CV.
Return ONLY a JSON array of objects: [{"name": "Skill Name", "level": "Expert|Advanced|Intermediate|Basic"}]
No explanation, no markdown, just the raw JSON array.`;

    const prompt = `Job title: ${jobTitle}
Work experience: ${experiences}
CV Standard: ${standard}

Suggest 8-12 relevant skills (mix of technical and soft skills). Return as JSON array only.`;

    const response = await this.call(prompt, system, 400);
    try {
      const clean = response.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch {
      return [];
    }
  },

  // ════════════════════════════════
  //  CALCULATE ATS SCORE
  // ════════════════════════════════
  async calculateATS(cvData) {
    const system = `You are an ATS (Applicant Tracking System) expert. Analyze CVs and provide scores and actionable tips.
Return ONLY a raw JSON object (no markdown): {"score": number (0-100), "tips": ["tip1", "tip2", "tip3"]}`;

    const prompt = `Analyze this CV for ATS compatibility:
Name: ${cvData.firstName} ${cvData.lastName}
Title: ${cvData.jobTitle}
Summary: ${cvData.summary}
Experience entries: ${cvData.experiences?.length || 0}
Skills: ${cvData.skills?.map(s => s.name).join(', ') || 'none'}
Education: ${cvData.education?.length || 0} entries
Standard: ${cvData.standard}

Score from 0-100 and give 3 specific improvement tips. Return as JSON only.`;

    const response = await this.call(prompt, system, 300);
    try {
      const clean = response.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch {
      return { score: 65, tips: ['Add more keywords', 'Quantify achievements', 'Add more skills'] };
    }
  },

  // ════════════════════════════════
  //  IMPROVE SECTION
  // ════════════════════════════════
  async improveSection(instruction, cvData) {
    const system = `You are a professional CV consultant. You receive improvement instructions and current CV data.
Return ONLY the improved text for the requested section, no labels or explanations.`;

    const prompt = `Current CV data:
${JSON.stringify(cvData, null, 2)}

Improvement request: ${instruction}

Apply the improvement and return the improved text only.`;

    return await this.call(prompt, system, 500);
  }

};
