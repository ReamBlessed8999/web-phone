/* ============================================================
   auth.js — Register / Login / Guard Access Control
   ============================================================ */

function getUsers() {
  return lsGet(LS_KEYS.USERS, []);
}

function saveUsers(users) {
  lsSet(LS_KEYS.USERS, users);
}

function getCurrentUser() {
  return lsGet(LS_KEYS.CURRENT_USER, null);
}

function setCurrentUser(user) {
  lsSet(LS_KEYS.CURRENT_USER, user);
}

function clearCurrentUser() {
  localStorage.removeItem(LS_KEYS.CURRENT_USER);
}

function isLoggedIn() {
  return !!getCurrentUser();
}

function isAdmin() {
  const u = getCurrentUser();
  return !!u && String(u.role).toLowerCase() === 'admin';
}

/* ---------- Access Protection Guards ---------- */
function requireLogin(redirectUrl) {
  if (!isLoggedIn()) {
    showToast('Please log in to continue.', 'error');
    const redirectParam = redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : '';
    setTimeout(() => { window.location.href = `login.html${redirectParam}`; }, 400);
    return false;
  }
  return true;
}

// Requirement 9: Strict Admin Route Guard
function requireAdmin() {
  if (!isAdmin()) {
    showToast('Access Denied: Admins only.', 'error');
    setTimeout(() => { window.location.href = 'index.html'; }, 400);
    return false;
  }
  return true;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   REGISTRATION WITH STRICT VALIDATION
   ============================================================ */
function registerUser(name, email, password, confirmPassword) {
  name = (name || '').trim();
  email = (email || '').trim().toLowerCase();

  if (!name || !email || !password || !confirmPassword) {
    return { ok: false, message: 'Please fill in all fields.' };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }

  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email)) {
    return { ok: false, message: 'Email already exists.' };
  }

  if (password.length < 6) {
    return { ok: false, message: 'Password must be at least 6 characters.' };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: 'Passwords do not match.' };
  }

  const newUser = {
    id: generateId('u'),
    name,
    email,
    password,
    role: 'user'
  };

  users.push(newUser);
  saveUsers(users);

  return { ok: true, message: 'Registration successful! You can now log in.' };
}

/* ============================================================
   LOGIN & ROLE-BASED REDIRECT
   ============================================================ */
function loginUser(email, password) {
  email = (email || '').trim().toLowerCase();

  if (!email || !password) {
    return { ok: false, message: 'Please enter both email and password.' };
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email);

  if (!user || user.password !== password) {
    return { ok: false, message: 'Incorrect email or password.' };
  }

  // Ensure role is accurately passed to session
  const sessionUser = { 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    role: user.role || (user.email === 'admin@angkormass.com' ? 'admin' : 'user') 
  };
  
  setCurrentUser(sessionUser);

  return { ok: true, message: 'Login successful!', user: sessionUser };
}

function logoutUser() {
  clearCurrentUser();
  showToast('You have been logged out.', 'info');
  setTimeout(() => { window.location.href = 'index.html'; }, 300);
}