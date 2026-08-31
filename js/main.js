/* ============================================================
   main.js — Site-wide event delegation
   ============================================================ */

// Live Search Input Delegation (works on any page with #productGrid)
document.addEventListener('input', function (e) {
  if (e.target && e.target.id === 'searchInput') {
    if (typeof catalogState !== 'undefined' && typeof refreshCatalog === 'function') {
      catalogState.query = e.target.value;
      if (document.getElementById('productGrid')) refreshCatalog();
    }
  }
});

// Pressing Enter in the header search on any page jumps to the product grid on Home
document.addEventListener('keydown', function (e) {
  if (e.target && e.target.id === 'searchInput' && e.key === 'Enter') {
    if (!document.getElementById('productGrid')) {
      const q = e.target.value;
      window.location.href = 'index.html?q=' + encodeURIComponent(q) + '#products';
    }
  }
});/* ============================================================
   main.js — Universal Search Filter
   ============================================================ */

function filterProducts(query) {
  const searchTerm = query.toLowerCase().trim();
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    // ចាប់យកអត្ថបទទាំងអស់ដែលមាននៅក្នុង Card នីមួយៗ (ឈ្មោះ, Brand, ព័ត៌មានផ្សេងៗ)
    const cardText = card.innerText.toLowerCase();
    
    if (cardText.includes(searchTerm)) {
      card.style.display = ''; // បង្ហាញ Card
    } else {
      card.style.display = 'none'; // លាក់ Card
    }
  });

  // ប្រសិនបើមានមុខងារ refreshCatalog ដើម វានឹងរត់បន្ថែម
  if (typeof catalogState !== 'undefined' && typeof refreshCatalog === 'function') {
    catalogState.query = query;
    if (document.getElementById('productGrid')) refreshCatalog();
  }
}

// 1. រត់ Filter ភ្លាមៗនៅពេលអ្នកវាយអក្សរ (Live Search)
document.addEventListener('input', function (e) {
  if (e.target && e.target.id === 'searchInput') {
    filterProducts(e.target.value);
  }
});

// 2. ករណីចុច Enter ពីទំព័រផ្សេង ឱ្យ Re-direct មកទំព័រ Home
document.addEventListener('keydown', function (e) {
  if (e.target && e.target.id === 'searchInput' && e.key === 'Enter') {
    if (!document.getElementById('productGrid')) {
      const q = e.target.value;
      window.location.href = 'index.html?q=' + encodeURIComponent(q) + '#products';
    }
  }
});

// 3. ចាប់យកពាក្យ Search ពី URL ប្រសិនបើ Re-direct មកពី page ផ្សេង
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('q');
  const searchInput = document.getElementById('searchInput');

  if (searchParam && searchInput) {
    searchInput.value = searchParam;
    // រង់ចាំ products render រួចបន្តិច រួចធ្វើការ Filter
    setTimeout(() => {
      filterProducts(searchParam);
    }, 100);
  }
});