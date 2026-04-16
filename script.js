// Question 1 - Authentication and localStorage helpers

// Question 1(a)(vi)
function getRegistrationData() {
  return JSON.parse(localStorage.getItem("RegistrationData")) || [];
}

// Question 1(a)(vi)
function saveRegistrationData(data) {
  localStorage.setItem("RegistrationData", JSON.stringify(data));
}

// Question 5(b)
function getAllInvoices() {
  return JSON.parse(localStorage.getItem("AllInvoices")) || [];
}

// Question 5(b)
function saveAllInvoices(data) {
  localStorage.setItem("AllInvoices", JSON.stringify(data));
}

// Question 2(a)(b)
// Question 2(a)(b)
function getAllProducts() {
  let products = JSON.parse(localStorage.getItem("AllProducts"));

  if (!products || !Array.isArray(products) || products.length === 0) {
    products = [
      {
        name: "Car Phone Mount",
        price: 2500,
        description: "Strong and adjustable dashboard mount for safe driving.",
        image: "../Assets/phone-mount.jpeg"
      },
      {
        name: "Interior LED Light Kit",
        price: 4500,
        description: "Bright multi-color LED lighting for a modern cabin look.",
        image: "../Assets/led-lights.jpeg"
      },
      {
        name: "Premium Seat Covers",
        price: 6800,
        description: "Comfortable and stylish seat covers.",
        image: "../Assets/seat-cover.jpeg"
      },
      {
        name: "Portable Car Vacuum",
        price: 5200,
        description: "Compact vacuum cleaner.",
        image: "../Assets/car-vacuum.jpeg"
      },
      {
        name: "Luxury Air Freshener",
        price: 1200,
        description: "Keep your car smelling fresh.",
        image: "../Assets/air-freshener.jpeg"
      },
      {
        name: "Dash Cam",
        price: 9500,
        description: "Record your trips clearly.",
        image: "../Assets/dash-cam.jpeg"
      }
    ];

    localStorage.setItem("AllProducts", JSON.stringify(products));
  }

  return products;
}
// Question 1(b)
function getCurrentUserTRN() {
  return localStorage.getItem("currentUserTRN") || "";
}

// Question 1(b)
function getCurrentUser() {
  const trn = getCurrentUserTRN();
  const users = getRegistrationData();
  return users.find(user => user.trn === trn) || null;
}

// Question 1(a)(vi)
function saveCurrentUser(updatedUser) {
  const users = getRegistrationData().map(user => {
    if (user.trn === updatedUser.trn) return updatedUser;
    return user;
  });
  saveRegistrationData(users);
}

// Question 1(b)(iii)
function requireLogin() {
  if (localStorage.getItem("isLoggedIn") !== "true" || !getCurrentUserTRN()) {
    window.location.href = "login.html";
  }
}

// Question 1(b)
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUserTRN");
  localStorage.removeItem("currentUserName");
  window.location.href = "login.html";
}

// Question 1(a)(iv)
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  return age;
}

// Question 6(a)
function getAgeGroup(age) {
  if (age <= 25) return "18-25";
  if (age <= 35) return "26-35";
  if (age <= 50) return "36-50";
  return "50+";
}

// Question 1(b)(iii)
function getAttemptsMap() {
  return JSON.parse(localStorage.getItem("loginAttemptsByTRN")) || {};
}

// Question 1(b)(iii)
function saveAttemptsMap(data) {
  localStorage.setItem("loginAttemptsByTRN", JSON.stringify(data));
}

// Question 3(e)
function getUserCart() {
  const user = getCurrentUser();
  return user && Array.isArray(user.cart) ? user.cart : [];
}

// Question 3(e)
function saveUserCart(cart) {
  const user = getCurrentUser();
  if (!user) return;
  user.cart = cart;
  saveCurrentUser(user);
}

// Question 3(c)
function calculateCartTotals(cart) {
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += Number(item.price) * Number(item.quantity);
  });

  const discount = subtotal >= 10000 ? subtotal * 0.10 : 0;
  const tax = (subtotal - discount) * 0.15;
  const total = subtotal - discount + tax;

  return { subtotal, discount, tax, total };
}

// Question 5(a)
function getNextInvoiceNumber() {
  const invoices = getAllInvoices();
  return "INV-" + String(invoices.length + 1).padStart(4, "0");
}



// Question 2(c)(d)
function renderProducts() {
  const productList = document.querySelector(".product-grid");
  if (!productList) return;

  const products = getAllProducts();
  productList.innerHTML = "";

  products.forEach(product => {
    productList.innerHTML += `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button class="btn" onclick="addToCart('${product.name}')">Add to Cart</button>
      </article>
    `;
  });
}
  const products = getAllProducts();
  productList.innerHTML = "";

  products.forEach(product => {
    productList.innerHTML += `
      <div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>${product.price}</p>
        <button onclick="addToCart('${product.name}')">Add to Cart</button>
      </div>
    `;
  });
}

// Question 2(e)
function addToCart(productName) {
  const products = getAllProducts();
  const product = products.find(item => item.name === productName);

  const cart = getUserCart();
  const existing = cart.find(item => item.name === productName);

  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });

  saveUserCart(cart);
}


// Question 3(a)(b)(c)
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  if (!cartItems) return;

  const cart = getUserCart();
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const sub = item.price * item.quantity;

    cartItems.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${sub}</td>
        <td><button onclick="removeCartItem(${index})">Remove</button></td>
      </tr>
    `;
  });
}

// Question 3(b)
function removeCartItem(index) {
  const cart = getUserCart();
  cart.splice(index, 1);
  saveUserCart(cart);
  renderCart();
}

// Question 3(d)
function clearCart() {
  saveUserCart([]);
  renderCart();
}


// Question 4(a)
function renderCheckoutSummary() {
  const orderSummary = document.getElementById("orderSummary");
  if (!orderSummary) return;

  const cart = getUserCart();
  const totals = calculateCartTotals(cart);

  orderSummary.innerHTML = "";

  cart.forEach(item => {
    orderSummary.innerHTML += `<p>${item.name} x ${item.quantity}</p>`;
  });

  orderSummary.innerHTML += `<h3>Total: ${totals.total}</h3>`;
}


// Question 5(a)(b)
function setupCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const cart = getUserCart();
    const user = getCurrentUser();

    const totals = calculateCartTotals(cart);

    const invoice = {
      invoiceNumber: getNextInvoiceNumber(),
      trn: user.trn,
      items: cart,
      total: totals.total,
      date: new Date().toLocaleDateString()
    };

    const allInvoices = getAllInvoices();
    allInvoices.push(invoice);
    saveAllInvoices(allInvoices);

    user.invoices.push(invoice);
    user.cart = [];
    saveCurrentUser(user);

    window.location.href = "invoice.html";
  });
}


// Question 5(b)
function renderInvoicePage() {
  const div = document.getElementById("invoiceDisplay");
  if (!div) return;

  const user = getCurrentUser();
  if (!user) return;

  div.innerHTML = "";

  user.invoices.reverse().forEach(inv => {
    div.innerHTML += `
      <div>
        <p>${inv.invoiceNumber}</p>
        <p>${inv.date}</p>
        <p>${inv.total}</p>
      </div>
    `;
  });
}


// Question 6(a)
function showUserFrequency() {
  const container = document.getElementById("frequencyDisplay");
  if (!container) return;

  const users = getRegistrationData();

  let male = users.filter(u => u.gender === "Male").length;
  let female = users.filter(u => u.gender === "Female").length;

  container.innerHTML = "Male: " + male + "<br>Female: " + female;
}

// Question 6(b)
function showInvoices() {
  const trn = document.getElementById("searchTRN").value;
  const invoices = getAllInvoices();

  console.log(invoices.filter(i => i.trn === trn));
}

// Question 6(c)
function getUserInvoices() {
  const trn = document.getElementById("userTRN").value;
  const users = getRegistrationData();

  const user = users.find(u => u.trn === trn);
  if (user) console.log(user.invoices);
}


// init
document.addEventListener("DOMContentLoaded", function() {
  const page = window.location.pathname.split("/").pop();

  const protectedPages = ["products.html", "cart.html", "checkout.html", "invoice.html", "dashboard.html"];
  if (protectedPages.includes(page)) requireLogin();

  if (page === "products.html") renderProducts();
  if (page === "cart.html") renderCart();
  if (page === "checkout.html") {
    renderCheckoutSummary();
    setupCheckoutForm();
  }
  if (page === "invoice.html") renderInvoicePage();
  if (page === "dashboard.html") showUserFrequency();
});
