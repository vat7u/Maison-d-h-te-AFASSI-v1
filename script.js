// Home page only (shared behaviour lives in site.js)

// Hero slider: crossfade every 6 s; pauses on hover, when the tab is hidden, and for reduced motion
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = document.getElementById('hero-dots');
let slideIndex = 0;
let slideTimer;
const autoplay = slides.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches;

function goToSlide(i) {
  slides[slideIndex].classList.remove('is-active');
  dots.children[slideIndex].setAttribute('aria-current', 'false');
  slideIndex = (i + slides.length) % slides.length;
  slides[slideIndex].classList.add('is-active');
  dots.children[slideIndex].setAttribute('aria-current', 'true');
}
function startSlider() {
  clearInterval(slideTimer);
  if (autoplay) slideTimer = setInterval(() => goToSlide(slideIndex + 1), 6000);
}

if (slides.length > 1) {
  dots.innerHTML = slides.map((s, i) =>
    `<button type="button" aria-label="Photo ${i + 1}" aria-current="${i === 0}"></button>`).join('');
  [...dots.children].forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startSlider(); }));
  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', () => clearInterval(slideTimer));
  hero.addEventListener('mouseleave', startSlider);
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(slideTimer) : startSlider());
  startSlider();
}

// Partner logos: endless scroll. Copies of the list fill the band; the track slides by
// exactly one list width, then restarts, so the jump is invisible. Static for reduced motion.
const partnerTrack = document.querySelector('.partner-track');
if (partnerTrack && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const marquee = partnerTrack.parentElement;
  const original = partnerTrack.querySelector('.partner-list');
  const fillTrack = () => {
    partnerTrack.querySelectorAll('.partner-list[aria-hidden]').forEach(copy => copy.remove());
    const listWidth = original.getBoundingClientRect().width;
    if (!listWidth) return;
    const copies = Math.ceil(marquee.clientWidth / listWidth) + 1;
    for (let i = 0; i < copies; i++) {
      const copy = original.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('img').forEach(img => { img.alt = ''; });
      partnerTrack.appendChild(copy);
    }
    partnerTrack.style.setProperty('--partner-shift', `-${listWidth}px`);
    partnerTrack.style.setProperty('--partner-duration', `${listWidth / 40}s`); // about 40 px per second
    partnerTrack.classList.add('is-running');
  };
  fillTrack();
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fillTrack, 200); });
}

// Active nav link follows the section in view
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navIO.observe(s));

// Booking request: room picker keeps the summary card in sync
const rooms = {
  indigo: { kind: 'Chambre standard', name: 'Indigo', photo: 'photo-1505577058444-a3dab90d4253', desc: 'Cosy et authentique, idéale pour un voyageur seul ou un couple en quête de calme.' },
  safran: { kind: 'Chambre double', name: 'Safran', photo: 'photo-1667125095636-dce94dcbdd96', desc: "Plus d'espace, le même charme marocain : tapis tissés main et lumière douce sur les toits bleus." },
  menthe: { kind: 'Chambre familiale', name: 'Menthe', photo: 'photo-1505576391880-b3f9d713dc4f', desc: 'Pensée pour les familles et les petits groupes, avec de la place pour chacun.' },
};
const select = document.getElementById('room-select');
const showRoom = id => {
  const r = rooms[id];
  document.getElementById('aside-kind').textContent = r.kind;
  document.getElementById('aside-name').textContent = r.name;
  document.getElementById('aside-desc').textContent = r.desc;
  document.getElementById('aside-photo').src = `https://images.unsplash.com/${r.photo}?auto=format&fit=crop&w=800&q=75`;
};
select.addEventListener('change', () => showRoom(select.value));
document.querySelectorAll('[data-room]').forEach(btn =>
  btn.addEventListener('click', () => { select.value = btn.dataset.room; showRoom(btn.dataset.room); })
);

// No booking backend yet: confirm the request in a dialog
const form = document.getElementById('booking-form');
const dialog = document.getElementById('booking-dialog');
form.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('dialog-room').textContent = rooms[select.value].name;
  dialog.showModal();
  form.reset();
  showRoom(select.value);
});

// Latest journal posts
document.getElementById('journal-latest').innerHTML = AFASSI_POSTS.slice(0, 3).map(postCard).join('');
observeFades(document.getElementById('journal-latest'));
