/* ============================================================
   products.js — Product Catalog, Stock Badges & Product Options Popup
   ============================================================ */

const PLACEHOLDER_IMG = 'https://placehold.co/400x400/f4f0e4/a9781e?text=No+Image';
let catalogState = { query: '', category: 'All', brand: 'All' };

/* ============================================================
   DEFAULT PRODUCT CATALOG DATA (20 Smartphones)
   ============================================================ */
const INITIAL_PRODUCTS = [
  // --- APPLE (5 Products) ---
  {
    id: "p101",
    brand: "Apple",
    model: "iPhone 16 Pro Max",
    category: "Smartphones",
    stock: 12,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    image: "../image/16ProMax.webp",
    colors: ["Natural Titanium", "Black Titanium", "White Titanium"],
    storageOptions: [
      { size: "256GB", price: 1199, was: 1299 },
      { size: "512GB", price: 1399, was: 1499 }
    ]
  },
  {
    id: "p102",
    brand: "Apple",
    model: "iPhone 17 Pro Max",
    category: "Smartphones",
    stock: 10,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    image: "../image/17ProMax.webp",
    colors: ["Natural Titanium", "Blue Titanium","Orange"],
    storageOptions: [
      { size: "128GB", price: 999, was: 1099 },
      { size: "256GB", price: 1099, was: 1199 }
    ]
  },
  {
    id: "p103",
    brand: "Apple",
    model: "iPhone 16",
    category: "Smartphones",
    stock: 15,
    isNew: true,
    isFeatured: false,
    rating: 4.7,
    image: "../image/iPhone16.webp",
    colors: ["Ultramarine", "Teal", "Pink"],
    storageOptions: [
      { size: "128GB", price: 799, was: 849 }
    ]
  },
  {
    id: "p104",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    category: "Smartphones",
    stock: 8,
    isNew: false,
    isFeatured: true,
    rating: 4.8,
    image: "../image/iPhone15ProMax.webp",
    colors: ["Natural Titanium", "Blue Titanium"],
    storageOptions: [
      { size: "256GB", price: 1099, was: 1199 }
    ]
  },
  {
    id: "p105",
    brand: "Apple",
    model: "iPhone 15",
    category: "Smartphones",
    stock: 20,
    isNew: false,
    isFeatured: false,
    rating: 4.6,
    image: "../image/iPhone15.webp",
    colors: ["Pink", "Yellow", "Green", "Blue", "Black"],
    storageOptions: [
      { size: "128GB", price: 699, was: 799 }
    ]
  },

  // --- SAMSUNG (5 Products) ---
  {
    id: "p106",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    category: "Smartphones",
    stock: 14,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    image: "../image/GalaxyS24Ultra.webp",
    colors: ["Titanium Gray", "Titanium Black"],
    storageOptions: [
      { size: "256GB", price: 1299, was: 1399 }
    ]
  },
  {
    id: "p107",
    brand: "Samsung",
    model: "Galaxy S24+",
    category: "Smartphones",
    stock: 9,
    isNew: true,
    isFeatured: false,
    rating: 4.7,
    image: "../image/GalaxyS24+.webp",
    colors: ["Onyx Black", "Marble Gray"],
    storageOptions: [
      { size: "256GB", price: 999, was: 1099 }
    ]
  },
  {
    id: "p108",
    brand: "Samsung",
    model: "Galaxy S24",
    category: "Smartphones",
    stock: 11,
    isNew: true,
    isFeatured: false,
    rating: 4.6,
    image: "../image/GalaxyS24.webp",
    colors: ["Cobalt Violet", "Amber Yellow"],
    storageOptions: [
      { size: "128GB", price: 799, was: 849 }
    ]
  },
  {
    id: "p109",
    brand: "Samsung",
    model: "Galaxy Z Fold 6",
    category: "Smartphones",
    stock: 4,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    image: "../image/GalaxyZFold6.webp",
    colors: ["Navy", "Silver Shadow"],
    storageOptions: [
      { size: "256GB", price: 1799, was: 1899 }
    ]
  },
  {
    id: "p110",
    brand: "Samsung",
    model: "Galaxy Z Flip 6",
    category: "Smartphones",
    stock: 0,
    isNew: true,
    isFeatured: false,
    rating: 4.5,
    image: "../image/Galaxy Z Flip 6.webp",
    colors: ["Blue", "Mint"],
    storageOptions: [
      { size: "256GB", price: 999, was: 1099 }
    ]
  },

  // --- OPPO (5 Products) ---
  {
    id: "p111",
    brand: "Oppo",
    model: "Find X7 Ultra",
    category: "Smartphones",
    stock: 6,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    image: "../image/FindX7Ultra.webp",
    colors: ["Ocean Blue", "Sepia Brown", "Tailored Black"],
    storageOptions: [
      { size: "256GB", price: 950, was: 1100 }
    ]
  },
  {
    id: "p112",
    brand: "Oppo",
    model: "Find N3 Fold",
    category: "Smartphones",
    stock: 5,
    isNew: false,
    isFeatured: false,
    rating: 4.7,
    image: "../image/FindN3Fold.webp",
    colors: ["Champagne Gold", "Classic Black"],
    storageOptions: [
      { size: "512GB", price: 1499, was: 1699 }
    ]
  },
  {
    id: "p113",
    brand: "Oppo",
    model: "Reno 12 Pro",
    category: "Smartphones",
    stock: 18,
    isNew: true,
    isFeatured: false,
    rating: 4.6,
    image: "../image/Reno12Pro.webp",
    colors: ["Nebula Silver", "Space Brown"],
    storageOptions: [
      { size: "256GB", price: 549, was: 599 }
    ]
  },
  {
    id: "p114",
    brand: "Oppo",
    model: "Reno 12",
    category: "Smartphones",
    stock: 15,
    isNew: true,
    isFeatured: false,
    rating: 4.5,
    image: "../image/Reno12.webp",
    colors: ["Astro Silver", "Matte Brown"],
    storageOptions: [
      { size: "256GB", price: 449, was: 499 }
    ]
  },
  {
    id: "p115",
    brand: "Oppo",
    model: "A3 Pro",
    category: "Smartphones",
    stock: 22,
    isNew: true,
    isFeatured: false,
    rating: 4.4,
    image: "../image/A3Pro.webp",
    colors: ["Ocean Blue", "Mountain Blue"],
    storageOptions: [
      { size: "256GB", price: 299, was: 349 }
    ]
  },

  // --- HUAWEI (5 Products) ---
  {
    id: "p116",
    brand: "Huawei",
    model: "Pura 70 Ultra",
    category: "Smartphones",
    stock: 5,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    image: "../image/Pura70Ultra.webp",
    colors: ["Chanson Green", "Mocha Brown", "Star Black"],
    storageOptions: [
      { size: "512GB", price: 1399, was: 1499 }
    ]
  },
  {
    id: "p117",
    brand: "Huawei",
    model: "Pura 70 Pro",
    category: "Smartphones",
    stock: 7,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    image: "../image/Pura70Pro.webp",
    colors: ["Roland Purple", "Snow White", "Feather Black"],
    storageOptions: [
      { size: "512GB", price: 999, was: 1199 }
    ]
  },
  {
    id: "p118",
    brand: "Huawei",
    model: "Pura 70",
    category: "Smartphones",
    stock: 10,
    isNew: true,
    isFeatured: false,
    rating: 4.6,
    image: "../image/Pura70.webp",
    colors: ["Cherry Rose Pink", "Ice White", "Black"],
    storageOptions: [
      { size: "256GB", price: 799, was: 899 }
    ]
  },
  {
    id: "p119",
    brand: "Huawei",
    model: "Mate X5 Fold",
    category: "Smartphones",
    stock: 2,
    isNew: false,
    isFeatured: false,
    rating: 4.7,
    image: "../image/MateX5Fold.webp",
    colors: ["Feather Red", "Feather White"],
    storageOptions: [
      { size: "512GB", price: 1799, was: 1999 }
    ]
  },
  {
    id: "p120",
    brand: "Huawei",
    model: "Nova 12 Pro",
    category: "Smartphones",
    stock: 12,
    isNew: true,
    isFeatured: false,
    rating: 4.5,
    image: "../image/Nova12Pro.webp",
    colors: ["Color 11", "Obsidian Black"],
    storageOptions: [
      { size: "256GB", price: 549, was: 599 }
    ]
  }
];

/* Force loading fresh smartphone catalog into LocalStorage */
function loadProducts() {
  const key = (typeof LS_KEYS !== 'undefined' && LS_KEYS.PRODUCTS) ? LS_KEYS.PRODUCTS : 'products_v2';
  const existing = typeof lsGet === 'function' ? lsGet(key, null) : null;
  
  if (!existing || existing.length !== INITIAL_PRODUCTS.length || (existing[0] && existing[0].id !== "p101")) {
    saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  return existing;
}

function saveProducts(products) { 
  const key = (typeof LS_KEYS !== 'undefined' && LS_KEYS.PRODUCTS) ? LS_KEYS.PRODUCTS : 'products_v2';
  if (typeof lsSet === 'function') {
    lsSet(key, products); 
  } else {
    localStorage.setItem(key, JSON.stringify(products));
  }
}

function getProductById(id) { 
  return loadProducts().find(p => p.id === id) || null; 
}

function addProduct(payload) {
  const products = loadProducts();
  const newP = { id: (typeof generateId === 'function' ? generateId('p') : 'p_' + Date.now()), ...payload, createdAt: Date.now() };
  products.unshift(newP);
  saveProducts(products);
  return newP;
}

function updateProduct(id, payload) {
  const products = loadProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...payload };
    saveProducts(products);
  }
}

function deleteProduct(id) {
  const products = loadProducts().filter(p => p.id !== id);
  saveProducts(products);
}

function decreaseStock(productId, qty) {
  const p = getProductById(productId);
  if (p) {
    p.stock = Math.max(0, p.stock - qty);
    updateProduct(productId, { stock: p.stock });
  }
}

function restoreStock(productId, qty) {
  const p = getProductById(productId);
  if (p) {
    p.stock += qty;
    updateProduct(productId, { stock: p.stock });
  }
}

/* ---------- Function សម្រាប់ Admin ថែមស្តុក ---------- */
function addStock(productId, qty) {
  const p = getProductById(productId);
  if (p) {
    p.stock = (parseInt(p.stock) || 0) + parseInt(qty);
    updateProduct(productId, { stock: p.stock });
    return p.stock;
  }
  return 0;
}

function getMinStorageOption(product) {
  if (!product.storageOptions || !product.storageOptions.length) {
    return { size: '-', price: product.price || 0, was: product.was || product.price || 0 };
  }
  return product.storageOptions.reduce((min, o) => (o.price < min.price ? o : min), product.storageOptions[0]);
}

/* ============================================================
   STOCK DISPLAY & STATUS BADGES
   ============================================================ */
function getStockBadgeHtml(stock) {
  if (stock <= 0) return `<span class="badge-stock out">Out of Stock</span>`;
  if (stock <= 5) return `<span class="badge-stock low">Low Stock (${stock} left)</span>`;
  return `<span class="badge-stock in">In Stock</span>`;
}

function buildProductCard(product) {
  const minOpt = getMinStorageOption(product);
  const outOfStock = product.stock <= 0;
  const escapeStr = str => (str ? String(str).replace(/"/g, '&quot;') : '');
  const fmtPrice = val => (typeof formatPrice === 'function' ? formatPrice(val) : '$' + val);

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="img-wrap">
        ${product.isNew ? `<span class="badge-tag">New</span>` : ''}
        ${getStockBadgeHtml(product.stock)}
        <img height="180px" src="${product.image || PLACEHOLDER_IMG}" alt="${escapeStr(product.model)}" onerror="this.src='${PLACEHOLDER_IMG}'">
      </div>
      <div class="product-info">
        <span class="brand-title">${escapeStr(product.brand)}</span>
        <h3 class="product-name">${escapeStr(product.model)}</h3>
        <div class="price-row">
          <span class="price-now">${fmtPrice(minOpt.price)}</span>
          ${minOpt.was > minOpt.price ? `<span class="price-was">${fmtPrice(minOpt.was)}</span>` : ''}
        </div>
        <div class="card-actions">
          <button class="add-cart-btn" data-action="add-cart" data-id="${product.id}" ${outOfStock ? 'disabled' : ''}>
            ${outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button class="buy-now-btn" data-action="buy-now" data-id="${product.id}" ${outOfStock ? 'disabled' : ''}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  `;
}

function refreshCatalog() {
  const grid = document.getElementById('productGrid') || document.getElementById('products-grid');
  if (!grid) return;

  let products = loadProducts();

  if (catalogState.query) {
    const q = catalogState.query.trim().toLowerCase();
    products = products.filter(p =>
      (p.brand || '').toLowerCase().includes(q) ||
      (p.model || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }

  if (catalogState.category && catalogState.category !== 'All') {
    products = products.filter(p => p.category === catalogState.category);
  }

  if (catalogState.brand && catalogState.brand !== 'All') {
    products = products.filter(p => (p.brand || '').toLowerCase() === catalogState.brand.toLowerCase());
  }

  if (!products.length) {
    grid.innerHTML = `<div class="no-result"> No products found matching your search.</div>`;
    return;
  }

  grid.innerHTML = products.map(buildProductCard).join('');
}

/* ---------- Brand tile filter ---------- */
function initBrandTiles() {
  const tiles = document.querySelectorAll('.brand-tile[data-brand]');
  if (!tiles.length) return;
  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      tiles.forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
      const brand = tile.dataset.brand;
      catalogState.brand = (brand === 'all') ? 'All' : brand;
      refreshCatalog();
    });
  });
}

/* ============================================================
   HOME PAGE — Featured / Popular / New / Special Offers
   ============================================================ */
function renderHomeSections() {
  const products = loadProducts();
  const map = {
    featuredGrid: p => p.isFeatured,
    popularGrid: p => (p.rating || 0) >= 4.6,
    newGrid: p => p.isNew,
    offersGrid: p => {
      const opt = getMinStorageOption(p);
      return p.isOffer || (opt.was && opt.was > opt.price);
    }
  };

  Object.entries(map).forEach(([gridId, filterFn]) => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const list = products.filter(filterFn).slice(0, 4);
    grid.innerHTML = list.length
      ? list.map(buildProductCard).join('')
      : `<div class="no-result">No products in this section yet.</div>`;
  });
}

/* ============================================================
   PRODUCT OPTIONS POPUP (Used for both "Add to Cart" and "Buy Now")
   ============================================================ */
function openOptionModal(productId, mode = 'cart') {
  if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
    if (typeof showToast === 'function') showToast('Please log in first.', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 500);
    return;
  }

  const product = getProductById(productId);
  if (!product || product.stock <= 0) {
    if (typeof showToast === 'function') showToast('Sorry, product is out of stock.', 'error');
    return;
  }

  let modal = document.getElementById('buyNowModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'buyNowModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const colors = product.colors && product.colors.length ? product.colors : ['Standard'];
  const storageOptions = product.storageOptions && product.storageOptions.length
    ? product.storageOptions
    : [{ size: 'Default', price: product.price || 0 }];

  let selectedColor = colors[0];
  let selectedStorage = storageOptions[0];
  let quantity = 1;
  const fmtPrice = val => (typeof formatPrice === 'function' ? formatPrice(val) : '$' + val);

  function renderModalContent() {
    const subtotal = selectedStorage.price * quantity;
    const confirmBtnText = mode === 'buynow' ? 'Continue to Checkout' : 'Add to Cart';

    modal.innerHTML = `
      <div class="modal-card">
        <button class="close-modal-btn" id="closeBuyModal">&times;</button>
        <div class="modal-header">
          <img src="${product.image || PLACEHOLDER_IMG}" onerror="this.src='${PLACEHOLDER_IMG}'">
          <div>
            <h3>${product.brand} ${product.model}</h3>
          </div>
        </div>

        <div class="modal-body">
          <div class="option-group-wrap">
            <label>Color</label>
            <div class="btn-group">
              ${colors.map(c => `
                <button class="opt-btn ${c === selectedColor ? 'active' : ''}" data-color="${c}">${c}</button>
              `).join('')}
            </div>
          </div>

          <div class="option-group-wrap">
            <label>Storage</label>
            <div class="btn-group">
              ${storageOptions.map((s, idx) => `
                <button class="opt-btn ${s.size === selectedStorage.size ? 'active' : ''}" data-storage-idx="${idx}">
                  ${s.size} (${fmtPrice(s.price)})
                </button>
              `).join('')}
            </div>
          </div>

          <div class="option-group-wrap">
            <label>Quantity</label>
            <div class="qty-picker">
              <button id="qtyMinus" ${quantity <= 1 ? 'disabled' : ''}>-</button>
              <span>${quantity}</span>
              <button id="qtyPlus" ${quantity >= product.stock ? 'disabled' : ''}>+</button>
            </div>
          </div>

          <div class="subtotal-row">
            <span>Subtotal</span>
            <strong class="subtotal-val">${fmtPrice(subtotal)}</strong>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" id="cancelBuyModal">Cancel</button>
          <button class="btn-confirm" id="confirmBuyModal">${confirmBtnText}</button>
        </div>
      </div>
    `;

    document.getElementById('closeBuyModal').onclick = () => modal.classList.remove('open');
    document.getElementById('cancelBuyModal').onclick = () => modal.classList.remove('open');

    modal.querySelectorAll('[data-color]').forEach(btn => {
      btn.onclick = () => { selectedColor = btn.dataset.color; renderModalContent(); };
    });

    modal.querySelectorAll('[data-storage-idx]').forEach(btn => {
      btn.onclick = () => { selectedStorage = storageOptions[btn.dataset.storageIdx]; renderModalContent(); };
    });

    document.getElementById('qtyMinus').onclick = () => { if (quantity > 1) { quantity--; renderModalContent(); } };
    document.getElementById('qtyPlus').onclick = () => { if (quantity < product.stock) { quantity++; renderModalContent(); } };

    document.getElementById('confirmBuyModal').onclick = () => {
      const payload = {
        productId: product.id,
        brand: product.brand,
        model: product.model,
        image: product.image,
        color: selectedColor,
        storage: selectedStorage.size,
        price: selectedStorage.price,
        qty: quantity
      };

      if (mode === 'buynow') {
        if (typeof lsSet === 'function') {
          lsSet('buyNowItem', payload);
        } else {
          localStorage.setItem('buyNowItem', JSON.stringify(payload));
        }
        modal.classList.remove('open');
        window.location.href = 'checkout.html?mode=buynow';
      } else {
        if (typeof addToCart === 'function') {
          addToCart(payload);
        }
        modal.classList.remove('open');
        if (typeof openCartDrawer === 'function') {
          openCartDrawer();
        } else if (typeof openCartSidebar === 'function') {
          openCartSidebar();
        }
      }
    };
  }

  renderModalContent();
  modal.classList.add('open');
}

/* ---------- Global Click Delegation ---------- */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const productId = btn.dataset.id;

  if (action === 'buy-now') {
    openOptionModal(productId, 'buynow');
  }

  if (action === 'add-cart') {
    openOptionModal(productId, 'cart');
  }

  // ទទួល Event សម្រាប់ការចុចប៊ូតុង add-stock ក្នុង Admin
  if (action === 'add-stock') {
    const product = getProductById(productId);
    if (!product) return;

    const inputQty = prompt(`បន្ថែមចំនួនស្តុកសម្រាប់: ${product.brand} ${product.model}\nបញ្ចូលចំនួន:`, "10");
    if (inputQty !== null) {
      const qtyToAdd = parseInt(inputQty, 10);
      if (!isNaN(qtyToAdd) && qtyToAdd > 0) {
        const newStock = addStock(productId, qtyToAdd);
        if (typeof showToast === 'function') {
          showToast(`បានបន្ថែមស្តុកជោគជ័យ! ស្តុកសរុប: ${newStock}`, 'success');
        } else {
          alert(`បានបន្ថែមស្តុកជោគជ័យ! ស្តុកសរុប: ${newStock}`);
        }
        // Refresh ទំព័រ Admin ឬ Render តារាងឡើងវិញ
        if (typeof renderAdminProducts === 'function') {
          renderAdminProducts();
        } else {
          location.reload();
        }
      } else {
        alert('សូមបញ្ចូលចំនួនជាលេខដែលមានតម្លៃធំជាង 0!');
      }
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  loadProducts();
  if (document.getElementById('productGrid') || document.getElementById('products-grid')) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      catalogState.query = q;
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = q;
    }
    initBrandTiles();
    refreshCatalog();
  }
  if (document.getElementById('featuredGrid')) {
    renderHomeSections();
  }
});