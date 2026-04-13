<div className="relative">
              <Briefcase className="absolute left-4 top-4 text-slate-300" size={20} />
              <input 
                type="text"
                placeholder={lang === 'EN' ? "Target Job Title" : "المسمى الوظيفي"}
                className={w-full bg-slate-50 border-2 border-slate-50 p-4 ${lang === 'EN' ? 'pl-12' : 'pr-12'} rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              />
            </div>

            {/* ADSTERRA NATIVE PLACEHOLDER */}
            <div className="py-4 border-y border-slate-100 flex flex-col items-center">
               <span className="text-[9px] text-slate-300 font-bold uppercase mb-2">Sponsored Content</span>
               <div className="w-full h-24 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-xs italic text-center px-4">
                  Adsterra Banner will load here...
               </div>
            </div>

            <button 
              disabled={loading}
              onClick={startGeneration}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="animate-spin" size={18} /> 
                  {lang === 'EN' ? Generating in ${timer}s... : جاري التوليد خلال ${timer} ثواني...}
                </span>
              ) : (
                <> {lang === 'EN' ? 'Generate Summary' : 'توليد النبذة'} <Sparkles size={18} /> </>
              )}
            </button>
          </div>
        </div>

        {/* Result Area */}
        {summary && (
          <div className="mt-8 bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/30">
                AI Generated Result
              </span>
              <button onClick={copyToClipboard} className="text-slate-400 hover:text-white transition">
                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
              </button>
            </div>
            <p className="text-lg leading-relaxed font-medium text-slate-200">
              {summary}
            </p>
          </div>
        )}
      </main>

      {/* Social Bar Script (Adsterra) */}
      <script async src="https://pl29138792.profitablecpmratenetwork.com/cf/de/f6/cfdef67649704ea0630a71981e572443.js"></script>
    </div>
  );
}
