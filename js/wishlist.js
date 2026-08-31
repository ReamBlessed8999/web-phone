/* ============================================================
   wishlist.js — per-user wishlist stored in localStorage
   ============================================================ */

function getWishlistKey() {
  const user = getCurrentUser();
  return LS_KEYS.WISHLIST_PREFIX + (user ? user.email : 'guest');
}
function getWishlist() {
  return lsGet(getWishlistKey(), []); // array of product IDs
}
function saveWishlist(list) {
  lsSet(getWishlistKey(), list);
  if (typeof renderNavbar === 'function') renderNavbar();
}
function getWishlistCount() {
  return getWishlist().length;
}

function addToWishlist(productId) {
  const list = getWishlist();
  if (!list.includes(productId)) {
    list.push(productId);
    saveWishlist(list);
    showToast('Added to wishlist.', 'success');
  }
}
function removeFromWishlist(productId) {
  let list = getWishlist();
  list = list.filter(id => id !== productId);
  saveWishlist(list);
  showToast('Removed from wishlist.', 'info');
}
function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

// Requirement 16: wishlist is scoped per logged-in user
function toggleWishlistItem(productId) {
  if (!isLoggedIn()) {
    showToast('Please log in to use your wishlist.', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 800);
    return;
  }
  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
  } else {
    addToWishlist(productId);
  }
}

/* ---------- rendering the dedicated wishlist page ---------- */
function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  if (!grid) return;
  const ids = getWishlist();
  const products = ids.map(id => getProductById(id)).filter(Boolean);

  if (!products.length) {
    grid.innerHTML = `
      <div class="page-empty" style="grid-column: 1 / -1;">
        <div class="page-empty-icon">💔</div>
        <h3>Your wishlist is empty</h3>
        <p>Browse products and tap "Add to Wishlist" to save items for later.</p>
        <a href="index.html" class="btn-cta">Explore Products</a>
      </div>`;
    return;
  }
  grid.innerHTML = products.map(buildProductCard).join('');
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('wishlistGrid')) {
    if (!requireLogin('wishlist.html')) return;
    renderWishlistPage();
  }
});