document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  const result = registerUser(name, email, password, confirmPassword);
  const msgEl = document.getElementById('registerMsg');

  msgEl.classList.remove('success', 'error');
  msgEl.classList.add('show', result.ok ? 'success' : 'error');
  msgEl.textContent = result.message;

  if (result.ok) {
    showToast('Account created! Please log in.', 'success');
    document.getElementById('registerForm').reset();
    setTimeout(() => { window.location.href = 'login.html'; }, 900);
  }
});