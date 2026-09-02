/* ============================================================
   products.js — Product Catalog, Stock Badges & Buy Now Popup
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
    image: "https://i.pinimg.com/736x/9c/8d/de/9c8dde3df0d159f8fa0b1f245b997713.jpg",
    colors: ["Natural Titanium", "Black Titanium", "White Titanium"],
    storageOptions: [
      { size: "256GB", price: 1199, was: 1299 },
      { size: "512GB", price: 1399, was: 1499 }
    ]
  },
  {
    id: "p102",
    brand: "Apple",
    model: "iPhone 16 Pro",
    category: "Smartphones",
    stock: 10,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    image: "https://i.pinimg.com/1200x/a0/a2/8f/a0a28ffa0e4b93d10b37b4d9b73eba14.jpg",
    colors: ["Natural Titanium", "Desert Titanium"],
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
    image: "https://i.pinimg.com/1200x/74/9c/7f/749c7f31445b165258c4e491703c1b02.jpg",
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
    image: "https://i.pinimg.com/1200x/b4/17/57/b4175791e611cc3a44867c0e57bd67e0.jpg",
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
    image: "https://i.pinimg.com/736x/24/57/77/2457778e56d891f4b0cc73d498ae647a.jpg",
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
    image: "https://i.pinimg.com/736x/ce/c8/05/cec805810b06e68eaa3d3356e91a96cd.jpg",
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
    image: "https://i.pinimg.com/736x/68/7e/a2/687ea2a1169c2a4410843fda1abc1e06.jpg",
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
    image: "https://i.pinimg.com/736x/a1/17/39/a11739febc2165d8586f4b761f7efa54.jpg",
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
    image: "https://i.pinimg.com/736x/dc/7a/df/dc7adfab20b8d24c84b804f4fadee07f.jpg",
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
    image: "https://i.pinimg.com/1200x/f4/54/0a/f4540af19cef8f3f7e3b02717fe2df16.jpg",
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
    image: "https://i.pinimg.com/736x/a7/c8/62/a7c86211d969b80cabf391755b378c37.jpg",
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
    image: "https://i.pinimg.com/1200x/a2/ce/2c/a2ce2c071e9d6451929d37fa28fbf3b5.jpg",
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
    image: "https://i.pinimg.com/736x/06/16/8f/06168f862712bdd98e0a499cb0bb5493.jpg",
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
    image: "https://i.pinimg.com/1200x/2b/70/e5/2b70e553cc5a2645910f43d87adf8695.jpg",
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
    image: "https://i.pinimg.com/736x/40/37/f4/4037f4af412a10b8b3b33e09966efa11.jpg",
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
    image: "https://i.pinimg.com/736x/f3/8c/45/f38c45f64a3698d8d72ed570800cf867.jpg",
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
    image: "https://i.pinimg.com/736x/1c/ef/5e/1cef5e55149e38f013cb0e651b473ac5.jpg",
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
    image: "https://i.pinimg.com/736x/9c/33/31/9c3331ab44dcf33ccb04b028e2075d88.jpg",
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
    image: "https://i.pinimg.com/1200x/36/3f/65/363f65bbd90cc246c2c843e9e919452b.jpg",
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
    image: "https://i.pinimg.com/736x/0c/be/a2/0cbea28ee5ebcbb05f5bae393ea7c714.jpg",
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
  
  // Reload if no data, or if items aren't 20, or if old format exists
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
  const wished = typeof isInWishlist === 'function' && typeof isLoggedIn === 'function' && isLoggedIn() && isInWishlist(product.id);
  const escapeStr = str => (str ? String(str).replace(/"/g, '&quot;') : '');
  const fmtPrice = val => (typeof formatPrice === 'function' ? formatPrice(val) : '$' + val);

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="img-wrap">
        ${product.isNew ? `<span class="badge-tag">New</span>` : ''}
        ${getStockBadgeHtml(product.stock)}
        <img src="${product.image || PLACEHOLDER_IMG}" alt="${escapeStr(product.model)}" onerror="this.src='${PLACEHOLDER_IMG}'">
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
        <button class="btn-sm" style="width:100%; margin:8px 0 0; text-align:center;" data-action="toggle-wishlist" data-id="${product.id}">
          ${wished ? '♥ In Wishlist' : '♡ Add to Wishlist'}
        </button>
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
    grid.innerHTML = `<div class="no-result">😕 No products found matching your search.</div>`;
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
   BUY NOW POPUP / MODAL
   ============================================================ */
function openBuyNowModal(productId) {
  if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
    if (typeof showToast === 'function') showToast('Please log in to purchase.', 'error');
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

    modal.innerHTML = `
      <div class="modal-card">
        <button class="close-modal-btn" id="closeBuyModal">&times;</button>
        <div class="modal-header">
          <img src="${product.image || PLACEHOLDER_IMG}" onerror="this.src='${PLACEHOLDER_IMG}'">
          <div>
            <h3>${product.brand} ${product.model}</h3>
            ${getStockBadgeHtml(product.stock)}
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
          <button class="btn-confirm" id="confirmBuyModal">Continue to Checkout</button>
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
      const buyNowPayload = {
        productId: product.id,
        brand: product.brand,
        model: product.model,
        image: product.image,
        color: selectedColor,
        storage: selectedStorage.size,
        price: selectedStorage.price,
        qty: quantity
      };

      if (typeof lsSet === 'function') {
        lsSet('buyNowItem', buyNowPayload);
      } else {
        localStorage.setItem('buyNowItem', JSON.stringify(buyNowPayload));
      }
      modal.classList.remove('open');
      window.location.href = 'checkout.html?mode=buynow';
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
    openBuyNowModal(productId);
  }

  if (action === 'add-cart') {
    const product = getProductById(productId);
    const minOpt = getMinStorageOption(product);
    if (typeof addToCart === 'function') {
      addToCart({
        productId: product.id,
        brand: product.brand,
        model: product.model,
        image: product.image,
        color: (product.colors && product.colors[0]) || 'Default',
        storage: minOpt.size,
        price: minOpt.price,
        qty: 1
      });
    }
  }

  if (action === 'toggle-wishlist') {
    if (typeof toggleWishlistItem === 'function') {
      toggleWishlistItem(productId);
      if (document.getElementById('productGrid') || document.getElementById('products-grid')) refreshCatalog();
      if (document.getElementById('wishlistGrid') && typeof renderWishlistPage === 'function') renderWishlistPage();
      if (document.getElementById('featuredGrid')) renderHomeSections();
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