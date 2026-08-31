document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const result = loginUser(email, password);
  const msgEl = document.getElementById('loginMsg');
  msgEl.classList.remove('success', 'error');
  msgEl.classList.add('show', result.ok ? 'success' : 'error');
  msgEl.textContent = result.message;
  if (result.ok) {
    showToast('Welcome back, ' + result.user.name + '!', 'success');
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    setTimeout(() => {
      // Requirement 9: Admin always lands on the Dashboard
      if (result.user.role === 'admin') window.location.href = 'admin.html';
      else window.location.href = redirect ? redirect : 'index.html';
    }, 500);
  }
});