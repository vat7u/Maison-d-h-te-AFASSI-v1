// Journal helpers shared by the home page, blog.html and article.html.
AFASSI_POSTS.sort((a, b) => b.date.localeCompare(a.date));

const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function formatDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function readingTime(post) {
  const words = post.body.map(b => b.p || b.h || b.quote || (b.list || []).join(' ')).join(' ').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)) + ' min de lecture';
}

function postUrl(post) {
  return 'article.html?p=' + encodeURIComponent(post.slug);
}

function postCard(post) {
  return `<article class="post-card fade">
    <a href="${postUrl(post)}" class="post-card-link">
      <div class="post-card-photo"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt)}" loading="lazy"></div>
      <p class="post-meta">${escapeHtml(post.category)} · <time datetime="${post.date}">${formatDate(post.date)}</time></p>
      <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
      <p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>
      <span class="read-more">Lire l'article</span>
    </a>
  </article>`;
}

function renderBody(blocks) {
  return blocks.map(b => {
    if (b.h) return `<h2>${escapeHtml(b.h)}</h2>`;
    if (b.quote) return `<blockquote>${escapeHtml(b.quote)}</blockquote>`;
    if (b.list) return `<ul>${b.list.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
    return `<p>${escapeHtml(b.p || '')}</p>`;
  }).join('');
}
