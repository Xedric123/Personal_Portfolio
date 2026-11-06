// 1. Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// 2. Mobile menu
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// 3. Dark / light theme (remembers the choice)
const root = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
function setTheme(t) {
  root.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? 'Light mode' : 'Dark mode';
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// 4. Typing effect on the home section
const roles = ['BSIT student', 'aspiring programmer', 'web developer in training', 'lifelong learner'];
const typed = document.getElementById('typed');
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, c);
  if (!deleting && c === word.length) { deleting = true; return setTimeout(type, 1400); }
  if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; }
  c += deleting ? -1 : 1;
  setTimeout(type, deleting ? 50 : 100);
}
if (matchMedia('(prefers-reduced-motion: reduce)').matches) typed.textContent = roles[0]; else type();

// 5. Skill bars fill when they scroll into view
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelector('i').style.width = e.target.dataset.level + '%';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skill').forEach(s => io.observe(s));

// 6. Project filter
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => chip.addEventListener('click', () => {
  chips.forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  document.querySelectorAll('.project').forEach(p => {
    p.classList.toggle('hidden', chip.dataset.filter !== 'all' && p.dataset.type !== chip.dataset.filter);
  });
}));

// 7. Highlight current section in the nav
const links = [...nav.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section').forEach(s => spy.observe(s));

// 8. Contact form: validate, then open the visitor's email app
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const MY_EMAIL = 'templanzajohnxedric@gmail.com'; // messages from the contact form go here
form.addEventListener('submit', e => {
  e.preventDefault();
  const f = { name: form.name, email: form.email, message: form.message };
  const msgs = {
    name: f.name.value.trim() ? '' : 'Enter your name.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value) ? '' : 'Enter a valid email address.',
    message: f.message.value.trim().length >= 10 ? '' : 'Write at least 10 characters.'
  };
  let ok = true;
  Object.keys(msgs).forEach(k => {
    form.querySelector('[data-for="' + k + '"]').textContent = msgs[k];
    if (msgs[k]) ok = false;
  });
  if (!ok) { status.textContent = ''; return; }
  const body = encodeURIComponent(f.message.value + '\n\nFrom: ' + f.name.value + ' (' + f.email.value + ')');
  window.location.href = 'mailto:' + MY_EMAIL + '?subject=' + encodeURIComponent('Portfolio message from ' + f.name.value) + '&body=' + body;
  status.textContent = 'Opening your email app...';
  form.reset();
});
