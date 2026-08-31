/* ============================================================
   products.js — Product Catalog, Stock Badges & Buy Now Popup
   ============================================================ */

const INITIAL_PRODUCTS = [
  // --- APPLE PHONES (5) ---
  {
    id: "p101",
    brand: "Apple",
    model: "iPhone 16 Pro Max",
    category: "Smartphones",
    stock: 12,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop",
    colors: ["Natural Titanium", "Black Titanium", "White Titanium"],
    storageOptions: [
      { size: "256GB", price: 1199, was: 1299 },
      { size: "512GB", price: 1399, was: 1499 }
    ]
  },
  {
    id: "p102",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    category: "Smartphones",
    stock: 8,
    isNew: false,
    isFeatured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop",
    colors: ["Natural Titanium", "Blue Titanium"],
    storageOptions: [
      { size: "256GB", price: 1099, was: 1199 }
    ]
  },
  {
    id: "p103",
    brand: "Apple",
    model: "iPhone 15",
    category: "Smartphones",
    stock: 15,
    isNew: false,
    isFeatured: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop",
    colors: ["Pink", "Yellow", "Black"],
    storageOptions: [
      { size: "128GB", price: 799, was: 899 }
    ]
  },
  {
    id: "p104",
    brand: "Apple",
    model: "iPhone 14 Pro",
    category: "Smartphones",
    stock: 6,
    isNew: false,
    isFeatured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500&auto=format&fit=crop",
    colors: ["Deep Purple", "Gold", "Space Black"],
    storageOptions: [
      { size: "128GB", price: 699, was: 799 }
    ]
  },
  {
    id: "p105",
    brand: "Apple",
    model: "iPhone SE (3rd Gen)",
    category: "Smartphones",
    stock: 10,
    isNew: false,
    isFeatured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop",
    colors: ["Midnight", "Starlight", "Red"],
    storageOptions: [
      { size: "64GB", price: 429, was: 479 }
    ]
  },

  // --- SAMSUNG PHONES (5) ---
  {
    id: "p106",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    category: "Smartphones",
    stock: 14,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop",
    colors: ["Titanium Gray", "Titanium Black"],
    storageOptions: [
      { size: "256GB", price: 1299, was: 1399 }
    ]
  },
  {
    id: "p107",
    brand: "Samsung",
    model: "Galaxy Z Fold 6",
    category: "Smartphones",
    stock: 4,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop",
    colors: ["Navy", "Silver Shadow"],
    storageOptions: [
      { size: "256GB", price: 1799, was: 1899 }
    ]
  },
  {
    id: "p108",
    brand: "Samsung",
    model: "Galaxy Z Flip 6",
    category: "Smartphones",
    stock: 0,
    isNew: true,
    isFeatured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop",
    colors: ["Blue", "Mint"],
    storageOptions: [
      { size: "256GB", price: 999, was: 1099 }
    ]
  },
  {
    id: "p109",
    brand: "Samsung",
    model: "Galaxy S23 FE",
    category: "Smartphones",
    stock: 11,
    isNew: false,
    isFeatured: false,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1533228876829-65c94e7b5025?w=500&auto=format&fit=crop",
    colors: ["Mint", "Graphite", "Purple"],
    storageOptions: [
      { size: "128GB", price: 599, was: 649 }
    ]
  },
  {
    id: "p110",
    brand: "Samsung",
    model: "Galaxy A55 5G",
    category: "Smartphones",
    stock: 20,
    isNew: false,
    isFeatured: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop",
    colors: ["Awesome Iceblue", "Awesome Navy"],
    storageOptions: [
      { size: "128GB", price: 449, was: 499 }
    ]
  },

  // --- OPPO PHONES (5) ---
  {
    id: "p111",
    brand: "Oppo",
    model: "Find X7 Ultra",
    category: "Smartphones",
    stock: 0,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&auto=format&fit=crop",
    colors: ["Nebula Silver", "Space Brown"],
    storageOptions: [
      { size: "256GB", price: 549, was: 599 }
    ]
  },
  {
    id: "p114",
    brand: "Oppo",
    model: "Reno 11 5G",
    category: "Smartphones",
    stock: 20,
    isNew: false,
    isFeatured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop",
    colors: ["Wave Green", "Rock Grey"],
    storageOptions: [
      { size: "256GB", price: 399, was: 449 }
    ]
  },
  {
    id: "p115",
    brand: "Oppo",
    model: "A98 5G",
    category: "Smartphones",
    stock: 12,
    isNew: false,
    isFeatured: false,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop",
    colors: ["Dreamy Blue", "Cool Black"],
    storageOptions: [
      { size: "256GB", price: 299, was: 349 }
    ]
  },

  // --- HUAWEI PHONES (5) ---
  {
    id: "p116",
    brand: "Huawei",
    model: "Huawei Pura 70 Pro",
    category: "Smartphones",
    stock: 5,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop",
    colors: ["Roland Purple", "Snow White", "Feather Black"],
    storageOptions: [
      { size: "512GB", price: 999, was: 1199 }
    ]
  },
  {
    id: "p117",
    brand: "Huawei",
    model: "Mate 60 Pro",
    category: "Smartphones",
    stock: 7,
    isNew: false,
    isFeatured: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&auto=format&fit=crop",
    colors: ["Green", "Silver", "Purple", "Black"],
    storageOptions: [
      { size: "512GB", price: 1099, was: 1249 }
    ]
  },
  {
    id: "p118",
    brand: "Huawei",
    model: "Mate X5 Fold",
    category: "Smartphones",
    stock: 2,
    isNew: false,
    isFeatured: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop",
    colors: ["Feather Red", "Feather White"],
    storageOptions: [
      { size: "512GB", price: 1799, was: 1999 }
    ]
  },
  {
    id: "p119",
    brand: "Huawei",
    model: "Nova 12 SE",
    category: "Smartphones",
    stock: 16,
    isNew: true,
    isFeatured: false,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop",
    colors: ["Emerald Green", "Black"],
    storageOptions: [
      { size: "256GB", price: 349, was: 399 }
    ]
  },
  {
    id: "p120",
    brand: "Huawei",
    model: "P60 Pro",
    category: "Smartphones",
    stock: 9,
    isNew: false,
    isFeatured: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop",
    colors: ["Rococo Pearl", "Black"],
    storageOptions: [
      { size: "256GB", price: 899, was: 999 }
    ]
  }
];

const PLACEHOLDER_IMG = 'https://placehold.co/400x400/f4f0e4/a9781e?text=No+Image';
let catalogState = { query: '', category: 'All', brand: 'All' };

function loadProducts() {
  let products = lsGet(LS_KEYS.PRODUCTS, null);
  if (!products || !products.length) {
    products = INITIAL_PRODUCTS;
    saveProducts(products);
  }
  return products;
}

function saveProducts(products) { lsSet(LS_KEYS.PRODUCTS, products); }
function getProductById(id) { return loadProducts().find(p => p.id === id) || null; }

function addProduct(payload) {
  const products = loadProducts();
  const newP = { id: generateId('p'), ...payload, createdAt: Date.now() };
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
   REQUIREMENT 12: STOCK DISPLAY & STATUS BADGES
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

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="img-wrap">
        ${product.isNew ? `<span class="badge-tag">New</span>` : ''}
        ${getStockBadgeHtml(product.stock)}
        <img src="${product.image || PLACEHOLDER_IMG}" alt="${escapeHtml(product.model)}" onerror="this.src='${PLACEHOLDER_IMG}'">
      </div>
      <div class="product-info">
        <span class="brand-title">${escapeHtml(product.brand)}</span>
        <h3 class="product-name">${escapeHtml(product.model)}</h3>
        <div class="price-row">
          <span class="price-now">${formatPrice(minOpt.price)}</span>
          ${minOpt.was > minOpt.price ? `<span class="price-was">${formatPrice(minOpt.was)}</span>` : ''}
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
  const grid = document.getElementById('productGrid');
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
   REQUIREMENT 5: BUY NOW POPUP / MODAL
   ============================================================ */
function openBuyNowModal(productId) {
  if (!isLoggedIn()) {
    showToast('Please log in to purchase.', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 500);
    return;
  }

  const product = getProductById(productId);
  if (!product || product.stock <= 0) {
    showToast('Sorry, product is out of stock.', 'error');
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

  function renderModalContent() {
    const subtotal = selectedStorage.price * quantity;

    modal.innerHTML = `
      <div class="modal-card">
        <button class="close-modal-btn" id="closeBuyModal">&times;</button>
        <div class="modal-header">
          <img src="${product.image || PLACEHOLDER_IMG}" onerror="this.src='${PLACEHOLDER_IMG}'">
          <div>
            <h3>${escapeHtml(product.brand)} ${escapeHtml(product.model)}</h3>
            ${getStockBadgeHtml(product.stock)}
          </div>
        </div>

        <div class="modal-body">
          <div class="option-group-wrap">
            <label>Color</label>
            <div class="btn-group">
              ${colors.map(c => `
                <button class="opt-btn ${c === selectedColor ? 'active' : ''}" data-color="${escapeHtml(c)}">${escapeHtml(c)}</button>
              `).join('')}
            </div>
          </div>

          <div class="option-group-wrap">
            <label>Storage</label>
            <div class="btn-group">
              ${storageOptions.map((s, idx) => `
                <button class="opt-btn ${s.size === selectedStorage.size ? 'active' : ''}" data-storage-idx="${idx}">
                  ${escapeHtml(s.size)} (${formatPrice(s.price)})
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
            <strong class="subtotal-val">${formatPrice(subtotal)}</strong>
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

      lsSet('buyNowItem', buyNowPayload);
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
      if (document.getElementById('productGrid')) refreshCatalog();
      if (document.getElementById('wishlistGrid') && typeof renderWishlistPage === 'function') renderWishlistPage();
      if (document.getElementById('featuredGrid')) renderHomeSections();
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('productGrid')) {
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