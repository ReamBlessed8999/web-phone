/* ============================================================
   main.js — Search, Filter without auto-scroll, scroll on Search/Enter
   + Smart Hide/Show Navbar on Scroll (Final Fixed)
   ============================================================ */

function filterProductsOnly(query) {
  const searchTerm = query.toLowerCase().trim();
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const cardText = card.innerText.toLowerCase();
    if (cardText.includes(searchTerm)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });

  if (typeof catalogState !== 'undefined' && typeof refreshCatalog === 'function') {
    catalogState.query = query;
    if (document.getElementById('productGrid')) refreshCatalog();
  }
}

function filterAndScrollToSection(query) {
  filterProductsOnly(query);

  const productsSection = document.getElementById('products');
  if (productsSection) {
    productsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// ១. ពេលកំពុងវាយអក្សរ គឺ Filter តែមិនបាច់ Scroll ទេ
document.addEventListener('input', function (e) {
  if (e.target && e.target.id === 'searchInput') {
    const val = e.target.value;
    const searchTerm = val.toLowerCase().trim();
    if (searchTerm === '') {
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = '';
      });
    } else {
      filterProductsOnly(val);
    }
  }
});

// ២. ចុចលើប៊ូតុងសញ្ញាខ្វែង (✕ Clear Button)
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'clearSearchBtn') {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = '';
      });
      
      if (typeof catalogState !== 'undefined' && typeof refreshCatalog === 'function') {
        catalogState.query = '';
        if (document.getElementById('productGrid')) refreshCatalog();
      }
      searchInput.focus();
    }
  }
});

// ៣. ករណីចុច Enter (នឹងធ្វើការ Scroll ចុះក្រោម)
document.addEventListener('keydown', function (e) {
  if (e.target && e.target.id === 'searchInput' && e.key === 'Enter') {
    e.preventDefault();
    if (!document.getElementById('productGrid')) {
      const q = e.target.value;
      window.location.href = 'index.html?q=' + encodeURIComponent(q) + '#products';
    } else {
      filterAndScrollToSection(e.target.value);
    }
  }
});

// ៤. ករណីចុចប៊ូតុង Search (នឹងធ្វើការ Scroll ចុះក្រោម)
document.addEventListener('click', function (e)  {
  if (e.target && e.target.id === 'searchBtn') {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim() !== '') {
      if (!document.getElementById('productGrid')) {
        const q = searchInput.value;
        window.location.href = 'index.html?q=' + encodeURIComponent(q) + '#products';
      } else {
        filterAndScrollToSection(searchInput.value);
      }
    }
  }
});

// ៥. ពេលទំព័រផ្ទុកចូលមក (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('q');
  const searchInput = document.getElementById('searchInput');

  if (searchParam && searchInput) {
    searchInput.value = searchParam;
    setTimeout(() => {
      filterAndScrollToSection(searchParam);
    }, 200);
  }
});

/* ============================================================
   Smart Hide / Show Header & Nav on Scroll (Final Fixed)
   ============================================================ */
let lastScrollTop = 0;
const delta = 5; 

window.addEventListener('scroll', function() {
  let st = window.pageYOffset || document.documentElement.scrollTop;

  if (Math.abs(lastScrollTop - st) <= delta) return;

  if (st > lastScrollTop && st > 50) {
    // Scroll ចុះក្រោម ➔ លាក់ Header និង Nav ចោល
    document.body.classList.add('hide-nav');
  } else if (st < lastScrollTop) {
    // Scroll ឡើងលើ ➔ បង្ហាញ Header និង Nav មកវិញភ្លាមៗ
    document.body.classList.remove('hide-nav');
  }

  lastScrollTop = st <= 0 ? 0 : st;
}, { passive: true });


