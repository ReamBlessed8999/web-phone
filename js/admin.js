let currentProductsPage = 1;
let currentOrdersPage = 1;
let currentUsersPage = 1;
const itemsPerPage = 5;
let salesChartInstance = null;

function requireAdmin() {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const isAdmin = user && (user.role === 'admin' || user.name === 'admin' || user.email === 'admin@angkormass.com');

  if (!isAdmin) {
    if (typeof showToast === 'function') showToast('Access denied. Admin rights required.', 'error');
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
    return false;
  }
  return true;
}

function enforceRoleRestrictions() {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const role = user ? (user.role || 'user') : 'guest';
  const navInner = document.getElementById('dynamicNavInner');

  if (navInner) {
    if (role === 'admin') {
      navInner.innerHTML = `
        <a href="admin.html" class="active">Dashboard</a>
        <a href="admin.html#products">Admin</a>
        <a href="#" onclick="handleAdminLogout(event)">Logout</a>
      `;
    } else if (role === 'user') {
      navInner.innerHTML = `
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="cart.html">Cart</a>
        <a href="orders.html">My Orders</a>
        <a href="#" onclick="handleAdminLogout(event)">Logout</a>
      `;
    } else {
      navInner.innerHTML = `
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="cart.html">Cart</a>
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
      `;
    }
  }

  const path = window.location.pathname.toLowerCase();
  if (role === 'admin') {
    if (path.includes('index.html') || path.includes('orders.html') || path.includes('cart.html')) {
      window.location.href = 'admin.html';
    }
  }
}

function handleAdminLogout(e) {
  if (e) e.preventDefault();
  if (typeof logoutUser === 'function') logoutUser();
  else {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('adminDarkMode', isDark ? 'true' : 'false');
  updateThemeButtonText();
}

function initDarkMode() {
  const isDark = localStorage.getItem('adminDarkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
  }
  updateThemeButtonText();
}

function updateThemeButtonText() {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    const isDark = document.body.classList.contains('dark-mode');
    btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }
}

function toggleNotificationMenu() {
  const menu = document.getElementById('notifMenu');
  if (menu) menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

/* notification show detail: each alert now shows the order id,
   customer, amount, or the product/stock detail — not just a
   count — and clicking one jumps to the right tab (place). */
function updateAlertNotifications() {
  const products = lsGet(LS_KEYS.PRODUCTS, []);
  const orders = lsGet(LS_KEYS.ORDERS, []);

  const lowStock = products.filter(p => Number(p.stock) <= 5);
  const newOrders = orders.filter(o => (o.status || '').toLowerCase() === 'pending');

  const list = document.getElementById('notifList');
  const badge = document.getElementById('notifBadgeCount');

  const totalAlerts = lowStock.length + newOrders.length;
  if (badge) {
    badge.textContent = totalAlerts;
    badge.style.display = totalAlerts > 0 ? 'inline-block' : 'none';
  }

  if (list) {
    let html = '';

    newOrders.forEach(o => {
      const amount = Number(o.totalAmount || o.total || 0).toFixed(2);
      const itemCount = (o.items || []).length;
      html += `
        <li onclick="goToAdminTab('orders')" style="cursor:pointer;">
          <strong>New Order #${o.id}</strong><br>
          ${o.customerName || 'Guest'} — ${itemCount} item${itemCount === 1 ? '' : 's'} — $${amount}
        </li>`;
    });

    lowStock.forEach(p => {
      html += `
        <li onclick="goToAdminTab('products')" style="cursor:pointer;">
          <strong>${p.stock <= 0 ? 'Out of Stock' : 'Low Stock'}:</strong> ${p.brand} ${p.model} (${p.stock} left)
        </li>`;
    });

    if (!totalAlerts) html = '<li>No active alerts.</li>';
    list.innerHTML = html;
  }
}

function goToAdminTab(tabName) {
  const btn = document.querySelector(`.admin-sidebar [data-tab="${tabName}"]`);
  if (btn) btn.click();
  const menu = document.getElementById('notifMenu');
  if (menu) menu.style.display = 'none';
}

function initAdminPage() {
  if (!requireAdmin()) return;

  initDarkMode();
  enforceRoleRestrictions();
  initAdminTabs();
  renderDashboardOverview();
  renderAnalyticsTab();
  renderAdminProductsTable();
  renderAdminOrdersTable();
  renderAdminUsersTable();
  initProductModal();
  updateAlertNotifications();
}

function initAdminTabs() {
  const buttons = document.querySelectorAll('.admin-sidebar [data-tab]');
  const panels = document.querySelectorAll('.admin-tab-panel');
  if (!buttons.length) return;

  function activate(tabName) {
    buttons.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === tabName));
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      activate(btn.dataset.tab);
      history.replaceState(null, '', '#' + btn.dataset.tab);
    });
  });

  const hashTab = window.location.hash.replace('#', '');
  activate(hashTab && document.querySelector(`[data-tab="${hashTab}"]`) ? hashTab : 'dashboard');
}

function renderDashboardOverview() {
  const products = lsGet(LS_KEYS.PRODUCTS, []);
  const orders = lsGet(LS_KEYS.ORDERS, []);
  const users = lsGet(LS_KEYS.USERS, []);

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setEl('statTotalProducts', products.length);
  setEl('statTotalUsers', users.length);
  setEl('statTotalOrders', orders.length);

  const validOrders = orders.filter(o => (o.status || '').toLowerCase() !== 'cancelled');
  const totalSales = validOrders.reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);
  setEl('statTotalSales', `$${totalSales.toFixed(2)}`);

  setEl('statPendingOrders', orders.filter(o => (o.status || '').toLowerCase() === 'pending').length);
  setEl('statCompletedOrders', orders.filter(o => ['delivered', 'completed'].includes((o.status || '').toLowerCase())).length);

  const lowStockItems = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5);
  const outOfStockItems = products.filter(p => Number(p.stock) <= 0);

  setEl('statLowStock', lowStockItems.length);
  setEl('statOutOfStock', outOfStockItems.length);

  const recentTbody = document.getElementById('recentOrdersTbody');
  if (recentTbody) {
    const recent = [...orders].reverse().slice(0, 5);
    recentTbody.innerHTML = recent.map(o => `
      <tr>
        <td>#${o.id}</td>
        <td>${new Date(o.createdAt || Date.now()).toLocaleDateString()}</td>
        <td>${o.customerName || 'Guest'}</td>
        <td>$${Number(o.totalAmount || o.total || 0).toFixed(2)}</td>
        <td><strong>${o.status || 'Pending'}</strong></td>
      </tr>
    `).join('') || '<tr><td colspan="5">No recent orders.</td></tr>';
  }

  const stockTbody = document.getElementById('lowStockDetailsTbody');
  if (stockTbody) {
    const combined = [...outOfStockItems, ...lowStockItems];
    stockTbody.innerHTML = combined.map(p => `
      <tr>
        <td><img src="${p.image || 'https://via.placeholder.com/40'}" width="30" height="30"></td>
        <td>${p.brand} ${p.model}</td>
        <td><strong>${p.stock}</strong></td>
        <td><span>${p.stock <= 0 ? 'Out of Stock' : 'Low Stock'}</span></td>
        <td><button onclick="promptAddStock('${p.id}')" class="btn-confirm" style="padding:4px 8px; font-size:12px;">Restock</button></td>
      </tr>
    `).join('') || '<tr><td colspan="5">All stock levels normal.</td></tr>';
  }
}

function renderAnalyticsTab() {
  const orders = lsGet(LS_KEYS.ORDERS, []);
  const products = lsGet(LS_KEYS.PRODUCTS, []);

  const totalSales = orders
    .filter(o => (o.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);

  const ctx = document.getElementById('salesTrendChart');
  if (ctx) {
    if (salesChartInstance) salesChartInstance.destroy();
    salesChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Sales Revenue ($)',
          data: [totalSales * 0.15, totalSales * 0.25, totalSales * 0.35, totalSales * 0.25],
          borderColor: '#d4af37',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          fill: true
        }]
      }
    });
  }

  const topList = document.getElementById('topSellingProductsList');
  if (topList) {
    topList.innerHTML = products.slice(0, 3).map(p => `<li>${p.brand} ${p.model}</li>`).join('') || '<li>No sales data</li>';
  }

  const revList = document.getElementById('revenueByCategoryList');
  if (revList) {
    revList.innerHTML = `<p>Total Revenue Calculated: $${totalSales.toFixed(2)}</p>`;
  }

  const growth = document.getElementById('monthlyGrowthComparison');
  if (growth) growth.textContent = '+12.5%';
}

function promptAddStock(productId) {
  const products = lsGet(LS_KEYS.PRODUCTS, []);
  const product = products.find(p => p.id === productId);
  if (!product) return;

  Swal.fire({
    title: `Restock: ${product.brand} ${product.model}`,
    input: 'number',
    inputValue: 10,
    showCancelButton: true,
    confirmButtonText: 'Restock',
    confirmButtonColor: '#10b981'
  }).then((result) => {
    if (result.isConfirmed) {
      product.stock = Number(product.stock) + Number(result.value);
      lsSet(LS_KEYS.PRODUCTS, products);
      showToast('Stock updated successfully', 'success');
      renderDashboardOverview();
      renderAdminProductsTable();
      updateAlertNotifications();
    }
  });
}

function deleteProduct(productId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete product!'
  }).then((result) => {
    if (result.isConfirmed) {
      let products = lsGet(LS_KEYS.PRODUCTS, []);
      products = products.filter(p => p.id !== productId);
      lsSet(LS_KEYS.PRODUCTS, products);
      showToast('Product deleted successfully', 'success');
      renderAdminProductsTable();
      renderDashboardOverview();
      updateAlertNotifications();
    }
  });
}

/* can't delete user — fixed: read the freshest list right before
   filtering/writing, confirm the user still exists, and always
   give a toast so a silent failure is never invisible.
   Only the admin account itself is protected from deletion —
   every other user (role "user") can be deleted normally. */
function deleteUser(userEmail) {
  const users = lsGet(LS_KEYS.USERS, []);
  const target = users.find(u => u.email === userEmail);

  if (!target) {
    showToast('User not found — it may already be deleted.', 'error');
    renderAdminUsersTable();
    return;
  }

  if ((target.role || 'user') === 'admin') {
    showToast("Admin account can't be deleted.", 'error');
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "Delete this user account?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete user!'
  }).then((result) => {
    if (!result.isConfirmed) return;

    const freshUsers = lsGet(LS_KEYS.USERS, []);
    const remaining = freshUsers.filter(u => u.email !== userEmail);
    lsSet(LS_KEYS.USERS, remaining);
    showToast('User deleted successfully', 'success');
    renderAdminUsersTable();
    renderDashboardOverview();
  });
}

/* can improve complete/cancel/pending when user buy:
   lets the admin change an order's status directly from the
   Orders table. */
function updateOrderStatus(orderId, newStatus) {
  const orders = lsGet(LS_KEYS.ORDERS, []);
  const order = orders.find(o => String(o.id) === String(orderId));
  if (!order) return;

  order.status = newStatus;
  lsSet(LS_KEYS.ORDERS, orders);

  showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
  renderAdminOrdersTable();
  renderDashboardOverview();
  updateAlertNotifications();
}

function renderPaginationUI(infoId, prevBtnId, nextBtnId, numbersWrapId, totalItems, totalPages, currentPage, onPageChange) {
  const infoEl = document.getElementById(infoId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const numbersWrap = document.getElementById(numbersWrapId);

  if (!infoEl || !prevBtn || !nextBtn || !numbersWrap) return;

  const startShow = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endShow = Math.min(currentPage * itemsPerPage, totalItems);

  infoEl.textContent = `Showing ${startShow} to ${endShow} of ${totalItems}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  prevBtn.onclick = () => { if (currentPage > 1) onPageChange(currentPage - 1); };
  nextBtn.onclick = () => { if (currentPage < totalPages) onPageChange(currentPage + 1); };

  let btnsHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    btnsHtml += `<button style="padding:4px 8px; ${i === currentPage ? 'background:var(--primary);' : ''}" onclick="(${onPageChange})(${i})">${i}</button>`;
  }
  numbersWrap.innerHTML = btnsHtml;
}

function renderAdminProductsTable(filterQuery = '') {
  const tbody = document.getElementById('adminProductsTbody');
  if (!tbody) return;

  let products = lsGet(LS_KEYS.PRODUCTS, []);

  if (filterQuery) {
    products = products.filter(p =>
      (p.brand || '').toLowerCase().includes(filterQuery) ||
      (p.model || '').toLowerCase().includes(filterQuery)
    );
  }

  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const paginated = products.slice((currentProductsPage - 1) * itemsPerPage, currentProductsPage * itemsPerPage);

  tbody.innerHTML = paginated.map(p => `
    <tr>
      <td><img src="${p.image || 'https://via.placeholder.com/40'}" width="40" height="40"></td>
      <td><strong>${escapeHtml(p.brand)}</strong></td>
      <td>${escapeHtml(p.model)}</td>
      <td>$${Number(p.price || 0).toFixed(2)}</td>
      <td><strong>${p.stock}</strong></td>
      <td>${p.stock <= 0 ? 'Out of Stock' : (p.stock <= 5 ? 'Low Stock' : 'In Stock')}</td>
      <td>
        <button onclick="promptAddStock('${p.id}')" class="btn-confirm" style="padding:4px 8px;">Restock</button>
        <button onclick="openProductModal('${p.id}')" class="btn-cancel" style="padding:4px 8px;">Edit</button>
        <button onclick="deleteProduct('${p.id}')" class="btn-delete" style="padding:4px 8px;">Delete</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7">No products found.</td></tr>';

  renderPaginationUI('productsPaginationInfo', 'productsPrevBtn', 'productsNextBtn', 'productsPageNumbers', products.length, totalPages, currentProductsPage, (p) => { currentProductsPage = p; renderAdminProductsTable(filterQuery); });
}

/* show amount item: items column lists item names with quantity
   (e.g. "iPhone 14 x2, Case x1") in a tooltip, plus the item
   count; status column becomes a dropdown so pending / completed
   / cancelled can be set after purchase. */
function renderAdminOrdersTable(filterQuery = '') {
  const tbody = document.getElementById('adminOrdersTbody');
  if (!tbody) return;

  let orders = lsGet(LS_KEYS.ORDERS, []);

  if (filterQuery) {
    orders = orders.filter(o =>
      String(o.id).toLowerCase().includes(filterQuery) ||
      (o.customerName || '').toLowerCase().includes(filterQuery)
    );
  }

  const totalPages = Math.ceil(orders.length / itemsPerPage) || 1;
  const paginated = orders.slice((currentOrdersPage - 1) * itemsPerPage, currentOrdersPage * itemsPerPage);

  const statusOptions = ['Pending', 'Completed', 'Cancelled'];

  tbody.innerHTML = paginated.map(o => {
    const items = o.items || [];
    const itemsDetail = items.map(it => `${it.brand || it.name || 'Item'}${it.model ? ' ' + it.model : ''} x${it.quantity || it.qty || 1}`).join(', ');
    const currentStatus = o.status || 'Pending';
    const optionsHtml = statusOptions.map(s =>
      `<option value="${s}" ${s.toLowerCase() === currentStatus.toLowerCase() ? 'selected' : ''}>${s}</option>`
    ).join('');

    return `
    <tr>
      <td>#${o.id}</td>
      <td>${new Date(o.createdAt || Date.now()).toLocaleDateString()}</td>
      <td>${o.customerName || 'Guest'}</td>
      <td title="${itemsDetail.replace(/"/g, '&quot;')}">${items.length} item${items.length === 1 ? '' : 's'}</td>
      <td>${o.paymentMethod || 'COD'}</td>
      <td><strong>$${Number(o.totalAmount || o.total || 0).toFixed(2)}</strong></td>
      <td>
        <select onchange="updateOrderStatus('${o.id}', this.value)">
          ${optionsHtml}
        </select>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="7">No orders found.</td></tr>';

  renderPaginationUI('ordersPaginationInfo', 'ordersPrevBtn', 'ordersNextBtn', 'ordersPageNumbers', orders.length, totalPages, currentOrdersPage, (p) => { currentOrdersPage = p; renderAdminOrdersTable(filterQuery); });
}

function renderAdminUsersTable(filterQuery = '') {
  const tbody = document.getElementById('adminUsersTbody');
  if (!tbody) return;

  let users = lsGet(LS_KEYS.USERS, []);

  if (filterQuery) {
    users = users.filter(u =>
      (u.name || '').toLowerCase().includes(filterQuery) ||
      (u.email || '').toLowerCase().includes(filterQuery)
    );
  }

  const totalPages = Math.ceil(users.length / itemsPerPage) || 1;
  const paginated = users.slice((currentUsersPage - 1) * itemsPerPage, currentUsersPage * itemsPerPage);

  tbody.innerHTML = paginated.map(u => {
    const isAdminUser = (u.role || 'user') === 'admin';
    return `
    <tr>
      <td>${u.name || 'User'}</td>
      <td>${u.email}</td>
      <td>${u.role || 'user'}</td>
      <td>
        ${isAdminUser
          ? `<button class="btn-delete" style="padding:4px 8px; opacity:0.5; cursor:not-allowed;" disabled title="Admin account can't be deleted">Delete</button>`
          : `<button onclick="deleteUser('${u.email}')" class="btn-delete" style="padding:4px 8px;">Delete</button>`}
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="4">No users found.</td></tr>';

  renderPaginationUI('usersPaginationInfo', 'usersPrevBtn', 'usersNextBtn', 'usersPageNumbers', users.length, totalPages, currentUsersPage, (p) => { currentUsersPage = p; renderAdminUsersTable(filterQuery); });
}

function handleGlobalSearch() {
  const query = document.getElementById('adminGlobalSearch').value.toLowerCase().trim();
  renderAdminProductsTable(query);
  renderAdminOrdersTable(query);
  renderAdminUsersTable(query);
}

function initProductModal() {
  const addBtn = document.getElementById('addProductBtn');
  if (addBtn) addBtn.addEventListener('click', () => openProductModal(null));

  const closeBtn = document.getElementById('pfCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeProductModal);

  const cancelBtn = document.getElementById('pfCancelBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', closeProductModal);
}

function openProductModal(id) {
  const modal = document.getElementById('productFormModal');
  if (modal) modal.classList.add('open');
}

function closeProductModal() {
  const modal = document.getElementById('productFormModal');
  if (modal) modal.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function () {
  enforceRoleRestrictions();
  if (document.getElementById('adminMainWrap')) {
    initAdminPage();
  }
});