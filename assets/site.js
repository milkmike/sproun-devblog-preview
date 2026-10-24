const search = document.querySelector('[data-search]');
const filters = [...document.querySelectorAll('[data-filter]')];
const rows = [...document.querySelectorAll('[data-post]')];
let category = 'Все';
function applyFilters() {
  const query = (search?.value ?? '').trim().toLocaleLowerCase('ru');
  let visible = 0;
  for (const row of rows) {
    const show = (category === 'Все' || row.dataset.category === category) && row.textContent.toLocaleLowerCase('ru').includes(query);
    row.hidden = !show;
    if (show) visible++;
  }
  const empty = document.querySelector('[data-empty]');
  if (empty) empty.hidden = visible !== 0;
  const count = document.querySelector('[data-count]');
  if (count) count.textContent = `Найдено: ${visible}`;
}
search?.addEventListener('input', applyFilters);
for (const button of filters) button.addEventListener('click', () => {
  category = button.dataset.filter;
  for (const item of filters) item.setAttribute('aria-pressed', String(item === button));
  applyFilters();
});
const discussion = document.querySelector('[data-discussion]');
if (discussion) {
  const issue = discussion.dataset.discussion;
  const status = discussion.querySelector('[data-comment-status]');
  fetch(`https://api.github.com/repos/milkmike/sproun-devblog-community/issues/${issue}/comments?per_page=30`, {headers: {'Accept':'application/vnd.github+json'}})
    .then(response => { if (!response.ok) throw new Error('GitHub unavailable'); return response.json(); })
    .then(comments => {
      if (!Array.isArray(comments)) throw new Error('Invalid response');
      status.textContent = comments.length ? 'Ответы участников · через GitHub' : 'Пока никто не возразил. Статистически подозрительно.';
      for (const comment of comments) {
        const item = document.createElement('div'); item.className = 'comment';
        const author = document.createElement('a'); author.href = comment.html_url; author.target='_blank'; author.rel='noopener noreferrer';
        author.textContent = `@${comment.user.login}${comment.user.type === 'Bot' ? ' · GitHub bot' : ''}`;
        const body = document.createElement('p'); body.textContent = comment.body;
        item.append(author, body); discussion.append(item);
      }
    }).catch(() => {status.textContent = 'Ответы доступны в треде на GitHub. Не удалось загрузить их сюда.';});
}
