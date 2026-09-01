/* ============================================================
   app.js — Core utilities, seed data, toast notifications,
   navbar rendering (Dynamic Guest/User/Admin UI).
   ============================================================ */

/* ---------- localStorage keys ---------- */
const LS_KEYS = {
  PRODUCTS: 'products',
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  ORDERS: 'orders',
  CART_PREFIX: 'cart_',        // cart_<email> (guests use cart_guest)
  WISHLIST_PREFIX: 'wishlist_' // wishlist_<email>
};

/* ---------- Generic Storage Helpers ---------- */
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('lsGet error for', key, e);
    return fallback;
  }
}

function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- ID Generator & Currency ---------- */
function generateId(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatPrice(n) {
  n = Number(n) || 0;
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

/* ============================================================
   SEED DATA — Runs on first load to guarantee default records
   ============================================================ */
function seedProductsIfEmpty() {
  const existing = lsGet(LS_KEYS.PRODUCTS, null);
  if (existing && existing.length) return;

  const seed = [
    {
      id: 's26-ultra', brand: 'Samsung', model: 'Galaxy S26 Ultra', category: 'Smartphone',
      description: 'The flagship Samsung Galaxy S26 Ultra with an extraordinary camera system and powerful chipset.',
      ram: '12GB', stock: 14, rating: 4.8, isNew: true, isFeatured: true, isOffer: true, createdAt: Date.now() - 1000,
      image: 'https://i.pinimg.com/736x/cc/2d/92/cc2d92241e3acc4d4a570e4b52746fb8.jpg',
      colors: ['Black', 'Titanium Gray', 'Blue'],
      storageOptions: [
        { size: '256GB', price: 1199, was: 1599 },
        { size: '512GB', price: 1399, was: 1599 },
        { size: '1TB', price: 1599, was: 1599 }
      ]
    },
    {
      id: 'i15-promax', brand: 'Apple', model: 'iPhone 15 Pro Max', category: 'Smartphone',
      description: 'Titanium design, A17 Pro chip, and advanced camera hardware.',
      ram: '8GB', stock: 9, rating: 4.9, isNew: true, isFeatured: true, createdAt: Date.now() - 2000,
      image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=512&hei=512&fmt=p-jpg',
      colors: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'],
      storageOptions: [
        { size: '256GB', price: 1299, was: 1399 },
        { size: '512GB', price: 1499, was: 1399 },
        { size: '1TB', price: 1699, was: 1399 }
      ]
    },
    {
      id: 'pura-80', brand: 'Huawei', model: 'Huawei Pura 80 Pro', category: 'Smartphone',
      description: 'Elegant design with cutting-edge mobile photography technology.',
      ram: '12GB', stock: 5, rating: 4.5, isNew: false, isOffer: true, createdAt: Date.now() - 3000,
      image: 'https://i.pinimg.com/736x/56/05/ee/5605ee5743f1ae6c5c245cc3fe03f076.jpg',
      colors: ['Black', 'White'],
      storageOptions: [
        { size: '256GB', price: 999, was: 1299 },
        { size: '512GB', price: 1199, was: 1299 }
      ]
    },
    {
      id: 'oppo-x7', brand: 'Oppo', model: 'OPPO Find X7 Ultra', category: 'Smartphone',
      description: 'Dual-periscope camera setup with Hasselblad color tuning.',
      ram: '16GB', stock: 0, rating: 4.6, isNew: true, createdAt: Date.now() - 4000,
      image: 'https://i.pinimg.com/1200x/e1/20/8c/e1208cb36add77ca73853236f2f26a70.jpg',
      colors: ['Black'],
      storageOptions: [
        { size: '1TB', price: 950, was: 1200 }
      ]
    },
    {
      id: 'ipad-m4', brand: 'Apple', model: 'iPad Pro M4', category: 'Tablet',
      description: 'Ultra-thin tablet powered by the M4 chip with a stunning Ultra Retina XDR display.',
      ram: '8GB', stock: 11, rating: 4.7, isFeatured: true, createdAt: Date.now() - 5000,
      image: 'https://i.pinimg.com/1200x/5b/23/53/5b2353e578f90e60f16de47b77f655b5.jpg',
      colors: ['Space Gray', 'Silver'],
      storageOptions: [
        { size: '256GB', price: 650, was: 800 },
        { size: '1TB', price: 750, was: 800 }
      ]
    },
    {
      id: 'i17-promax', brand: 'Apple', model: 'iPhone 17 Pro Max', category: 'Smartphone',
      description: 'The latest generation iPhone with next-level performance and camera capability.',
      ram: '8GB', stock: 6, rating: 4.9, isNew: true, isFeatured: true, createdAt: Date.now(),
      image: 'https://i.pinimg.com/736x/8e/f8/be/8ef8bee4bb6f355520f78899ab23cc83.jpg',
      colors: ['Titanium Black', 'Titanium Blue'],
      storageOptions: [
        { size: '256GB', price: 1499, was: 1799 },
        { size: '512GB', price: 1699, was: 1799 },
        { size: '1TB', price: 1899, was: 1799 }
      ]
    }
  ];
  lsSet(LS_KEYS.PRODUCTS, seed);
}

function seedUsersIfEmpty() {
  const existing = lsGet(LS_KEYS.USERS, null);
  if (existing && existing.length) return;
  const seed = [
    { id: generateId('u'), name: 'Shop Admin', email: 'admin@angkormass.com', password: 'admin123', role: 'admin' }
  ];
  lsSet(LS_KEYS.USERS, seed);
}

function seedOrdersIfEmpty() {
  const existing = lsGet(LS_KEYS.ORDERS, null);
  if (existing === null) lsSet(LS_KEYS.ORDERS, []);
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function ensureToastWrap() {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  return wrap;
}

function showToast(message, type = 'info') {
  const wrap = ensureToastWrap();
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

/* ============================================================
   REQUIREMENT 1: DYNAMIC NAVBAR RENDERING
   ============================================================ */
function renderNavbar() {
  const nav = document.querySelector('nav .nav-inner');
  if (!nav) return;

  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const cartCount = typeof getCartCount === 'function' ? getCartCount() : 0;
  const wishCount = typeof getWishlistCount === 'function' ? getWishlistCount() : 0;

  // ឆែកមើលយ៉ាងច្បាស់លាស់ថាតើជា Admin ឬអត់
  const isAdmin = user && (user.role === 'admin' || user.name === 'admin' || user.email === 'admin@angkormass.com');

  let links = '';

  if (!user) {
    // Guest User Navigation
    links = `
      <a href="index.html">Home</a>
      
      <a href="about.html">About Us</a>
      <a href="contact.html">Contact</a>
      <a href="javascript:void(0)" onclick="openCartSidebar()">Cart (${cartCount})</a>

      <span class="nav-spacer"></span>
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  } else if (isAdmin) {
    // Admin Navigation - លុប Dashboard, Orders, Users ចេញ
    links = `
      <a href="index.html">Home</a>

      <a href="about.html">About Us</a>
      <a href="contact.html">Contact</a>
      <a href="admin.html#products">Products Management</a>
      <span class="nav-spacer"></span>
      <span class="nav-user-name"> ${escapeHtml(user.name)}</span>
      <span class="nav-admin-badge" style="background:#e63946; color:#fff; padding:2px 6px; border-radius:4px; font-size:12px; margin-right:8px;">Admin</span>
      <a href="#" id="logoutLink">Logout</a>
    `;
  } else {
    // Logged-in Normal User Navigation
    links = `
      <a href="index.html">Home</a>
    
      <a href="about.html">About Us</a>
      <a href="contact.html">Contact</a>
      <a href="javascript:void(0)" onclick="openCartSidebar()">Cart (${cartCount})</a>
     
      <a href="orders.html">My Orders</a>

      <span class="nav-spacer"></span>
      <span class="nav-user-name">👤 ${escapeHtml(user.name)}</span>
      <a href="#" id="logoutLink">Logout</a>
    `;
  }

  nav.innerHTML = links;

  // Highlight current page
  const here = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a[href]').forEach(a => {
    const hrefFile = a.getAttribute('href').split('#')[0];
    if (hrefFile && hrefFile === here) a.classList.add('active');
  });

  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      logoutUser();
    });
  }

  const badgeEl = document.getElementById('cartBadge');
  if (badgeEl) {
    badgeEl.textContent = cartCount;
    badgeEl.style.display = cartCount > 0 ? 'inline-block' : 'none';
  }
}

/* ---------- Mobile Nav Toggle ---------- */
function initNavToggle() {
  const toggleBtn = document.getElementById('navToggleBtn');
  const navInner = document.querySelector('nav .nav-inner');
  if (!toggleBtn || !navInner) return;
  toggleBtn.addEventListener('click', () => {
    navInner.classList.toggle('open');
  });
}

/* ============================================================
   REQUIREMENT 4: CONTACT FORM VALIDATION
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = (document.getElementById('contactName')?.value || '').trim();
    const email = (document.getElementById('contactEmail')?.value || '').trim();
    const phone = (document.getElementById('contactPhone')?.value || '').trim();
    const message = (document.getElementById('contactMessage')?.value || '').trim();
    const errorEl = document.getElementById('contactError');
    const successEl = document.getElementById('contactSuccess');

    if (errorEl) errorEl.classList.remove('show');
    if (successEl) successEl.classList.remove('show');

    if (!name) return showFieldError(errorEl, 'Please enter your name.');
    if (!email) return showFieldError(errorEl, 'Please enter your email.');
    if (typeof isValidEmail === 'function' && !isValidEmail(email)) {
      return showFieldError(errorEl, 'Please enter a valid email address.');
    }
    if (!phone) return showFieldError(errorEl, 'Please enter your phone number.');
    if (!message) return showFieldError(errorEl, 'Please enter a message.');

    if (successEl) {
      successEl.textContent = 'Thank you for reaching out! Your message has been sent successfully.';
      successEl.classList.add('show');
    }
    showToast('Message sent successfully!', 'success');
    form.reset();
  });
}

function showFieldError(errorEl, msg) {
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add('show');
  }
}

/* ---------- App Initialization ---------- */
document.addEventListener('DOMContentLoaded', function () {
  seedProductsIfEmpty();
  seedUsersIfEmpty();
  seedOrdersIfEmpty();
  renderNavbar();
  initNavToggle();
  initContactForm();
});

/* ---------- Auth Helpers ---------- */
function getCurrentUser() {
  const user = lsGet(LS_KEYS.CURRENT_USER, null);
  
  // បង្ខំឱ្យស្គាល់ជា Admin ជានិច្ច ប្រសិនបើឈ្មោះ ឬ Email ត្រូវគ្នា
  if (user) {
    if (user.name === 'admin' || user.email === 'admin@angkormass.com') {
      user.role = 'admin';
    }
  }
  
  return user;
}

function logoutUser() {
  localStorage.removeItem(LS_KEYS.CURRENT_USER);
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}