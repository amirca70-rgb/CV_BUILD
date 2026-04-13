/**
 * CVPro AI — Builder Logic
 * Full CV builder with AI integration
 */

// ─── STATE ───────────────────────────────────────────────────────────────────
const state = {
  currentStep: 1,
  standard: '',
  lang: 'english',
  personal: {},
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  accentColor: '#1a3a5c',
  zoom: 1
};

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initStep1();
  initStep2();
  initStep3();
  initStep4();
  loadDraft();
});

// ─── STEP 1: Standard & Language ─────────────────────────────────────────────
function initStep1() {
  const standardOptions = document.querySelectorAll('.standard-option');
  const goStep2Btn = document.getElementById('goStep2');

  standardOptions.forEach(opt => {
    const input = opt.querySelector('input');
    input.addEventListener('change', () => {
      state.standard = input.value;
      goStep2Btn.disabled = false;
      // Toggle languages section for Europass
      const langSection = document.getElementById('languagesSection');
      if (langSection) {
        langSection.style.display = state.standard === 'europass' ? 'block' : 'none';
      }
    });
  });

  document.querySelectorAll('input[name="cvlang"]').forEach(inp => {
    inp.addEventListener('change', () => { state.lang = inp.value; });
  });

  goStep2Btn.addEventListener('click', () => goToStep(2));
}

// ─── STEP 2: Personal Info ────────────────────────────────────────────────────
function initStep2() {
  // AI Summary
  const generateBtn = document.getElementById('generateSummary');
  const regenerateBtn = document.getElementById('regenerateSummary');

  generateBtn?.addEventListener('click', generateSummary);
  regenerateBtn?.addEventListener('click', generateSummary);
}

async function generateSummary() {
  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput) { showToast('⚠ أدخل وصفاً لنفسك أولاً'); return; }

  const btn = document.getElementById('generateSummary');
  const btnText = btn.querySelector('.btn-text');
  const btnLoading = btn.querySelector('.btn-loading');

  btn.classList.add('loading');
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';

  try {
    const result = await AIEngine.generateSummary(userInput, state.standard, state.lang);
    state.summary = result;

    const resultDiv = document.getElementById('summaryResult');
    const textDiv = document.getElementById('summaryText');
    resultDiv.style.display = 'block';
    textDiv.textContent = '';

    // Typing animation
    await typeText(textDiv, result);
    showToast('✓ تم توليد الملخص بنجاح');
  } catch (e) {
    if (e.message !== 'API key required') {
      showToast('⚠ خطأ: ' + e.message);
    }
  } finally {
    btn.classList.remove('loading');
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
}

// ─── STEP 3: Experience, Education, Skills ───────────────────────────────────
function initStep3() {
  document.getElementById('addExp').addEventListener('click', () => openModal('expModal'));
  document.getElementById('addEdu').addEventListener('click', () => openModal('eduModal'));
  document.getElementById('addSkill').addEventListener('click', addSkillPrompt);
  document.getElementById('addLang').addEventListener('click', addLanguagePrompt);
  document.getElementById('suggestSkills').addEventListener('click', suggestSkills);
  document.getElementById('saveExp').addEventListener('click', saveExperience);
  document.getElementById('saveEdu').addEventListener('click', saveEducation);
  document.getElementById('enhanceExp').addEventListener('click', enhanceExperience);

  // Languages section visibility
  const langSection = document.getElementById('languagesSection');
  if (langSection) langSection.style.display = state.standard === 'europass' ? 'block' : 'none';
}

function saveExperience() {
  const title = document.getElementById('expTitle').value.trim();
  const company = document.getElementById('expCompany').value.trim();
  const start = document.getElementById('expStart').value;
  const end = document.getElementById('expCurrent').checked ? 'Present' : document.getElementById('expEnd').value;
  const desc = document.getElementById('expEnhanced').textContent.trim()
    || document.getElementById('expDesc').value.trim();

  if (!title || !company) { showToast('⚠ أدخل المسمى الوظيفي والشركة'); return; }

  const exp = { id: Date.now(), title, company, start, end, desc };
  state.experiences.push(exp);
  renderExperiences();
  closeModal('expModal');
  clearExpForm();
  showToast('✓ تمت إضافة الخبرة');
}

function renderExperiences() {
  const list = document.getElementById('expList');
  list.innerHTML = state.experiences.map(exp => `
    <div class="item-card" data-id="${exp.id}">
      <div class="item-card-content">
        <div class="item-card-title">${exp.title}</div>
        <div class="item-card-sub">${exp.company} · ${formatDate(exp.start)} – ${formatDate(exp.end)}</div>
        <div class="item-card-desc">${exp.desc?.replace(/\n/g, '<br>') || ''}</div>
      </div>
      <div class="item-card-actions">
        <button class="item-action-btn delete" onclick="deleteExp(${exp.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

function deleteExp(id) {
  state.experiences = state.experiences.filter(e => e.id !== id);
  renderExperiences();
}

async function enhanceExperience() {
  const title = document.getElementById('expTitle').value.trim();
  const company = document.getElementById('expCompany').value.trim();
  const desc = document.getElementById('expDesc').value.trim();

  if (!desc) { showToast('⚠ أدخل وصف المهام أولاً'); return; }

  const btn = document.getElementById('enhanceExp');
  btn.textContent = '⏳ جاري الصياغة...';
  btn.disabled = true;

  try {
    const enhanced = await AIEngine.enhanceExperience(title, company, desc, state.standard, state.lang);
    const enhancedDiv = document.getElementById('expEnhanced');
    enhancedDiv.style.display = 'block';
    enhancedDiv.textContent = '';
    await typeText(enhancedDiv, enhanced);
    showToast('✓ تمت الصياغة الاحترافية');
  } catch (e) {
    if (e.message !== 'API key required') showToast('⚠ ' + e.message);
  } finally {
    btn.textContent = '⚡ صياغة احترافية بالـ AI';
    btn.disabled = false;
  }
}

function saveEducation() {
  const degree = document.getElementById('eduDegree').value.trim();
  const institution = document.getElementById('eduInstitution').value.trim();
  const country = document.getElementById('eduCountry').value.trim();
  const start = document.getElementById('eduStart').value;
  const end = document.getElementById('eduEnd').value;
  const grade = document.getElementById('eduGrade').value.trim();

  if (!degree || !institution) { showToast('⚠ أدخل الشهادة والمؤسسة'); return; }

  const edu = { id: Date.now(), degree, institution, country, start, end, grade };
  state.education.push(edu);
  renderEducation();
  closeModal('eduModal');
  clearEduForm();
  showToast('✓ تمت إضافة الشهادة');
}

function renderEducation() {
  const list = document.getElementById('eduList');
  list.innerHTML = state.education.map(edu => `
    <div class="item-card" data-id="${edu.id}">
      <div class="item-card-content">
        <div class="item-card-title">${edu.degree}</div>
        <div class="item-card-sub">${edu.institution}${edu.country ? ' · ' + edu.country : ''} · ${edu.start || ''}–${edu.end || ''}</div>
        ${edu.grade ? `<div class="item-card-desc">${edu.grade}</div>` : ''}
      </div>
      <div class="item-card-actions">
        <button class="item-action-btn delete" onclick="deleteEdu(${edu.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

function deleteEdu(id) {
  state.education = state.education.filter(e => e.id !== id);
  renderEducation();
}

function addSkillPrompt() {
  const name = prompt('اسم المهارة (بالإنجليزية):');
  if (!name) return;
  const levelAr = prompt('مستوى المهارة:\n1. خبير (Expert)\n2. متقدم (Advanced)\n3. متوسط (Intermediate)\n4. مبتدئ (Basic)', '2');
  const levels = { '1': 'Expert', '2': 'Advanced', '3': 'Intermediate', '4': 'Basic' };
  const level = levels[levelAr] || 'Advanced';
  addSkill(name, level);
}

function addSkill(name, level = 'Advanced') {
  const skill = { id: Date.now(), name, level };
  state.skills.push(skill);
  renderSkills();
}

function renderSkills() {
  const grid = document.getElementById('skillList');
  grid.innerHTML = state.skills.map(skill => `
    <div class="skill-tag">
      <span>${skill.name}</span>
      <span class="skill-level">${skill.level}</span>
      <button class="remove-skill" onclick="removeSkill(${skill.id})">×</button>
    </div>
  `).join('');
}

function removeSkill(id) {
  state.skills = state.skills.filter(s => s.id !== id);
  renderSkills();
}

async function suggestSkills() {
  const jobTitle = document.getElementById('jobTitle').value || state.personal.jobTitle || '';
  const expText = state.experiences.map(e => `${e.title} at ${e.company}`).join(', ');

  const btn = document.getElementById('suggestSkills');
  btn.textContent = '⏳ جاري التحليل...';
  btn.disabled = true;

  try {
    const suggested = await AIEngine.suggestSkills(jobTitle, expText, state.standard);
    const container = document.getElementById('skillSuggestions');
    container.style.display = 'flex';
    container.innerHTML = suggested.map(s => `
      <button class="suggested-skill" onclick="addSkill('${s.name}', '${s.level}'); this.remove()">
        + ${s.name} <small>(${s.level})</small>
      </button>
    `).join('');
    showToast('✓ تم اقتراح ' + suggested.length + ' مهارة');
  } catch (e) {
    if (e.message !== 'API key required') showToast('⚠ ' + e.message);
  } finally {
    btn.textContent = '⚡ اقتراح مهارات بالـ AI';
    btn.disabled = false;
  }
}

function addLanguagePrompt() {
  const lang = prompt('اسم اللغة:');
  if (!lang) return;
  const level = prompt('المستوى (A1/A2/B1/B2/C1/C2/Native):', 'B2');
  if (!level) return;
  const langItem = { id: Date.now(), language: lang, level };
  state.languages.push(langItem);
  renderLanguages();
}

function renderLanguages() {
  const list = document.getElementById('langList');
  list.innerHTML = state.languages.map(l => `
    <div class="item-card">
      <div class="item-card-content">
        <div class="item-card-title">${l.language}</div>
        <div class="item-card-sub">CEFR Level: ${l.level}</div>
      </div>
      <div class="item-card-actions">
        <button class="item-action-btn delete" onclick="deleteLang(${l.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

function deleteLang(id) {
  state.languages = state.languages.filter(l => l.id !== id);
  renderLanguages();
}

// ─── STEP 4: Preview & Export ─────────────────────────────────────────────────
function initStep4() {
  // Color presets
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.accentColor = btn.dataset.color;
      renderCV();
    });
  });

  // Zoom
  document.getElementById('zoomIn').addEventListener('click', () => {
    state.zoom = Math.min(state.zoom + 0.1, 1.5);
    applyZoom();
  });
  document.getElementById('zoomOut').addEventListener('click', () => {
    state.zoom = Math.max(state.zoom - 0.1, 0.5);
    applyZoom();
  });

  // ATS Score
  document.getElementById('calcATS').addEventListener('click', calcATSScore);

  // Improve
  document.getElementById('improveBtn').addEventListener('click', improveCV);

  // Export PDF
  document.getElementById('exportPDF').addEventListener('click', exportPDF);

  // Copy Text
  document.getElementById('copyText').addEventListener('click', copyText);
}

function collectPersonalData() {
  return {
    firstName: document.getElementById('firstName')?.value || '',
    lastName: document.getElementById('lastName')?.value || '',
    jobTitle: document.getElementById('jobTitle')?.value || '',
    email: document.getElementById('email')?.value || '',
    phone: document.getElementById('phone')?.value || '',
    location: document.getElementById('location')?.value || '',
    linkedin: document.getElementById('linkedin')?.value || '',
    website: document.getElementById('website')?.value || '',
    summary: document.getElementById('summaryText')?.textContent || state.summary || ''
  };
}

function renderCV() {
  const personal = collectPersonalData();
  const preview = document.getElementById('cvPreview');
  preview.className = 'cv-preview';

  if (state.standard === 'europass' || state.standard === 'british') {
    preview.innerHTML = buildEuropassTemplate(personal);
    preview.classList.add('cv-europass');
  } else {
    preview.innerHTML = buildCanadianTemplate(personal);
    preview.classList.add('cv-canadian');
  }

  applyZoom();
}

function buildEuropassTemplate(p) {
  const color = state.accentColor;
  const initials = `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();

  return `
    <div class="cv-top" style="background:${color}">
      <div class="cv-avatar">${initials}</div>
      <div style="flex:1">
        <div class="cv-name">${p.firstName} ${p.lastName}</div>
        <div class="cv-jobtitle">${p.jobTitle}</div>
        <div class="cv-contact-row">
          ${p.email ? `<span>✉ ${p.email}</span>` : ''}
          ${p.phone ? `<span>📞 ${p.phone}</span>` : ''}
          ${p.location ? `<span>📍 ${p.location}</span>` : ''}
          ${p.linkedin ? `<span>🔗 ${p.linkedin}</span>` : ''}
        </div>
      </div>
    </div>
    <div class="cv-body">
      <div class="cv-sidebar">
        ${state.skills.length ? `
          <div class="cv-section-title" style="color:${color}; border-color:${color}">SKILLS</div>
          ${state.skills.map(s => `
            <div class="skill-item">
              <span>${s.name}</span>
              <div class="skill-bar-mini"><div class="skill-bar-fill" style="width:${levelToPercent(s.level)}%; background:${color}"></div></div>
            </div>
          `).join('')}
        ` : ''}
        ${state.languages.length ? `
          <div class="cv-section-title" style="color:${color}; border-color:${color}; margin-top:16px">LANGUAGES</div>
          ${state.languages.map(l => `
            <div class="skill-item"><span>${l.language}</span><span style="font-size:10px;color:#666">${l.level}</span></div>
          `).join('')}
        ` : ''}
      </div>
      <div class="cv-main">
        ${p.summary ? `
          <div class="cv-section-title" style="color:${color}; border-color:${color}">PROFESSIONAL SUMMARY</div>
          <p style="font-size:11px;color:#333;line-height:1.7;margin-bottom:16px">${p.summary}</p>
        ` : ''}
        ${state.experiences.length ? `
          <div class="cv-section-title" style="color:${color}; border-color:${color}">WORK EXPERIENCE</div>
          ${state.experiences.map(exp => `
            <div class="cv-exp-item">
              <div class="cv-exp-title">${exp.title}</div>
              <div class="cv-exp-company" style="color:${color}">${exp.company}</div>
              <div class="cv-exp-date">${formatDate(exp.start)} – ${formatDate(exp.end)}</div>
              <div class="cv-exp-desc">${(exp.desc || '').replace(/\n/g, '<br>')}</div>
            </div>
          `).join('')}
        ` : ''}
        ${state.education.length ? `
          <div class="cv-section-title" style="color:${color}; border-color:${color}; margin-top:16px">EDUCATION</div>
          ${state.education.map(edu => `
            <div class="cv-exp-item">
              <div class="cv-exp-title">${edu.degree}</div>
              <div class="cv-exp-company" style="color:${color}">${edu.institution}${edu.country ? ', ' + edu.country : ''}</div>
              <div class="cv-exp-date">${edu.start || ''}${edu.end ? ' – ' + edu.end : ''}</div>
              ${edu.grade ? `<div class="cv-exp-desc">${edu.grade}</div>` : ''}
            </div>
          `).join('')}
        ` : ''}
      </div>
    </div>
  `;
}

function buildCanadianTemplate(p) {
  const color = state.accentColor;

  return `
    <div style="padding:40px">
      <div class="cv-name" style="color:${color}">${p.firstName} ${p.lastName}</div>
      <div class="cv-jobtitle">${p.jobTitle}</div>
      <div class="cv-contact-row" style="border-color:${color}">
        ${p.email ? `<span>✉ ${p.email}</span>` : ''}
        ${p.phone ? `<span>📞 ${p.phone}</span>` : ''}
        ${p.location ? `<span>📍 ${p.location}</span>` : ''}
        ${p.linkedin ? `<span>🔗 ${p.linkedin}</span>` : ''}
      </div>

      ${p.summary ? `
        <div class="cv-section-title" style="color:${color}; border-color:${color}">PROFESSIONAL SUMMARY</div>
        <div class="cv-summary" style="margin-bottom:16px">${p.summary}</div>
      ` : ''}

      ${state.experiences.length ? `
        <div class="cv-section-title" style="color:${color}; border-color:${color}">WORK EXPERIENCE</div>
        ${state.experiences.map(exp => `
          <div class="cv-exp-item">
            <div class="cv-exp-header">
              <span class="cv-exp-title">${exp.title}</span>
              <span class="cv-exp-date">${formatDate(exp.start)} – ${formatDate(exp.end)}</span>
            </div>
            <div class="cv-exp-company">${exp.company}</div>
            <div class="cv-exp-desc">${(exp.desc || '').replace(/\n/g, '<br>')}</div>
          </div>
        `).join('')}
      ` : ''}

      ${state.education.length ? `
        <div class="cv-section-title" style="color:${color}; border-color:${color}">EDUCATION</div>
        ${state.education.map(edu => `
          <div class="cv-exp-item">
            <div class="cv-exp-header">
              <span class="cv-exp-title">${edu.degree}</span>
              <span class="cv-exp-date">${edu.start || ''}${edu.end ? ' – ' + edu.end : ''}</span>
            </div>
            <div class="cv-exp-company">${edu.institution}${edu.country ? ', ' + edu.country : ''}</div>
            ${edu.grade ? `<div class="cv-exp-desc">${edu.grade}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${state.skills.length ? `
        <div class="cv-section-title" style="color:${color}; border-color:${color}">SKILLS</div>
        <div class="skills-wrap">
          ${state.skills.map(s => `<span class="skill-chip" style="background:#eef2f7;color:${color}">${s.name}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

async function calcATSScore() {
  const personal = collectPersonalData();
  const cvData = { ...personal, ...state, standard: state.standard };

  const btn = document.getElementById('calcATS');
  btn.textContent = '⏳ جاري التحليل...';
  btn.disabled = true;

  try {
    const result = await AIEngine.calculateATS(cvData);
    const score = result.score || 0;
    document.getElementById('scoreNum').textContent = score;
    document.getElementById('scoreTips').innerHTML = (result.tips || [])
      .map(t => `<div>• ${t}</div>`).join('');

    // Update circle
    const circle = document.querySelector('.score-circle');
    const pct = (score / 100) * 360;
    circle.style.background = `conic-gradient(${score > 70 ? '#4CAF50' : score > 50 ? '#FF9800' : '#f44336'} ${pct}deg, rgba(255,255,255,0.1) 0deg)`;
    showToast(`✓ ATS Score: ${score}/100`);
  } catch (e) {
    if (e.message !== 'API key required') showToast('⚠ ' + e.message);
  } finally {
    btn.textContent = 'حساب ATS Score ⚡';
    btn.disabled = false;
  }
}

async function improveCV() {
  const instruction = document.getElementById('improveInput').value.trim();
  if (!instruction) { showToast('⚠ اكتب تعليمات التحسين أولاً'); return; }

  const btn = document.getElementById('improveBtn');
  btn.textContent = '⏳ جاري التحسين...';
  btn.disabled = true;

  try {
    const personal = collectPersonalData();
    const cvData = { ...personal, experiences: state.experiences, skills: state.skills };
    const improved = await AIEngine.improveSection(instruction, cvData);
    // Show result
    showToast('✓ تم التحسين — طبّق التغييرات يدوياً في الخطوة 2 و 3');
    document.getElementById('improveInput').value = improved;
  } catch (e) {
    if (e.message !== 'API key required') showToast('⚠ ' + e.message);
  } finally {
    btn.textContent = '⚡ تطبيق التحسين';
    btn.disabled = false;
  }
}

function exportPDF() {
  const element = document.getElementById('cvPreview');
  const personal = collectPersonalData();
  const filename = `${personal.firstName}_${personal.lastName}_CV.pdf`;

  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
  };

  showToast('⏳ جاري تصدير PDF...');
  html2pdf().set(opt).from(element).save().then(() => {
    showToast('✓ تم تصدير PDF بنجاح!');
  });
}

function copyText() {
  const preview = document.getElementById('cvPreview');
  const text = preview.innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('✓ تم نسخ النص');
  });
}

function applyZoom() {
  const preview = document.getElementById('cvPreview');
  preview.style.transform = `scale(${state.zoom})`;
  preview.style.transformOrigin = 'top center';
  document.getElementById('zoomLevel').textContent = Math.round(state.zoom * 100) + '%';
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function goToStep(step) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');

  document.querySelectorAll('.hstep').forEach(h => {
    const n = parseInt(h.dataset.step);
    h.classList.remove('active', 'completed');
    if (n === step) h.classList.add('active');
    else if (n < step) h.classList.add('completed');
  });

  state.currentStep = step;

  if (step === 4) {
    renderCV();
    document.getElementById('exportBtn').style.display = 'inline-flex';
    initStep4();
  }

  window.scrollTo(0, 0);
}

// ─── MODALS ────────────────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatDate(val) {
  if (!val) return '';
  if (val === 'Present') return 'Present';
  if (val.includes('-')) {
    const [y, m] = val.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m)-1]} ${y}`;
  }
  return val;
}

function levelToPercent(level) {
  const map = { Expert: 100, Advanced: 80, Intermediate: 60, Basic: 40 };
  return map[level] || 60;
}

async function typeText(element, text) {
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (i % 5 === 0) await sleep(10);
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function clearExpForm() {
  ['expTitle','expCompany','expStart','expEnd','expDesc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('expCurrent').checked = false;
  document.getElementById('expEnhanced').style.display = 'none';
  document.getElementById('expEnhanced').textContent = '';
}

function clearEduForm() {
  ['eduDegree','eduInstitution','eduCountry','eduStart','eduEnd','eduGrade'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ─── DRAFT SAVE/LOAD ───────────────────────────────────────────────────────────
document.getElementById('saveDraft')?.addEventListener('click', saveDraft);

function saveDraft() {
  const personal = collectPersonalData();
  const draft = {
    standard: state.standard,
    lang: state.lang,
    personal,
    experiences: state.experiences,
    education: state.education,
    skills: state.skills,
    languages: state.languages
  };
  localStorage.setItem('cvpro_draft', JSON.stringify(draft));
  showToast('✓ تم حفظ المسودة');
}

function loadDraft() {
  const draft = localStorage.getItem('cvpro_draft');
  if (!draft) return;
  try {
    const d = JSON.parse(draft);
    state.experiences = d.experiences || [];
    state.education = d.education || [];
    state.skills = d.skills || [];
    state.languages = d.languages || [];
    renderExperiences();
    renderEducation();
    renderSkills();
    renderLanguages();
  } catch {}
}

// Export PDF from header button
document.getElementById('exportBtn')?.addEventListener('click', exportPDF);
