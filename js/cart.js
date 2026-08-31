/* ============================================================
   cart.js — Shopping cart stored per-user (or per-guest) in
   localStorage. Renders into the slide-out .cart-sidebar that
   already exists in the site's CSS/HTML.
   ============================================================ */

const DELIVERY_FEE = 5;

function getCartKey() {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const prefix = typeof LS_KEYS !== 'undefined' && LS_KEYS.CART_PREFIX ? LS_KEYS.CART_PREFIX : 'cart_';
  return prefix + (user && user.email ? user.email : 'guest');
}

function getCart() {
  return typeof lsGet === 'function' ? lsGet(getCartKey(), []) : [];
}

function saveCart(cart) {
  if (typeof lsSet === 'function') {
    lsSet(getCartKey(), cart);
  }
  if (typeof renderNavbar === 'function') renderNavbar();
  renderCartSidebar();
  updateCartBadge(); // <--- អាប់ដេតលេខ Badge ភ្លាមៗពេល Cart មានការប្រែប្រួល
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/* ---------- update badge count ---------- */
function updateCartBadge() {
  const totalCount = getCartCount(); // ទាញយកចំនួន items តាម Key ត្រឹមត្រូវ
  const badgeEl = document.getElementById('cartBadge');
  
  if (badgeEl) {
    badgeEl.textContent = totalCount;
    badgeEl.style.display = totalCount > 0 ? 'inline-block' : 'none';
  }
}

/* ---------- add / update / remove ---------- */
function addToCart(item) {
  const product = typeof getProductById === 'function' ? getProductById(item.productId) : null;
  if (!product) { 
    if (typeof showToast === 'function') showToast('Product not found.', 'error'); 
    return; 
  }
  if (product.stock <= 0) { 
    if (typeof showToast === 'function') showToast('This product is out of stock.', 'error'); 
    return; 
  }

  const cart = getCart();
  const existing = cart.find(c => c.productId === item.productId && c.color === item.color && c.storage === item.storage);

  const currentQtyInCart = existing ? existing.qty : 0;
  if (currentQtyInCart + item.qty > product.stock) {
    if (typeof showToast === 'function') showToast(`Only ${product.stock} in stock — can't add more.`, 'error');
    return;
  }

  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  if (typeof showToast === 'function') showToast(`${item.model} added to cart.`, 'success');
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  if (typeof showToast === 'function') showToast('Item removed from cart.', 'info');
}

function updateCartQuantity(index, delta) {
  const cart = getCart();
  const item = cart[index];
  if (!item) return;
  const product = typeof getProductById === 'function' ? getProductById(item.productId) : null;
  const maxStock = product ? product.stock : 999;

  const newQty = item.qty + delta;
  if (newQty < 1) { removeFromCart(index); return; }
  if (newQty > maxStock) { 
    if (typeof showToast === 'function') showToast(`Only ${maxStock} in stock.`, 'error'); 
    return; 
  }

  item.qty = newQty;
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

/* ---------- totals ---------- */
function calculateCartTotal() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);
  const discount = cart.reduce((sum, i) => {
    const product = typeof getProductById === 'function' ? getProductById(i.productId) : null;
    if (!product || !product.storageOptions) return sum;
    const opt = product.storageOptions.find(o => o.size === i.storage);
    if (opt && opt.was && opt.was > opt.price) return sum + (opt.was - opt.price) * i.qty;
    return sum;
  }, 0);
  const delivery = cart.length ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;
  return { subtotal, discount, delivery, total };
}

/* ============================================================
   CART SIDEBAR — builds the sidebar/overlay markup once, then
   just re-renders its inner content whenever the cart changes.
   ============================================================ */
function ensureCartSidebar() {
  if (document.getElementById('cartSidebar')) return;

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.id = 'cartOverlay';

  const sidebar = document.createElement('div');
  sidebar.className = 'cart-sidebar';
  sidebar.id = 'cartSidebar';
  sidebar.innerHTML = `
    <div class="cart-header">
      <strong>🛒 Your Cart</strong>
      <button class="close-cart" id="closeCartBtn">&times;</button>
    </div>
    <div class="cart-body" id="cartBody"></div>
    <div class="cart-footer" id="cartFooter"></div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  overlay.addEventListener('click', closeCartSidebar);
  const closeBtn = document.getElementById('closeCartBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeCartSidebar);
}

function openCartSidebar() {
  ensureCartSidebar();
  renderCartSidebar();
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');
  if (overlay) overlay.classList.add('open');
  if (sidebar) sidebar.classList.add('open');
}

function closeCartSidebar() {
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');
  if (overlay) overlay.classList.remove('open');
  if (sidebar) sidebar.classList.remove('open');
}

function renderCartSidebar() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body || !footer) return;

  const cart = getCart();
  const imgPlaceholder = typeof PLACEHOLDER_IMG !== 'undefined' ? PLACEHOLDER_IMG : '';
  const safeFormatPrice = typeof formatPrice === 'function' ? formatPrice : (val) => '$' + val;
  const safeEscapeHtml = typeof escapeHtml === 'function' ? escapeHtml : (str) => str || '';

  if (!cart.length) {
    body.innerHTML = `<div class="empty-state"><span class="emoji">🛒</span>Your cart is empty.</div>`;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image || imgPlaceholder}" alt="${safeEscapeHtml(item.model)}" onerror="this.src='${imgPlaceholder}'">
      <div class="cart-item-details">
        <div class="cart-item-title">${safeEscapeHtml(item.model)}</div>
        <div class="cart-item-opt">${safeEscapeHtml(item.color)} · ${safeEscapeHtml(item.storage)}</div>
        <div class="cart-item-price">${safeFormatPrice(item.price)} × ${item.qty} = ${safeFormatPrice(item.price * item.qty)}</div>
        <div class="cart-item-actions">
          <button class="qty-btn" data-cart-action="minus" data-index="${index}">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-cart-action="plus" data-index="${index}">+</button>
        </div>
        <button class="remove-item-btn" data-cart-action="remove" data-index="${index}">Remove</button>
      </div>
    </div>
  `).join('');

  const totals = calculateCartTotal();
  footer.innerHTML = `
    <div class="cart-total-row"><span>Subtotal</span><span>${safeFormatPrice(totals.subtotal)}</span></div>
    <div class="cart-total-row"><span>Delivery</span><span>${safeFormatPrice(totals.delivery)}</span></div>
    ${totals.discount > 0 ? `<div class="cart-total-row"><span>Discount</span><span>-${safeFormatPrice(totals.discount)}</span></div>` : ''}
    <div class="cart-total-row grand"><span>Total</span><span>${safeFormatPrice(totals.total)}</span></div>
    <button class="checkout-btn" id="goCheckoutBtn">Checkout</button>
    <button class="clear-cart-btn" id="clearCartBtn">Clear Cart</button>
  `;

  const goCheckoutBtn = document.getElementById('goCheckoutBtn');
  if (goCheckoutBtn) {
    goCheckoutBtn.addEventListener('click', () => {
      if (typeof requireLogin === 'function' && !requireLogin('checkout.html')) return;
      window.location.href = 'checkout.html';
    });
  }

  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Clear all items from your cart?')) clearCart();
    });
  }
}

/* delegated click handling for +/- and remove inside the cart sidebar */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-cart-action]');
  if (!btn) return;
  const index = Number(btn.dataset.index);
  const action = btn.dataset.cartAction;
  if (action === 'plus') updateCartQuantity(index, 1);
  if (action === 'minus') updateCartQuantity(index, -1);
  if (action === 'remove') removeFromCart(index);
});

/* ---------- Buy Now ---------- */
function startBuyNow(item) {
  const product = typeof getProductById === 'function' ? getProductById(item.productId) : null;
  if (!product || product.stock < item.qty) {
    if (typeof showToast === 'function') showToast('Not enough stock for this quantity.', 'error');
    return;
  }
  if (typeof lsSet === 'function') lsSet('buyNowItem', item);
  if (typeof requireLogin === 'function' && !requireLogin('checkout.html?mode=buynow')) return;
  window.location.href = 'checkout.html?mode=buynow';
}

/* ---------- DOM Ready Initialization ---------- */
document.addEventListener('DOMContentLoaded', function () {
  ensureCartSidebar();
  renderCartSidebar();
  updateCartBadge(); // Run បង្ហាញ Badge ចំនួនទំនិញពេល Load page
});