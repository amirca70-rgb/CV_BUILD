"use client";

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { Sparkles, User, Briefcase, Copy, Check, Loader2, Languages, Rocket } from 'lucide-react';

export default function AIResumeApp() {
  const [formData, setFormData] = useState({ fullName: '', jobTitle: '' });
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && loading) {
      fetchSummary();
    }
    return () => clearInterval(interval);
  }, [loading, timer]);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      alert("Error generating content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
      {/* 🚀 Adsterra Social Bar Script */}
      <Script 
        src="https://lentattire.com/cf/de/f6/cfdef67649704ea0630a71981e572443.js" 
        strategy="afterInteractive" 
      />

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 font-black text-2xl text-blue-600">
          <Rocket className="fill-blue-600" /> <span>PRO.CV</span>
        </div>
        <button onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')} className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-50 transition">
          <Languages size={16} /> {lang === 'EN' ? 'العربية' : 'English'}
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3 text-slate-900 tracking-tight">
            {lang === 'EN' ? 'AI Resume Summary' : 'نبذة السيرة الذاتية بالذكاء الاصطناعي'}
          </h1>
          <p className="text-slate-500 font-medium italic">
            {lang === 'EN' ? 'Wait 5 seconds after clicking to support us!' : 'انتظر 5 ثوانٍ بعد الضغط لدعمنا بالاستمرار!'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-100/50 border border-white">
          <div className="space-y-4">
            <div className="relative">
              <User className={absolute ${lang === 'EN' ? 'left-4' : 'right-4'} top-4 text-slate-300} size={20} />
              <input 
                type="text" 
                placeholder={lang === 'EN' ? "Full Name" : "الاسم الكامل"} 
                className={w-full bg-slate-50 border-2 border-slate-50 p-4 ${lang === 'EN' ? 'pl-12' : 'pr-12'} rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="relative">
              <Briefcase className={absolute ${lang === 'EN' ? 'left-4' : 'right-4'} top-4 text-slate-300} size={20} />
              <input 
                type="text" 
                placeholder={lang === 'EN' ? "Job Title" : "المسمى الوظيفي"} 
                className={w-full bg-slate-50 border-2 border-slate-50 p-4 ${lang === 'EN' ? 'pl-12' : 'pr-12'} rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              />
            </div>
{/* AD AREA Placeholder */}
            <div className="py-4 border-y border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">Sponsored</p>
              <div className="h-20 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs italic">
                 {lang === 'EN' ? 'Ads support our free tools' : 'الإعلانات تدعم أدواتنا المجانية'}
              </div>
            </div>

            <button 
              disabled={loading}
              onClick={() => {setLoading(true); setTimer(5);}}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
            >
              {loading ? (
                <><Loader2 className="animate-spin" /> {timer > 0 ? ${timer}s... : 'Generating...'}</>
              ) : (
                <>{lang === 'EN' ? 'Generate Summary' : 'توليد النبذة'} <Sparkles size={20} /></>
              )}
            </button>
          </div>
        </div>

        {/* Result Area */}
        {summary && (
          <div className="mt-8 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">AI Result</span>
              </div>
              <button onClick={() => {navigator.clipboard.writeText(summary); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="text-slate-400 hover:text-white transition">
                {copied ? <Check size={22} className="text-green-400" /> : <Copy size={22} />}
              </button>
            </div>
            <p className="text-xl leading-relaxed font-medium text-slate-100">{summary}</p>
          </div>
        )}
      </main>
    </div>
  );
}
