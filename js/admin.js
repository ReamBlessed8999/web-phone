/* ============================================================
   admin.js — Admin Dashboard, CRUD, Sales Analytics & Orders
   (with Pagination & Modal Fix)
   ============================================================ */

/* ---------- Pagination State Config ---------- */
let currentProductsPage = 1;
let currentOrdersPage = 1;
let currentUsersPage = 1;
const itemsPerPage = 5;

/* ---------- Helper Fallbacks & Route Protection ---------- */
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

function getMinStorageOption(product) {
  if (product.storageOptions && product.storageOptions.length > 0) {
    return product.storageOptions[0];
  }
  return { size: 'Standard', price: product.price || 0, was: product.price || 0 };
}

function getStockBadgeHtml(stock) {
  const num = Number(stock || 0);
  if (num === 0) return '<span style="color:var(--danger,#ef4444); font-weight:600;">Out of Stock</span>';
  if (num <= 5) return '<span style="color:var(--warning,#f59e0b); font-weight:600;">Low Stock</span>';
  return '<span style="color:var(--success,#10b981); font-weight:600;">In Stock</span>';
}

function restoreStock(productId, qty) {
  const products = lsGet(LS_KEYS.PRODUCTS, []);
  const idx = products.findIndex(p => p.id === productId);
  if (idx !== -1) {
    products[idx].stock = Number(products[idx].stock || 0) + Number(qty);
    lsSet(LS_KEYS.PRODUCTS, products);
  }
}

function decreaseStock(productId, qty) {
  const products = lsGet(LS_KEYS.PRODUCTS, []);
  const idx = products.findIndex(p => p.id === productId);
  if (idx !== -1) {
    products[idx].stock = Math.max(0, Number(products[idx].stock || 0) - Number(qty));
    lsSet(LS_KEYS.PRODUCTS, products);
  }
}

/* ---------- Main Admin Init ---------- */
function initAdminPage() {
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
   DYNAMIC DASHBOARD & SALES STATISTICS
   ============================================================ */
function renderDashboardStats() {
  const products = lsGet(LS_KEYS.PRODUCTS, []);
  const orders = lsGet(LS_KEYS.ORDERS, []);
  const users = lsGet(LS_KEYS.USERS, []);

  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;

  const validOrders = orders.filter(o => (o.status || '').toLowerCase() !== 'cancelled');
  const completedOrdersList = orders.filter(o => {
    const s = (o.status || '').toLowerCase();
    return s === 'delivered' || s === 'completed';
  });
  const pendingOrdersList = orders.filter(o => (o.status || '').toLowerCase() === 'pending');

  const totalSales = validOrders.reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);

  const lowStockCount = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).length;
  const outOfStockCount = products.filter(p => Number(p.stock) <= 0).length;

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
  const orders = lsGet(LS_KEYS.ORDERS, []);
  const validOrders = orders.filter(o => (o.status || '').toLowerCase() !== 'cancelled');
  const cancelledOrders = orders.filter(o => (o.status || '').toLowerCase() === 'cancelled');
  const completedOrders = orders.filter(o => {
    const s = (o.status || '').toLowerCase();
    return s === 'delivered' || s === 'completed';
  });
  const pendingOrders = orders.filter(o => (o.status || '').toLowerCase() === 'pending');

  const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);

  let totalUnitsSold = 0;
  const productSalesMap = {};

  validOrders.forEach(o => {
    const items = o.items || o.products || [];
    items.forEach(item => {
      const qty = Number(item.quantity || item.qty || 1);
      totalUnitsSold += qty;
      const key = item.model || item.name || 'Unknown Product';
      productSalesMap[key] = (productSalesMap[key] || 0) + qty;
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
   REUSABLE PAGINATION RENDERER HELPER
   ============================================================ */
function renderPaginationUI(infoId, prevBtnId, nextBtnId, numbersWrapId, totalItems, totalPages, currentPage, onPageChange) {
  const infoEl = document.getElementById(infoId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const numbersWrap = document.getElementById(numbersWrapId);

  if (!infoEl || !prevBtn || !nextBtn || !numbersWrap) return;

  const startShow = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endShow = Math.min(currentPage * itemsPerPage, totalItems);

  infoEl.textContent = `Showing ${startShow} to ${endShow} of ${totalItems} entries`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  prevBtn.onclick = () => { if (currentPage > 1) onPageChange(currentPage - 1); };
  nextBtn.onclick = () => { if (currentPage < totalPages) onPageChange(currentPage + 1); };

  let btnsHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    const activeStyle = i === currentPage 
      ? 'background:var(--primary); color:#1f2937;' 
      : 'background:#f0f0f0; color:#333;';
    btnsHtml += `<button type="button" style="padding:5px 11px; border:none; border-radius:4px; cursor:pointer; font-weight:600; ${activeStyle}" onclick="(${onPageChange})(${i})">${i}</button>`;
  }
  numbersWrap.innerHTML = btnsHtml;
}

/* ============================================================
   PRODUCT CRUD & MANAGEMENT (PAGINATED)
   ============================================================ */
function renderAdminProductsTable() {
  const tbody = document.getElementById('adminProductsTbody');
  if (!tbody) return;

  const products = lsGet(LS_KEYS.PRODUCTS, []);
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (currentProductsPage > totalPages) currentProductsPage = totalPages;
  if (currentProductsPage < 1) currentProductsPage = 1;

  const start = (currentProductsPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = products.slice(start, end);

  if (!paginatedProducts.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px;">No products found.</td></tr>`;
  } else {
    tbody.innerHTML = paginatedProducts.map(p => `
      <tr>
        <td><img src="${p.image || 'https://via.placeholder.com/40'}" width="40" height="40" style="object-fit:cover; border-radius:6px;"></td>
        <td><strong>${escapeHtml(p.brand)}</strong></td>
        <td>${escapeHtml(p.model)}</td>
        <td>${formatPrice(getMinStorageOption(p).price)}</td>
        <td>${p.stock}</td>
        <td>${getStockBadgeHtml(p.stock)}</td>
        <td>
          <button class="btn-sm" onclick="openProductModal('${p.id}')" style="background:#3a86ff; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Edit</button>
          <button class="btn-sm btn-danger" onclick="confirmDeleteProduct('${p.id}')" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  renderPaginationUI(
    'productsPaginationInfo', 'productsPrevBtn', 'productsNextBtn', 'productsPageNumbers',
    totalItems, totalPages, currentProductsPage,
    (newPage) => { currentProductsPage = newPage; renderAdminProductsTable(); }
  );
}

function confirmDeleteProduct(id) {
  const products = lsGet(LS_KEYS.PRODUCTS, []);
  const product = products.find(p => p.id === id);
  if (!product) return;

  // ជំនួស window.confirm ជាមួយ SweetAlert2 ដ៏ស្រស់ស្អាត
  Swal.fire({
    title: 'Are you sure?',
    text: `You want to delete this product: "${product.model}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      const updated = products.filter(p => p.id !== id);
      lsSet(LS_KEYS.PRODUCTS, updated);
      showToast('Product deleted.', 'success');
      renderDashboardStats();
      renderSalesStatistics();
      renderAdminProductsTable();
    }
  });
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

    const products = lsGet(LS_KEYS.PRODUCTS, []);

    if (id) {
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          brand, model, category, ram, stock,
          image: image || 'https://via.placeholder.com/150',
          description, colors, storageOptions,
          isNew: document.getElementById('pfIsNew').checked,
          isFeatured: document.getElementById('pfIsFeatured').checked,
          isOffer: discount > 0
        };
        showToast('Product updated successfully.', 'success');
      }
    } else {
      const newProduct = {
        id: generateId('p'),
        brand, model, category, ram, stock,
        image: image || 'https://via.placeholder.com/150',
        description, colors, storageOptions,
        isNew: document.getElementById('pfIsNew').checked,
        isFeatured: document.getElementById('pfIsFeatured').checked,
        isOffer: discount > 0,
        rating: 5.0, createdAt: Date.now()
      };
      products.unshift(newProduct);
      showToast('Product added successfully.', 'success');
    }

    lsSet(LS_KEYS.PRODUCTS, products);
    closeProductModal();
    renderDashboardStats();
    renderSalesStatistics();
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
  const products = lsGet(LS_KEYS.PRODUCTS, []);
  const product = id ? products.find(p => p.id === id) : null;

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
    document.getElementById('pfStorage').value = (product.storageOptions || []).map(s => typeof s === 'object' ? s.size : s).join(', ');
    document.getElementById('pfColors').value = (product.colors || []).join(', ');
    document.getElementById('pfImage').value = product.image || '';
    document.getElementById('pfDescription').value = product.description || '';
    document.getElementById('pfStock').value = product.stock != null ? product.stock : 0;
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
   ADMIN ORDER MANAGEMENT & STATUS UPDATE (PAGINATED)
   ============================================================ */
function renderAdminOrdersTable() {
  const tbody = document.getElementById('adminOrdersTbody');
  if (!tbody) return;

  const orders = lsGet(LS_KEYS.ORDERS, []);
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (currentOrdersPage > totalPages) currentOrdersPage = totalPages;
  if (currentOrdersPage < 1) currentOrdersPage = 1;

  const start = (currentOrdersPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedOrders = orders.slice(start, end);

  if (!paginatedOrders.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px;">No orders yet.</td></tr>`;
  } else {
    const ORDER_STATUSES = ['Pending', 'Completed', 'Cancelled'];

    tbody.innerHTML = paginatedOrders.map(o => {
      const items = o.items || o.products || [];
      const itemsHtml = items.map(p => `${escapeHtml(p.model || p.name || 'Item')} × ${p.quantity || p.qty || 1}`).join('<br>');
      const currentStatus = o.status || 'Pending';

      return `
        <tr>
          <td>#${escapeHtml(o.id || '')}</td>
          <td>${escapeHtml(o.customerName || o.userEmail || 'Guest')}</td>
          <td>${itemsHtml || 'No items'}</td>
          <td>${escapeHtml(o.paymentMethod || 'COD')}</td>
          <td>${formatPrice(o.totalAmount || o.total || 0)}</td>
          <td>
            <select onchange="handleAdminStatusChange('${o.id}', this.value)" style="padding:4px 8px; border-radius:4px; border:1px solid #ccc;">
              ${ORDER_STATUSES.map(s => `<option value="${s}" ${currentStatus.toLowerCase() === s.toLowerCase() ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderPaginationUI(
    'ordersPaginationInfo', 'ordersPrevBtn', 'ordersNextBtn', 'ordersPageNumbers',
    totalItems, totalPages, currentOrdersPage,
    (newPage) => { currentOrdersPage = newPage; renderAdminOrdersTable(); }
  );
}

function handleAdminStatusChange(orderId, newStatus) {
  const orders = lsGet(LS_KEYS.ORDERS, []);
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const wasCancelled = (order.status || '').toLowerCase() === 'cancelled';
  const isNowCancelled = newStatus.toLowerCase() === 'cancelled';

  const items = order.items || order.products || [];

  if (isNowCancelled && !wasCancelled) {
    items.forEach(p => restoreStock(p.productId || p.id, p.quantity || p.qty || 1));
  } else if (!isNowCancelled && wasCancelled) {
    items.forEach(p => decreaseStock(p.productId || p.id, p.quantity || p.qty || 1));
  }

  order.status = newStatus;
  lsSet(LS_KEYS.ORDERS, orders);
  showToast(`Order #${orderId} changed to ${newStatus}`, 'success');
  
  renderDashboardStats();
  renderSalesStatistics();
  renderAdminProductsTable();
  renderAdminOrdersTable();
}

/* ============================================================
   USER MANAGEMENT (PAGINATED)
   ============================================================ */
function renderAdminUsersTable() {
  const tbody = document.getElementById('adminUsersTbody');
  if (!tbody) return;

  const users = lsGet(LS_KEYS.USERS, []);
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (currentUsersPage > totalPages) currentUsersPage = totalPages;
  if (currentUsersPage < 1) currentUsersPage = 1;

  const start = (currentUsersPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedUsers = users.slice(start, end);

  if (!paginatedUsers.length) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:24px;">No users found.</td></tr>`;
  } else {
    tbody.innerHTML = paginatedUsers.map(u => {
      const roleBadge = u.role === 'admin' || u.name === 'admin' || u.email === 'admin@angkormass.com'
        ? '<span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px; font-size:12px;">Admin</span>'
        : '<span style="background:#e2e8f0; color:#333; padding:2px 6px; border-radius:4px; font-size:12px;">User</span>';

      return `
        <tr>
          <td><strong>${escapeHtml(u.name || 'User')}</strong></td>
          <td>${escapeHtml(u.email || '')}</td>
          <td>${roleBadge}</td>
        </tr>
      `;
    }).join('');
  }

  renderPaginationUI(
    'usersPaginationInfo', 'usersPrevBtn', 'usersNextBtn', 'usersPageNumbers',
    totalItems, totalPages, currentUsersPage,
    (newPage) => { currentUsersPage = newPage; renderAdminUsersTable(); }
  );
}

/* ---------- Document Ready Event ---------- */
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('adminMainWrap')) {
    initAdminPage();
  }
});