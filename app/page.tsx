"use client";

import React, { useState } from 'react';
import { Sparkles, User, Briefcase, Languages, Rocket } from 'lucide-react';

export default function HomePage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');

  const content = {
    EN: {
      title: "AI Resume Builder",
      subtitle: "Craft your future with AI-powered precision.",
      nameLabel: "Full Name",
      jobLabel: "Target Job Title",
      button: "Generate AI Summary",
      placeholderName: "e.g. Ghaith ...",
      placeholderJob: "e.g. Next.js Developer"
    },
    AR: {
      title: "منشئ السير الذاتية بالذكاء الاصطناعي",
      subtitle: "اصنع مستقبلك بدقة الذكاء الاصطناعي الاحترافية.",
      nameLabel: "الاسم الكامل",
      jobLabel: "المسمى الوظيفي المستهدف",
      button: "توليد نبذة احترافية",
      placeholderName: "مثال: غيث ...",
      placeholderJob: "مثال: مطور Next.js"
    }
  };

  const t = content[lang];

  return (
    <main className={min-h-screen bg-[#f8fafc] ${lang === 'AR' ? 'text-right' : 'text-left'}} dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      {/* Header / Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 font-black text-2xl text-blue-600">
          <Rocket size={28} />
          <span>CV.AI</span>
        </div>
        <button 
          onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')}
          className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition"
        >
          <Languages size={18} />
          {lang === 'EN' ? 'العربية' : 'English'}
        </button>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          {t.title}
        </h1>
        <p className="text-xl text-slate-600 mb-12">
          {t.subtitle}
        </p>

        {/* Form Card */}
        <div className="bg-white shadow-2xl shadow-blue-100 rounded-3xl p-8 md:p-12 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Input Name */}
            <div className={space-y-2 ${lang === 'AR' ? 'text-right' : ''}}>
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 justify-end md:justify-start">
                <User size={16} /> {t.nameLabel}
              </label>
              <input 
                type="text" 
                placeholder={t.placeholderName}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>

            {/* Input Job */}
            <div className={space-y-2 ${lang === 'AR' ? 'text-right' : ''}}>
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 justify-end md:justify-start">
                <Briefcase size={16} /> {t.jobLabel}
              </label>
              <input 
                type="text" 
                placeholder={t.placeholderJob}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-lg shadow-blue-200 transition-all active:scale-95">
            {t.button}
            <Sparkles size={22} />
          </button>
        </div>

        {/* Ad Placeholder (مكان إعلان أدستيرا) */}
        <div className="mt-12 p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
          ADVERTISEMENT AREA
        </div>
      </div>
    </main>
  );
}
