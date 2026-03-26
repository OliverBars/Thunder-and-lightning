// ─── Smooth scroll for menu ───────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── Pop-up ───────────────────────────────────────────────────────────────────
function createPopup({ title, message, type = 'success' }) {
  const existing = document.querySelector('.popup-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  const icon = type === 'success'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M7 13l3 3 7-7"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>`;

  overlay.innerHTML = `
    <div class="popup">
      <div class="popup__icon popup__icon--${type}">${icon}</div>
      <h3 class="popup__title">${title}</h3>
      <p class="popup__message">${message}</p>
      <button class="popup__close btn-submit">Close</button>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('popup-overlay--visible'));

  const close = () => {
    overlay.classList.remove('popup-overlay--visible');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector('.popup__close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
  });
}

// ─── "Get a Ticket" buttons ───────────────────────────────────────────────────
document.querySelectorAll('.btn-ticket').forEach(btn => {
  btn.addEventListener('click', () => {
    const row = btn.closest('tr');
    const venue = row.querySelector('.venue').textContent;
    const datetime = row.querySelector('.datetime').textContent;
    createPopup({
      title: 'Ticket booked!',
      message: `📍 ${venue}<br>🗓 ${datetime}<br><br>Please expect a confirmation email.`,
      type: 'success'
    });
  });
});

// ─── "Get a Ticket" button (hero) ─────────────────────────────────────────────
const heroBtnPrimary = document.querySelector('.btn-primary');
if (heroBtnPrimary) {
  heroBtnPrimary.addEventListener('click', e => {
    e.preventDefault();
    const concerts = document.querySelector('.concerts');
    if (concerts) concerts.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ─── Form + validation + GET request ─────────────────────────────────────────
const form = document.querySelector('.contacts__form');
if (form) {
  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const messageInput = form.querySelector('#message');

  function showError(input, msg) {
    clearError(input);
    input.classList.add('form__input--error');
    const err = document.createElement('span');
    err.className = 'form__error';
    err.textContent = msg;
    input.parentNode.appendChild(err);
  }

  function clearError(input) {
    input.classList.remove('form__input--error');
    const err = input.parentNode.querySelector('.form__error');
    if (err) err.remove();
  }

  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, 'Please enter your name (at least 2 characters)');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address');
      valid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'Message must be at least 10 characters long');
      valid = false;
    }

    if (!valid) return;

    // GET request
    const params = new URLSearchParams({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim()
    });

    fetch(`?${params.toString()}`, { method: 'GET' })
      .catch(() => {}); // ignore error — no server

    createPopup({
      title: 'Message sent!',
      message: `Thank you, ${nameInput.value.trim()}! We will get back to you shortly.`,
      type: 'success'
    });

    form.reset();
  });
}