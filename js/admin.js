/* ============================================================
   admin.js — Admin Dashboard, CRUD, Sales Analytics & Orders
   ============================================================ */

function initAdminPage() {
  // Requirement 9: Strict Route protection
  if (!requireAdmin()) return;

  initAdminTabs();
  renderDashboardStats();
  renderSalesStatistics();
  renderAdminProductsTable();
  renderAdminOrdersTable();
  renderAdminUsersTable();
  initProductModal();
}

/* ============================================================
   TAB SWITCHING
   ============================================================ */
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

/* ============================================================
   REQUIREMENT 10 & 14: DYNAMIC DASHBOARD & SALES STATISTICS
   ============================================================ */
function renderDashboardStats() {
  const products = loadProducts();
  const orders = loadOrders();
  const users = getUsers();

  const totalProducts = products.length;
  const totalUsers = users.filter(u => u.role === 'user').length;
  const totalOrders = orders.length;

  const validOrders = orders.filter(o => o.status !== 'Cancelled');
  const completedOrdersList = orders.filter(o => o.status === 'Delivered');
  const pendingOrdersList = orders.filter(o => o.status === 'Pending');

  const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setEl('statTotalProducts', totalProducts);
  setEl('statTotalUsers', totalUsers);
  setEl('statTotalOrders', totalOrders);
  setEl('statTotalSales', formatPrice(totalSales));
  setEl('statPendingOrders', pendingOrdersList.length);
  setEl('statCompletedOrders', completedOrdersList.length);
  setEl('statLowStock', lowStockCount);
  setEl('statOutOfStock', outOfStockCount);
}

function renderSalesStatistics() {
  const orders = loadOrders();
  const validOrders = orders.filter(o => o.status !== 'Cancelled');
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled');
  const completedOrders = orders.filter(o => o.status === 'Delivered');
  const pendingOrders = orders.filter(o => o.status === 'Pending');

  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);

  let totalUnitsSold = 0;
  const productSalesMap = {};

  validOrders.forEach(o => {
    (o.products || []).forEach(item => {
      totalUnitsSold += item.qty;
      const key = item.model || 'Unknown Product';
      productSalesMap[key] = (productSalesMap[key] || 0) + item.qty;
    });
  });

  let bestSellingProduct = 'None yet';
  let maxQty = 0;
  for (const [pName, qty] of Object.entries(productSalesMap)) {
    if (qty > maxQty) {
      maxQty = qty;
      bestSellingProduct = `${pName} (${qty} sold)`;
    }
  }

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('salesTotalRevenue', formatPrice(totalRevenue));
  setEl('salesTotalOrders', orders.length);
  setEl('salesTotalUnits', totalUnitsSold);
  setEl('salesCompletedOrders', completedOrders.length);
  setEl('salesPendingOrders', pendingOrders.length);
  setEl('salesCancelledOrders', cancelledOrders.length);
  setEl('salesBestSeller', bestSellingProduct);
}

/* ============================================================
   REQUIREMENT 11: PRODUCT CRUD & DELETE CONFIRMATION
   ============================================================ */
function renderAdminProductsTable() {
  const tbody = document.getElementById('adminProductsTbody');
  if (!tbody) return;

  const products = loadProducts();
  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:24px;">No products yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img src="${p.image || PLACEHOLDER_IMG}" width="40" height="40" style="object-fit:cover; border-radius:6px;" onerror="this.src='${PLACEHOLDER_IMG}'"></td>
      <td>${escapeHtml(p.brand)}</td>
      <td>${escapeHtml(p.model)}</td>
      <td>${formatPrice(getMinStorageOption(p).price)}</td>
      <td>${p.stock}</td>
      <td>${getStockBadgeHtml(p.stock)}</td>
      <td>
        <button class="btn-sm" onclick="openProductModal('${p.id}')">Edit</button>
        <button class="btn-sm btn-danger" onclick="confirmDeleteProduct('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function confirmDeleteProduct(id) {
  const product = getProductById(id);
  if (!product) return;

  // Requirement 11: Confirmation Dialog
  if (confirm(`Are you sure you want to delete this product: "${product.model}"?`)) {
    deleteProduct(id);
    showToast('Product deleted.', 'success');
    renderDashboardStats();
    renderAdminProductsTable();
  }
}

/* ---------- Add / Edit Product Modal ---------- */
function initProductModal() {
  const addBtn = document.getElementById('addProductBtn');
  if (addBtn) addBtn.addEventListener('click', () => openProductModal(null));

  const form = document.getElementById('productForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('pfId').value || null;
    const brand = document.getElementById('pfBrand').value.trim();
    const model = document.getElementById('pfModel').value.trim();
    const category = document.getElementById('pfCategory').value.trim() || 'Smartphone';
    const price = Number(document.getElementById('pfPrice').value);
    const discount = Number(document.getElementById('pfDiscount').value) || 0;
    const ram = document.getElementById('pfRam').value.trim();
    const storageRaw = document.getElementById('pfStorage').value.trim();
    const colorsRaw = document.getElementById('pfColors').value.trim();
    const image = document.getElementById('pfImage').value.trim();
    const description = document.getElementById('pfDescription').value.trim();
    const stock = Number(document.getElementById('pfStock').value);

    if (!brand || !model || !price || price <= 0 || isNaN(stock) || stock < 0) {
      showToast('Please fill in all required fields with valid values.', 'error');
      return;
    }

    const was = discount > 0 ? Math.round(price / (1 - discount / 100)) : price;
    const storageOptions = (storageRaw ? storageRaw.split(',') : ['256GB'])
      .map(s => s.trim()).filter(Boolean)
      .map(size => ({ size, price, was }));
    const colors = (colorsRaw ? colorsRaw.split(',') : ['Black'])
      .map(c => c.trim()).filter(Boolean);

    const payload = {
      brand, model, category, ram, stock,
      image: image || PLACEHOLDER_IMG,
      description,
      colors,
      storageOptions,
      isNew: document.getElementById('pfIsNew').checked,
      isFeatured: document.getElementById('pfIsFeatured').checked,
      isOffer: discount > 0
    };

    if (id) {
      updateProduct(id, payload);
      showToast('Product updated.', 'success');
    } else {
      addProduct(payload);
      showToast('Product added.', 'success');
    }

    closeProductModal();
    renderDashboardStats();
    renderAdminProductsTable();
  });

  const cancelBtn = document.getElementById('pfCancelBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', closeProductModal);
  const closeBtn = document.getElementById('pfCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
}

function openProductModal(id) {
  const modal = document.getElementById('productFormModal');
  const form = document.getElementById('productForm');
  if (!modal || !form) return;
  form.reset();

  const title = document.getElementById('pfModalTitle');
  const product = id ? getProductById(id) : null;

  document.getElementById('pfId').value = id || '';
  if (title) title.textContent = product ? 'Edit Product' : 'Add New Product';

  if (product) {
    document.getElementById('pfBrand').value = product.brand || '';
    document.getElementById('pfModel').value = product.model || '';
    document.getElementById('pfCategory').value = product.category || '';
    const minOpt = getMinStorageOption(product);
    document.getElementById('pfPrice').value = minOpt.price || '';
    const discountPct = minOpt.was && minOpt.was > minOpt.price
      ? Math.round((1 - minOpt.price / minOpt.was) * 100) : 0;
    document.getElementById('pfDiscount').value = discountPct || '';
    document.getElementById('pfRam').value = product.ram || '';
    document.getElementById('pfStorage').value = (product.storageOptions || []).map(s => s.size).join(', ');
    document.getElementById('pfColors').value = (product.colors || []).join(', ');
    document.getElementById('pfImage').value = product.image || '';
    document.getElementById('pfDescription').value = product.description || '';
    document.getElementById('pfStock').value = product.stock;
    document.getElementById('pfIsNew').checked = !!product.isNew;
    document.getElementById('pfIsFeatured').checked = !!product.isFeatured;
  }

  modal.classList.add('open');
}

function closeProductModal() {
  const modal = document.getElementById('productFormModal');
  if (modal) modal.classList.remove('open');
}

/* ============================================================
   REQUIREMENT 13: ADMIN ORDER MANAGEMENT & STATUS UPDATE
   ============================================================ */
function renderAdminOrdersTable() {
  const tbody = document.getElementById('adminOrdersTbody');
  if (!tbody) return;

  const orders = loadOrders().sort((a, b) => b.date - a.date);
  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:24px;">No orders yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>#${o.id}</td>
      <td>${escapeHtml(o.customerName)}<br><small style="color:var(--text-muted);">${escapeHtml(o.userEmail)} · ${escapeHtml(o.phone || '')}</small></td>
      <td>${o.products.map(p => `${escapeHtml(p.model)} (${escapeHtml(p.color)}, ${escapeHtml(p.storage)}) × ${p.qty}`).join('<br>')}</td>
      <td>${escapeHtml(o.paymentMethod || '-')}<br><small style="color:var(--text-muted);">${new Date(o.date).toLocaleDateString()}</small></td>
      <td>${formatPrice(o.total)}</td>
      <td>
        <select onchange="handleAdminStatusChange('${o.id}', this.value)" class="status-select">
          ${ORDER_STATUSES.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

function handleAdminStatusChange(orderId, newStatus) {
  const orders = loadOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const wasCancelled = order.status === 'Cancelled';
  const isNowCancelled = newStatus === 'Cancelled';

  // Restore or decrease stock if status switches to/from Cancelled
  if (isNowCancelled && !wasCancelled) {
    order.products.forEach(p => restoreStock(p.productId, p.qty));
  } else if (!isNowCancelled && wasCancelled) {
    order.products.forEach(p => decreaseStock(p.productId, p.qty));
  }

  order.status = newStatus;
  saveOrders(orders);
  showToast(`Order #${orderId} changed to ${newStatus}`, 'success');
  renderDashboardStats();
  renderSalesStatistics();
  renderAdminProductsTable();
  renderAdminOrdersTable();
}

function renderAdminUsersTable() {
  const tbody = document.getElementById('adminUsersTbody');
  if (!tbody) return;

  const users = getUsers();
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="role-badge role-${u.role}">${u.role}</span></td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('adminMainWrap')) {
    initAdminPage();
  }
});