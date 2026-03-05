/* ═══════════════════════════════════════════
   Bookora — Book Store Application
   DOM Manipulation & Async JavaScript
   ═══════════════════════════════════════════ */

// ══════════════════════════════════════
// 1. DOM Element Selection
// ══════════════════════════════════════
const booksGrid = document.getElementById("booksGrid");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Cart Elements
const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const cartClose = document.getElementById("cartClose");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartBadge = document.getElementById("cartBadge");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

// Theme & Auth Elements
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const authModal = document.getElementById("authModal");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const authForm = document.getElementById("authForm");
const nameGroup = document.getElementById("nameGroup");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const authSubmit = document.getElementById("authSubmit");
const authSwitchText = document.getElementById("authSwitchText");
const authSwitchLink = document.getElementById("authSwitchLink");
const authButtons = document.getElementById("authButtons");
const userMenu = document.getElementById("userMenu");
const userGreeting = document.getElementById("userGreeting");
const logoutBtn = document.getElementById("logoutBtn");
const toastContainer = document.getElementById("toastContainer");

// ══════════════════════════════════════
// 2. State Management
// ══════════════════════════════════════
let cart = JSON.parse(localStorage.getItem("bookora_cart")) || [];
let books = [];
let isLoginMode = true;
let currentUser = JSON.parse(localStorage.getItem("bookora_user")) || null;

// ══════════════════════════════════════
// 3. Backup Data (Safety Net)
// ══════════════════════════════════════
// سيتم استخدام هذه البيانات فقط في حال فشل الـ API
const BACKUP_DATA = [
  {
    isbn13: "9781491954461",
    title: "MongoDB: The Definitive Guide",
    subtitle: "Powerful and Scalable Data Storage",
    price: "$49.99",
    image: "https://itbook.store/img/books/9781491954461.png"
  },
  {
    isbn13: "9781484217504",
    title: "Full Stack JavaScript",
    subtitle: "Learn Backbone.js, Node.js and MongoDB",
    price: "$34.99",
    image: "https://itbook.store/img/books/9781484217504.png"
  },
  {
    isbn13: "9780134655536",
    title: "Node.js, MongoDB and Angular",
    subtitle: "Web Development with MEAN",
    price: "$28.00",
    image: "https://itbook.store/img/books/9780134655536.png"
  },
  {
    isbn13: "9781118026694",
    title: "Professional JavaScript",
    subtitle: "For Web Developers",
    price: "Free",
    image: "https://itbook.store/img/books/9781118026694.png"
  },
  {
    isbn13: "9780132350884",
    title: "Clean Code",
    subtitle: "A Handbook of Agile Software Craftsmanship",
    price: "$42.50",
    image: "https://itbook.store/img/books/9780132350884.png"
  },
  {
    isbn13: "9781617292859",
    title: "React in Action",
    subtitle: "Mastering React Components",
    price: "$39.99",
    image: "https://itbook.store/img/books/9781617292859.png"
  }
];

// ══════════════════════════════════════
// 4. Utilities
// ══════════════════════════════════════
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = type === "success" ? `✅ ${message}` : `ℹ️ ${message}`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function initTheme() {
  const saved = localStorage.getItem("bookora_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  themeIcon.textContent = saved === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("bookora_theme", next);
  themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
});

// ══════════════════════════════════════
// 5. HYBRID FETCH FUNCTION (API + Fallback)
// ══════════════════════════════════════
async function fetchBooks(query = "mongodb") {
  // Show Loader
  loader.classList.remove("hidden");
  booksGrid.innerHTML = "";

  try {
    // ------------------------------------------
    // محاولة 1: الاتصال بالـ API الحقيقي
    // ------------------------------------------
    console.log(`📡 Attempting to fetch from API: ${query}`);
    
    const response = await fetch(`https://api.itbook.store/1.0/search/${encodeURIComponent(query)}`);
    
    // إذا لم تنجح الاستجابة، ارمِ خطأ للانتقال للـ Catch
    if (!response.ok) throw new Error("API response was not ok");
    
    const data = await response.json();
    
    // تأكد أن الـ API أعاد كتباً فعلاً
    if (data.books && data.books.length > 0) {
        books = data.books;
        console.log("✅ Data loaded from Real API");
    } else {
        throw new Error("No books found in API");
    }

  } catch (error) {
    // ------------------------------------------
    // محاولة 2: استخدام البيانات الاحتياطية (Safety Net)
    // ------------------------------------------
    console.warn("⚠️ API failed or blocked (CORS). Switching to Backup Data.", error);
    
    // محاكاة تأخير بسيط ليبقى الشعور بالتحميل موجوداً
    await new Promise(resolve => setTimeout(resolve, 800));

    // فلترة البيانات المحلية بناءً على البحث
    if (query && query !== "mongodb") {
        books = BACKUP_DATA.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase())
        );
    } else {
        books = BACKUP_DATA;
    }
    
    // عرض رسالة صغيرة في الكونسول للمطور
    showToast("Using offline mode (API unavailable)", "info");

  } finally {
    // في كلتا الحالتين (نجاح أو فشل)، قم بإخفاء اللودر وعرض الكتب
    loader.classList.add("hidden");
    renderBooks(books);
  }
}

// ══════════════════════════════════════
// 6. Render Logic
// ══════════════════════════════════════
function renderBooks(booksToRender) {
  booksGrid.innerHTML = "";

  if (!booksToRender || booksToRender.length === 0) {
    booksGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:60px 0; color:var(--text-muted);">
        <p style="font-size:40px; margin-bottom:10px;">🔍</p>
        <p>No books found.</p>
      </div>
    `;
    return;
  }

  booksToRender.forEach((book) => {
    const price = book.price === "$0.00" ? "Free" : book.price;
    const isFree = price === "Free";
    const isInCart = cart.some((item) => item.isbn13 === book.isbn13);

    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <div class="book-card-img">
        <img src="${book.image}" alt="${book.title}" loading="lazy" 
             onerror="this.src='https://via.placeholder.com/150x200?text=No+Cover'"/>
      </div>
      <div class="book-card-body">
        <h3 class="book-card-title" title="${book.title}">${book.title}</h3>
        <p class="book-card-subtitle">${book.subtitle || "Tech Resource"}</p>
        <p class="book-card-desc">Comprehensive guide for developers.</p>
        <div class="book-card-footer">
          <span class="book-price ${isFree ? "free" : ""}">${price}</span>
          <button class="add-cart-btn ${isInCart ? "added" : ""}">
            ${isInCart ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    `;

    // Event Listener for Add Button
    const addBtn = card.querySelector(".add-cart-btn");
    addBtn.addEventListener("click", () => {
      if (!isInCart) {
        addToCart(book);
        addBtn.textContent = "✓ Added";
        addBtn.classList.add("added");
      }
    });

    booksGrid.appendChild(card);
  });
}

// ══════════════════════════════════════
// 7. Search Logic
// ══════════════════════════════════════
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if(query) fetchBooks(query);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = searchInput.value.trim();
    if(query) fetchBooks(query);
  }
});

// ══════════════════════════════════════
// 8. Cart Logic
// ══════════════════════════════════════
function addToCart(book) {
  if (cart.some((item) => item.isbn13 === book.isbn13)) return;

  cart.push(book);
  saveCart();
  updateCartUI();
  showToast(`"${book.title}" added!`);
  
  cartBadge.classList.add("bump");
  setTimeout(() => cartBadge.classList.remove("bump"), 300);
}

function removeFromCart(isbn13) {
  cart = cart.filter((item) => item.isbn13 !== isbn13);
  saveCart();
  updateCartUI();
  renderBooks(books); // Refresh grid state
  showToast("Item removed.", "info");
}

function saveCart() {
  localStorage.setItem("bookora_cart", JSON.stringify(cart));
}

function updateCartUI() {
  cartBadge.textContent = cart.length;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    totalPrice.textContent = "$0.00";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    let priceNum = parseFloat(item.price.replace("$", ""));
    if (isNaN(priceNum)) priceNum = 0;
    total += priceNum;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.title}" />
      </div>
      <div class="cart-item-info">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-price">${item.price}</p>
      </div>
      <button class="remove-btn">✕</button>
    `;

    cartItem.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(item.isbn13);
    });

    cartItems.appendChild(cartItem);
  });

  totalPrice.textContent = `$${total.toFixed(2)}`;
}

// Cart Sidebar Toggle
function toggleCart(show) {
  if (show) {
    cartSidebar.classList.add("open");
    overlay.classList.remove("hidden");
  } else {
    cartSidebar.classList.remove("open");
    overlay.classList.add("hidden");
  }
}

cartToggle.addEventListener("click", () => toggleCart(true));
cartClose.addEventListener("click", () => toggleCart(false));
overlay.addEventListener("click", () => toggleCart(false));

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return showToast("Cart is empty!", "error");
  showToast(`Checkout successful! Total: ${totalPrice.textContent}`);
  cart = [];
  saveCart();
  updateCartUI();
  renderBooks(books);
  toggleCart(false);
});

// ══════════════════════════════════════
// 9. Auth Logic
// ══════════════════════════════════════
function toggleAuthModal(show) {
  if (show) {
    authModal.classList.remove("hidden");
    updateAuthModalUI();
  } else {
    authModal.classList.add("hidden");
    authForm.reset();
  }
}

function updateAuthModalUI() {
  if (isLoginMode) {
    modalTitle.textContent = "Log In";
    authSubmit.textContent = "Log In";
    nameGroup.classList.add("hidden");
    authSwitchText.textContent = "Don't have an account?";
    authSwitchLink.textContent = "Sign Up";
  } else {
    modalTitle.textContent = "Sign Up";
    authSubmit.textContent = "Create Account";
    nameGroup.classList.remove("hidden");
    authSwitchText.textContent = "Already have an account?";
    authSwitchLink.textContent = "Log In";
  }
}

loginBtn.addEventListener("click", () => { isLoginMode = true; toggleAuthModal(true); });
registerBtn.addEventListener("click", () => { isLoginMode = false; toggleAuthModal(true); });
modalClose.addEventListener("click", () => toggleAuthModal(false));
authModal.addEventListener("click", (e) => { if (e.target === authModal) toggleAuthModal(false); });

authSwitchLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  updateAuthModalUI();
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !password) return showToast("Please fill fields.", "error");
  if (!isLoginMode && !name) return showToast("Name required.", "error");

  const users = JSON.parse(localStorage.getItem("bookora_users")) || [];

  if (isLoginMode) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      handleLoginSuccess(user);
    } else {
      showToast("Invalid credentials.", "error");
    }
  } else {
    if (users.find(u => u.email === email)) return showToast("Email exists.", "error");
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("bookora_users", JSON.stringify(users));
    handleLoginSuccess(newUser);
  }
});

function handleLoginSuccess(user) {
  currentUser = user;
  localStorage.setItem("bookora_user", JSON.stringify(user));
  showToast(`Welcome, ${user.name}!`);
  updateAuthUI();
  toggleAuthModal(false);
}

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("bookora_user");
  updateAuthUI();
  showToast("Logged out.", "info");
});

function updateAuthUI() {
  if (currentUser) {
    authButtons.classList.add("hidden");
    userMenu.classList.remove("hidden");
    userGreeting.textContent = `Hi, ${currentUser.name}`;
  } else {
    authButtons.classList.remove("hidden");
    userMenu.classList.add("hidden");
  }
}

// ══════════════════════════════════════
// 10. Initialization
// ══════════════════════════════════════
function init() {
  initTheme();
  updateAuthUI();
  updateCartUI();
  // Start with default search
  fetchBooks("mongodb"); 
}

init();