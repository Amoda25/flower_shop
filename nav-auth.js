/**
 * nav-auth.js
 * Bloomi Flowers — Shared navigation authentication helper.
 * Include this script at the bottom of every page body.
 * It reads localStorage for the logged-in user and swaps the
 * static nav "Login" link for a profile avatar pill with a dropdown.
 */
(function () {
  const user = JSON.parse(localStorage.getItem('bloomiUser') || 'null');
  if (!user) return;

  // Find the <a class="nav-login-btn"> or <a href="login.html"> in the nav
  const loginLink = document.querySelector('nav a[href="login.html"], nav a.nav-login-btn');
  if (!loginLink) return;

  const initial = (user.name || 'U').charAt(0).toUpperCase();
  const firstName = (user.name || '').split(' ')[0];

  // Inject CSS for the avatar pill & dropdown (once)
  if (!document.getElementById('nav-auth-styles')) {
    const style = document.createElement('style');
    style.id = 'nav-auth-styles';
    style.textContent = `
      .nav-user-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #FA4E79, #FF648B);
        color: #fff;
        padding: 8px 16px 8px 10px;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;
        position: relative;
        transition: box-shadow 0.2s;
        border: none;
        font-family: 'Lato', sans-serif;
        letter-spacing: 0.4px;
      }
      .nav-user-pill:hover { box-shadow: 0 4px 16px rgba(250,78,121,0.4); color:#fff; }
      .nav-user-avatar {
        width: 26px; height: 26px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.8rem;
        font-weight: 900;
        flex-shrink: 0;
      }
      .nav-user-dropdown {
        display: none;
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 12px 40px rgba(250,78,121,0.18);
        border: 1px solid rgba(255,135,167,0.2);
        min-width: 200px;
        z-index: 9999;
        overflow: hidden;
        animation: fadeDown 0.18s ease;
      }
      @keyframes fadeDown {
        from { opacity:0; transform:translateY(-6px); }
        to   { opacity:1; transform:translateY(0); }
      }
      .nav-user-dropdown.open { display: block; }
      .nav-dropdown-header {
        background: linear-gradient(135deg, #fff9fb, #fce4ec40);
        padding: 14px 18px;
        border-bottom: 1px solid #fce4ec;
      }
      .nav-dropdown-header strong { display:block; color:#1a0a10; font-size:0.9rem; }
      .nav-dropdown-header span   { color:#b08090; font-size:0.78rem; }
      .nav-dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 18px;
        color: #3a1a24;
        text-decoration: none;
        font-size: 0.88rem;
        font-family: 'Lato', sans-serif;
        transition: background 0.15s;
        border: none;
        background: none;
        width: 100%;
        cursor: pointer;
        text-align: left;
      }
      .nav-dropdown-item:hover { background: #fff9fb; color: #FA4E79; }
      .nav-dropdown-divider { height:1px; background:#fce4ec; margin:4px 0; }
      .nav-dropdown-item.logout { color: #c0392b; }
      .nav-dropdown-item.logout:hover { background: #fde8ea; }
    `;
    document.head.appendChild(style);
  }

  // Build the pill + dropdown wrapper
  const wrapper = document.createElement('li');
  wrapper.style.cssText = 'position:relative;display:inline-block;list-style:none;';

  wrapper.innerHTML = `
    <button class="nav-user-pill" id="navUserPill" aria-expanded="false">
      <div class="nav-user-avatar">${initial}</div>
      ${firstName}
    </button>
    <div class="nav-user-dropdown" id="navUserDropdown">
      <div class="nav-dropdown-header">
        <strong>${user.name}</strong>
        <span>${user.email || ''}</span>
      </div>
      <a href="profile.html" class="nav-dropdown-item">🌸 My Profile</a>
      <a href="profile.html" class="nav-dropdown-item">🛒 Order History</a>
      <div class="nav-dropdown-divider"></div>
      <button class="nav-dropdown-item logout" id="navLogoutBtn">🚪 Logout</button>
    </div>
  `;

  // Replace the login link's parent <li> or the link itself
  const parentLi = loginLink.closest('li');
  if (parentLi) {
    parentLi.replaceWith(wrapper);
  } else {
    loginLink.replaceWith(wrapper);
  }

  // Toggle dropdown
  const pill     = document.getElementById('navUserPill');
  const dropdown = document.getElementById('navUserDropdown');

  pill.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    pill.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', function () {
    dropdown.classList.remove('open');
    pill.setAttribute('aria-expanded', 'false');
  });

  // Logout
  document.getElementById('navLogoutBtn').addEventListener('click', function () {
    localStorage.removeItem('bloomiUser');
    window.location.href = 'index.html';
  });
})();
