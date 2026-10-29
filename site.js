// Shared by every page: language buttons, announcement bar, fades, footer year.
document.documentElement.classList.add('js');

// Toast — floating message, bottom right
function showToast(text) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.dir = 'auto'; // Arabic messages read right to left
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// Site language. Only French page copy exists so far, but the choice is remembered and
// announced with an `afassi:langchange` event so language-aware parts (the reviews
// section) can follow it. The rest of the page stays French.
const SITE_LANGS = ['fr', 'en', 'ar', 'es'];
let siteLang = 'fr';
try {
  const saved = localStorage.getItem('afassi-lang');
  if (SITE_LANGS.includes(saved)) siteLang = saved;
} catch (e) { /* storage blocked: stay on French */ }

function getSiteLang() { return siteLang; }

const comingSoon = {
  en: 'The full English site is coming soon.',
  ar: 'النسخة العربية الكاملة من الموقع قريبًا.',
  es: 'La versión completa en español llegará pronto.',
};
const langButtons = [...document.querySelectorAll('.lang-switch button')];

function setSiteLang(lang) {
  if (!SITE_LANGS.includes(lang)) return;
  siteLang = lang;
  langButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  try { localStorage.setItem('afassi-lang', lang); } catch (e) { /* not remembered */ }
  document.dispatchEvent(new CustomEvent('afassi:langchange', { detail: { lang } }));
}

langButtons.forEach(btn => {
  btn.setAttribute('aria-pressed', String(btn.dataset.lang === siteLang));
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    if (lang === siteLang) return;
    setSiteLang(lang);
    if (lang !== 'fr') showToast(comingSoon[lang]);
  });
});

// Announcement bar close
const announcement = document.getElementById('announcement');
if (announcement) {
  announcement.querySelector('.announcement-close').addEventListener('click', () => announcement.classList.add('closed'));
}

// Gentle fade-in on scroll (also used for content rendered later, via observeFades)
const fadeIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    fadeIO.unobserve(entry.target);
  });
}, { threshold: 0.12 });
function observeFades(root = document) {
  root.querySelectorAll('.fade:not(.in)').forEach(el => fadeIO.observe(el));
}
observeFades();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
