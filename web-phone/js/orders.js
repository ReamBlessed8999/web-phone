/* ============================================================
   orders.js — Checkout, Order creation & User order history
   ============================================================ */

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled'];

function loadOrders() { return lsGet(LS_KEYS.ORDERS, []); }
function saveOrders(orders) { lsSet(LS_KEYS.ORDERS, orders); }

// Requirement 16: Separate User Orders
function getOrdersForUser(email) {
  return loadOrders()
    .filter(o => o.userEmail.toLowerCase() === email.toLowerCase())
    .sort((a, b) => b.date - a.date);
}

function placeOrder({ name, phone, address, city, items, paymentMethod }) {
  const user = getCurrentUser();
  if (!user) return null;

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  const order = {
    id: generateId('ORD').toUpperCase(),
    userEmail: user.email,
    customerName: name,
    phone,
    address,
    city,
    products: items,
    subtotal,
    delivery: DELIVERY_FEE,
    total,
    paymentMethod,
    date: Date.now(),
    status: 'Pending'
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  // Requirement 12: Decrease Stock dynamically
  items.forEach(item => decreaseStock(item.productId, item.qty));

  return order;
}

/* ============================================================
   CHECKOUT PAGE
   ============================================================ */
function getCheckoutItems() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');

  if (mode === 'buynow') {
    const item = lsGet('buyNowItem', null);
    return item ? [item] : [];
  }
  return getCart();
}

function renderCheckoutSummary(items) {
  const wrap = document.getElementById('checkoutItemsList');
  const summaryTotals = document.getElementById('checkoutTotals');
  if (!wrap) return;

  if (!items.length) {
    wrap.innerHTML = `<div class="empty-state"><span class="emoji">🛒</span>Nothing to check out.</div>`;
    if (summaryTotals) summaryTotals.innerHTML = '';
    return;
  }

  wrap.innerHTML = items.map(item => `
    <div class="checkout-item">
      <img src="${item.image || PLACEHOLDER_IMG}" alt="${escapeHtml(item.model)}">
      <div class="checkout-item-info">
        <div class="name">${escapeHtml(item.model)}</div>
        <div class="opt">${escapeHtml(item.color)} · ${escapeHtml(item.storage)} · Qty ${item.qty}</div>
      </div>
      <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  if (summaryTotals) {
    summaryTotals.innerHTML = `
      <div class="cart-total-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="cart-total-row"><span>Delivery</span><span>${formatPrice(DELIVERY_FEE)}</span></div>
      <div class="cart-total-row grand"><span>Total</span><span>${formatPrice(total)}</span></div>
    `;
  }
}

function initCheckoutPage() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  if (!requireLogin('checkout.html')) return;

  const items = getCheckoutItems();
  renderCheckoutSummary(items);

  const user = getCurrentUser();
  const nameEl = document.getElementById('checkoutName');
  const emailEl = document.getElementById('checkoutEmail');
  if (nameEl && user) nameEl.value = user.name || '';
  if (emailEl && user) emailEl.value = user.email || '';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const currentItems = getCheckoutItems();
    if (!currentItems.length) {
      showToast('Your cart is empty.', 'error');
      return;
    }

    // Requirement 12: never allow ordering more than available stock
    for (const item of currentItems) {
      const product = getProductById(item.productId);
      if (!product || product.stock < item.qty) {
        showToast(`"${item.model}" no longer has enough stock.`, 'error');
        return;
      }
    }

    const name = document.getElementById('checkoutName').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();
    const city = document.getElementById('checkoutCity').value.trim();
    const paymentMethod = form.querySelector('input[name="paymentMethod"]:checked')?.value || 'Cash on Delivery';

    if (!name || !phone || !address || !city) {
      showToast('Please fill in all delivery details.', 'error');
      return;
    }

    const order = placeOrder({ name, phone, address, city, items: currentItems, paymentMethod });
    if (!order) {
      showToast('Something went wrong placing your order.', 'error');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'buynow') {
      localStorage.removeItem('buyNowItem');
    } else {
      clearCart();
    }

    showToast('Order placed successfully!', 'success');
    setTimeout(() => { window.location.href = 'orders.html'; }, 700);
  });
}

/* ============================================================
   MY ORDERS PAGE
   ============================================================ */
function renderOrderHistory() {
  const list = document.getElementById('ordersList');
  if (!list) return;

  const user = getCurrentUser();
  if (!user) return;

  const orders = getOrdersForUser(user.email);
  if (!orders.length) {
    list.innerHTML = `
      <div class="page-empty">
        <div class="page-empty-icon">📦</div>
        <h3>No orders found</h3>
        <p>You haven't placed any orders yet. Start shopping to view your order history here.</p>
        <a href="index.html" class="btn-cta">Start Shopping</a>
      </div>`;
    return;
  }

  list.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-head">
        <strong>Order #${o.id}</strong>
        <span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span>
      </div>
      <div class="order-date">${new Date(o.date).toLocaleString()}</div>
      <div class="order-items">
        ${o.products.map(p => `<div>${escapeHtml(p.model)} (${escapeHtml(p.color)}, ${escapeHtml(p.storage)}) × ${p.qty}</div>`).join('')}
      </div>
      <div class="order-foot">
        <span>Payment: ${escapeHtml(o.paymentMethod)}</span>
        <strong>Total: ${formatPrice(o.total)}</strong>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('ordersList')) {
    if (requireLogin('orders.html')) renderOrderHistory();
  }
  if (document.getElementById('checkoutForm')) {
    initCheckoutPage();
  }
});