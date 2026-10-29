// Reviews section (home page). Renders the platform rating cards from AFASSI_RATINGS and
// the reviews from AFASSI_REVIEWS whose original language matches the site language
// (site.js:getSiteLang), as an endless scrolling strip. Re-renders on the
// `afassi:langchange` event. Never translates.
(() => {
  const section = document.getElementById('avis');
  if (!section) return;

  const ratings = window.AFASSI_RATINGS || [];
  const data = window.AFASSI_REVIEWS || { isMock: false, reviews: [] };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Section wording per language (the reviews themselves are never translated)
  const UI = {
    fr: {
      locale: 'fr-FR', dir: 'ltr',
      eyebrow: 'Avis des voyageurs', title: "Ce qu'ils en disent",
      platforms: 'Notes sur les plateformes',
      rated: (score, scale) => `Note : ${score} sur ${scale}`,
      count: n => `${n} avis`,
      badge: 'Exemple',
      empty: 'Aucun avis en français pour le moment.',
      more: 'Lire la suite', less: 'Réduire',
      via: name => `Avis ${name}`,
    },
    en: {
      locale: 'en-GB', dir: 'ltr',
      eyebrow: 'Guest reviews', title: 'What our guests say',
      platforms: 'Ratings on booking platforms',
      rated: (score, scale) => `Rated ${score} out of ${scale}`,
      count: n => `${n} reviews`,
      badge: 'Example',
      empty: 'No reviews in English yet.',
      more: 'Read more', less: 'Show less',
      via: name => `Review on ${name}`,
    },
    es: {
      locale: 'es-ES', dir: 'ltr',
      eyebrow: 'Opiniones de viajeros', title: 'Lo que dicen de nosotros',
      platforms: 'Valoraciones en las plataformas',
      rated: (score, scale) => `Valoración: ${score} de ${scale}`,
      count: n => `${n} opiniones`,
      badge: 'Ejemplo',
      empty: 'Todavía no hay opiniones en español.',
      more: 'Leer más', less: 'Leer menos',
      via: name => `Opinión en ${name}`,
    },
    ar: {
      locale: 'ar-MA', dir: 'rtl',
      eyebrow: 'آراء الضيوف', title: 'ماذا يقول ضيوفنا',
      platforms: 'التقييمات على منصات الحجز',
      rated: (score, scale) => `التقييم: ${score} من ${scale}`,
      count: n => `${n} تقييم`,
      badge: 'مثال',
      empty: 'لا توجد آراء باللغة العربية حاليًا.',
      more: 'اقرأ المزيد', less: 'عرض أقل',
      via: name => `تقييم على ${name}`,
    },
  };

  const el = {
    eyebrow: section.querySelector('[data-reviews="eyebrow"]'),
    title: section.querySelector('[data-reviews="title"]'),
    summary: section.querySelector('[data-reviews="summary"]'),
    marquee: section.querySelector('[data-reviews="marquee"]'),
    track: section.querySelector('[data-reviews="track"]'),
    list: section.querySelector('[data-reviews="list"]'),
    empty: section.querySelector('[data-reviews="empty"]'),
  };
  let ui = UI.fr;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const platformOf = key => ratings.find(r => r.platform === key) || { name: key, scale: 5 };

  // Five stars; the gold layer is clipped to score / scale (mirrors in right-to-left)
  const STAR = '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/>';
  const starRow = () => `<svg viewBox="0 0 120 24" aria-hidden="true">${[0, 1, 2, 3, 4].map(i => `<g transform="translate(${i * 24} 0)">${STAR}</g>`).join('')}</svg>`;
  const stars = (score, scale) =>
    `<span class="stars" aria-hidden="true"><span class="stars-base">${starRow()}</span><span class="stars-fill" style="width:${Math.min(100, (score / scale) * 100)}%">${starRow()}</span></span>`;

  function renderSummary() {
    const fmt = new Intl.NumberFormat(ui.locale, { maximumFractionDigits: 1 });
    el.summary.setAttribute('aria-label', ui.platforms);
    el.summary.innerHTML = ratings.map(r => {
      const score = fmt.format(r.score);
      const logo = r.logo
        ? `<span class="rating-logo"><img src="${esc(r.logo)}" alt="" width="24" height="24" onerror="this.parentNode.remove()"></span>`
        : '';
      const inner = `
        <div class="rating-head">${logo}<p class="rating-platform">${esc(r.name)}</p></div>
        <div class="rating-body">
          <p class="rating-score"><span class="rating-value">${score}</span><span class="rating-scale">/${r.scale}</span></p>
          ${stars(r.score, r.scale)}
        </div>
        <p class="sr-only">${esc(ui.rated(score, r.scale))}</p>
        ${r.count != null ? `<p class="rating-count">${esc(ui.count(new Intl.NumberFormat(ui.locale).format(r.count)))}</p>` : ''}`;
      return `<li class="rating-card">${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${inner}</a>` : inner}</li>`;
    }).join('');
  }

  function reviewCard(review) {
    const platform = platformOf(review.platform);
    const fmt = new Intl.NumberFormat(ui.locale, { maximumFractionDigits: 1 });
    const score = fmt.format(review.rating);
    const cc = String(review.country || '').toUpperCase();
    let country = cc;
    try { country = new Intl.DisplayNames([ui.locale], { type: 'region' }).of(cc) || cc; } catch (e) { /* keep the code */ }
    const flag = /^[A-Z]{2}$/.test(cc)
      ? `<img class="review-flag" src="https://flagcdn.com/20x15/${cc.toLowerCase()}.png" srcset="https://flagcdn.com/40x30/${cc.toLowerCase()}.png 2x" width="20" height="15" alt="" onerror="this.remove()">`
      : '';
    const ratingVisual = platform.scale === 5
      ? stars(review.rating, platform.scale)
      : `<span class="review-score" aria-hidden="true">${score}<span>/${platform.scale}</span></span>`;
    const reviewDir = review.lang === 'ar' ? 'rtl' : 'ltr';

    return `<article class="review-card" lang="${esc(review.lang)}" dir="${reviewDir}">
      <header class="review-head">
        ${flag}
        <div class="review-who">
          <p class="review-name">${esc(review.name)}</p>
          <p class="review-country">${esc(country)}</p>
        </div>
        ${data.isMock ? `<span class="badge badge-sky review-badge">${esc(ui.badge)}</span>` : ''}
      </header>
      <div class="review-rating">${ratingVisual}<span class="sr-only">${esc(ui.rated(score, platform.scale))}</span></div>
      <p class="review-text">${esc(review.text)}</p>
      <button type="button" class="review-more" aria-expanded="false" hidden>${esc(ui.more)}</button>
      <p class="review-platform">${esc(ui.via(platform.short || platform.name))}</p>
    </article>`;
  }

  // Show "Read more" only on texts actually cut by the line clamp (measured on the originals)
  function markLongTexts() {
    el.list.querySelectorAll('.review-card').forEach(card => {
      const text = card.querySelector('.review-text');
      card.querySelector('.review-more').hidden = text.scrollHeight - text.clientHeight < 2;
    });
  }

  // Endless strip: copies of the list fill the band and the track slides by exactly one
  // list width, so the restart is invisible. Moves the other way in right-to-left.
  // Copies are hidden from screen readers and keyboard. Static for reduced motion.
  function fillTrack() {
    el.track.querySelectorAll('.review-list[aria-hidden]').forEach(copy => copy.remove());
    el.track.classList.remove('is-running', 'is-paused');
    const listWidth = el.list.getBoundingClientRect().width;
    if (reducedMotion || !el.list.children.length || !listWidth) return;
    const copies = Math.ceil(el.marquee.clientWidth / listWidth) + 1;
    for (let i = 0; i < copies; i++) {
      const copy = el.list.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('button').forEach(b => b.setAttribute('tabindex', '-1'));
      el.track.appendChild(copy);
    }
    const sign = ui.dir === 'rtl' ? '' : '-';
    el.track.style.setProperty('--review-shift', `${sign}${listWidth}px`);
    el.track.style.setProperty('--review-duration', `${listWidth / 30}s`); // about 30 px per second
    el.track.classList.add('is-running');
  }

  // "Read more" works on every copy; the strip stops while a review is open
  el.track.addEventListener('click', e => {
    const btn = e.target.closest('.review-more');
    if (!btn) return;
    const card = btn.closest('.review-card');
    const open = card.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? ui.less : ui.more;
    el.track.classList.toggle('is-paused', !!el.track.querySelector('.review-card.is-open'));
  });

  function render(lang) {
    ui = UI[lang] || UI.fr;
    section.lang = lang;
    section.dir = ui.dir;
    el.eyebrow.textContent = ui.eyebrow;
    el.title.textContent = ui.title;
    renderSummary();

    const list = data.reviews.filter(r => r.lang === lang);
    el.list.innerHTML = list.map(reviewCard).join('');
    el.marquee.hidden = list.length === 0;
    el.empty.hidden = list.length > 0;
    el.empty.textContent = ui.empty;
    requestAnimationFrame(() => { markLongTexts(); fillTrack(); });
  }

  render(typeof getSiteLang === 'function' ? getSiteLang() : 'fr');
  document.addEventListener('afassi:langchange', e => render(e.detail.lang));
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fillTrack, 200); });
})();
