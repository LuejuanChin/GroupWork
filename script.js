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
function getAllProducts() {
  let products = JSON.parse(localStorage.getItem("AllProducts"));

  if (!products || !Array.isArray(products) || products.length === 0) {
    products = [
      {
        name: "Car Phone Mount",
        price: 2500,
        description: "Strong and adjustable dashboard mount for safe driving.",
        image: "Assets/phone-mount.jpeg"
      },
      {
        name: "Interior LED Light Kit",
        price: 4500,
        description: "Bright multi-color LED lighting for a modern cabin look.",
        image: "led-lights.jpeg"
      },
      {
        name: "Premium Seat Covers",
        price: 6800,
        description: "Comfortable and stylish seat covers to protect your interior.",
        image: "seat-cover.jpeg"
      },
      {
        name: "Portable Car Vacuum",
        price: 5200,
        description: "Compact vacuum cleaner for quick and easy interior cleaning.",
        image: "car-vacuum.jpeg"
      },
      {
        name: "Luxury Air Freshener",
        price: 1200,
        description: "Long-lasting fragrance to keep your car smelling fresh.",
        image: "air-freshener.jpeg"
      },
      {
        name: "Dash Cam",
        price: 9500,
        description: "Record your trips with clear video for safety and security.",
        image: "dash-cam.jpeg"
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
    if (user.trn === updatedUser.trn) {
      return updatedUser;
    }
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
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

// Question 6(a)
function getAgeGroup(age) {
  if (age >= 18 && age <= 25) return "18-25";
  if (age >= 26 && age <= 35) return "26-35";
  if (age >= 36 && age <= 50) return "36-50";
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
function currency(amount) {
  return "JMD $" + Number(amount || 0).toFixed(2);
}

// Question 3(c)
function calculateCartTotals(cart) {
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += Number(item.price) * Number(item.quantity);
  });

  const discount = subtotal >= 10000 ? subtotal * 0.10 : 0;
  const taxable = subtotal - discount;
  const tax = taxable * 0.15;
  const total = taxable + tax;

  return { subtotal, discount, tax, total };
}

// Question 5(a)
function getNextInvoiceNumber() {
  const invoices = getAllInvoices();
  return "INV-" + String(invoices.length + 1).padStart(4, "0");
}

// Question 2(c)(d)
function renderProducts() {
  const productList = document.getElementById("productList");
  if (!productList) return;

  const products = getAllProducts();
  productList.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p class="price">${currency(product.price)}</p>
      <button class="btn" onclick="addToCart('${product.name.replace(/'/g, "\\'")}')">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}

// Question 2(e)
function addToCart(productName) {
  const products = getAllProducts();
  const product = products.find(item => item.name === productName);
  if (!product) return;

  const cart = getUserCart();
  const existing = cart.find(item => item.name === productName);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      quantity: 1
    });
  }

  saveUserCart(cart);
  alert(product.name + " added to cart.");
}

// Question 3(a)(b)(c)
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.querySelector(".cart-summary");

  if (!cartItems || !cartSummary) return;

  const cart = getUserCart();
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<tr><td colspan="8">Your cart is empty.</td></tr>`;
    cartSummary.innerHTML = "";
    return;
  }

  cart.forEach((item, index) => {
    const subTotal = item.price * item.quantity;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${currency(item.price)}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)" style="width:70px;">
      </td>
      <td>${currency(subTotal)}</td>
      <td>${currency(0)}</td>
      <td>${currency(0)}</td>
      <td>${currency(subTotal)}</td>
      <td><button class="btn secondary" onclick="removeCartItem(${index})">Remove</button></td>
    `;
    cartItems.appendChild(row);
  });

  const totals = calculateCartTotals(cart);
  cartSummary.innerHTML = `
    <h2>Cart Summary</h2>
    <p><strong>Subtotal:</strong> ${currency(totals.subtotal)}</p>
    <p><strong>Discount:</strong> ${currency(totals.discount)}</p>
    <p><strong>Tax:</strong> ${currency(totals.tax)}</p>
    <p><strong>Total:</strong> ${currency(totals.total)}</p>
  `;
}

// Question 3(b)
function updateQuantity(index, quantity) {
  const cart = getUserCart();
  const qty = Number(quantity);

  if (qty < 1 || Number.isNaN(qty)) {
    renderCart();
    return;
  }

  cart[index].quantity = qty;
  saveUserCart(cart);
  renderCart();
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

// Question 3(f)
function closeCart() {
  window.location.href = "products.html";
}

// Question 4(a)
function renderCheckoutSummary() {
  const orderSummary = document.getElementById("orderSummary");
  if (!orderSummary) return;

  const cart = getUserCart();
  const user = getCurrentUser();

  if (user) {
    const customerNameInput = document.getElementById("customerName");
    if (customerNameInput) {
      customerNameInput.value = user.fullName || "";
    }
  }

  if (cart.length === 0) {
    orderSummary.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  const totals = calculateCartTotals(cart);
  let html = "<ul>";

  cart.forEach(item => {
    html += `<li>${item.name} x ${item.quantity} - ${currency(item.price * item.quantity)}</li>`;
  });

  html += "</ul>";
  html += `
    <p><strong>Subtotal:</strong> ${currency(totals.subtotal)}</p>
    <p><strong>Discount:</strong> ${currency(totals.discount)}</p>
    <p><strong>Tax:</strong> ${currency(totals.tax)}</p>
    <p><strong>Total:</strong> ${currency(totals.total)}</p>
  `;

  orderSummary.innerHTML = html;
}

// Question 5(a)(b)
function setupCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const cart = getUserCart();
    const message = document.getElementById("checkoutMessage");

    if (cart.length === 0) {
      message.textContent = "Your cart is empty.";
      message.style.color = "red";
      return;
    }

    const shipping = {
      name: document.getElementById("customerName").value.trim(),
      address: document.getElementById("address").value.trim()
    };

    if (!shipping.name || !shipping.address) {
      message.textContent = "Please fill in shipping details.";
      message.style.color = "red";
      return;
    }

    const totals = calculateCartTotals(cart);

    const invoice = {
      invoiceNumber: getNextInvoiceNumber(),
      companyName: "DriveStyle Auto Accessories",
      dateOfInvoice: new Date().toLocaleString(),
      trn: getCurrentUserTRN(),
      shippingInformation: shipping,
      purchasedItems: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: 0
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      taxes: totals.tax,
      totalCost: totals.total
    };

    const user = getCurrentUser();
    user.invoices = Array.isArray(user.invoices) ? user.invoices : [];
    user.invoices.push(invoice);
    user.cart = [];
    saveCurrentUser(user);

    const allInvoices = getAllInvoices();
    allInvoices.push(invoice);
    saveAllInvoices(allInvoices);

    localStorage.setItem("lastInvoiceNumber", invoice.invoiceNumber);

    message.textContent = "Invoice generated successfully.";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "invoice.html";
    }, 800);
  });
}

// Question 5(b)
function renderInvoicePage() {
  const invoiceDisplay = document.getElementById("invoiceDisplay");
  if (!invoiceDisplay) return;

  const user = getCurrentUser();
  if (!user) {
    invoiceDisplay.innerHTML = "<p>No user found.</p>";
    return;
  }

  const invoices = Array.isArray(user.invoices) ? user.invoices.slice().reverse() : [];
  if (invoices.length === 0) {
    invoiceDisplay.innerHTML = "<p>No invoices generated yet.</p>";
    return;
  }

  invoiceDisplay.innerHTML = invoices.map(invoice => {
    const itemsHtml = invoice.purchasedItems.map(item => `
      <li>${item.name} - Qty: ${item.quantity} - Price: ${currency(item.price)} - Discount: ${currency(item.discount)}</li>
    `).join("");

    return `
      <section class="card" style="margin-bottom:20px;padding:16px;border:1px solid #ccc;">
        <h2>${invoice.invoiceNumber}</h2>
        <p><strong>Company:</strong> ${invoice.companyName}</p>
        <p><strong>Date:</strong> ${invoice.dateOfInvoice}</p>
        <p><strong>TRN:</strong> ${invoice.trn}</p>
        <p><strong>Name:</strong> ${invoice.shippingInformation.name}</p>
        <p><strong>Address:</strong> ${invoice.shippingInformation.address}</p>
        <h3>Items</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>Subtotal:</strong> ${currency(invoice.subtotal)}</p>
        <p><strong>Discount:</strong> ${currency(invoice.discount)}</p>
        <p><strong>Taxes:</strong> ${currency(invoice.taxes)}</p>
        <p><strong>Total Cost:</strong> ${currency(invoice.totalCost)}</p>
      </section>
    `;
  }).join("");
}

// Question 6(a)
function showUserFrequency() {
  const container = document.getElementById("frequencyDisplay");
  if (!container) return;

  const users = getRegistrationData();
  const genderCounts = { Male: 0, Female: 0, Other: 0 };
  const ageCounts = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };

  users.forEach(user => {
    const gender = user.gender || "Other";

    if (genderCounts[gender] !== undefined) {
      genderCounts[gender]++;
    } else {
      genderCounts.Other++;
    }

    const age = user.age || calculateAge(user.dob);
    const group = getAgeGroup(age);
    ageCounts[group]++;
  });

  function createBarChart(title, dataObj) {
    let html = `<h3>${title}</h3>`;

    Object.entries(dataObj).forEach(([label, value]) => {
      html += `
        <div style="margin:10px 0;">
          <strong>${label}: ${value}</strong>
          <div style="background:#ddd;height:20px;width:100%;max-width:500px;">
            <div style="background:#333;height:20px;width:${Math.max(value * 40, value ? 20 : 0)}px;"></div>
          </div>
        </div>
      `;
    });

    return html;
  }

  container.innerHTML =
    createBarChart("Gender Frequency", genderCounts) +
    createBarChart("Age Group Frequency", ageCounts);
}

// Question 6(b)
function showInvoices() {
  const searchTRNInput = document.getElementById("searchTRN");
  const invoiceList = document.getElementById("invoiceList");
  if (!searchTRNInput || !invoiceList) return;

  const trn = searchTRNInput.value.trim();
  const invoices = getAllInvoices().filter(invoice => !trn || invoice.trn === trn);

  if (invoices.length === 0) {
    invoiceList.innerHTML = "<p>No invoices found.</p>";
    console.log("No invoices found.");
    return;
  }

  console.log("Invoices:", invoices);

  invoiceList.innerHTML = invoices.map(invoice => `
    <div class="card" style="margin:10px 0;padding:12px;border:1px solid #ccc;">
      <p><strong>${invoice.invoiceNumber}</strong></p>
      <p>TRN: ${invoice.trn}</p>
      <p>Date: ${invoice.dateOfInvoice}</p>
      <p>Total: ${currency(invoice.totalCost)}</p>
    </div>
  `).join("");
}

// Question 6(c)
function getUserInvoices() {
  const userTRNInput = document.getElementById("userTRN");
  const userInvoiceDisplay = document.getElementById("userInvoiceDisplay");
  if (!userTRNInput || !userInvoiceDisplay) return;

  const trn = userTRNInput.value.trim();
  const user = getRegistrationData().find(item => item.trn === trn);

  if (!user || !Array.isArray(user.invoices) || user.invoices.length === 0) {
    userInvoiceDisplay.innerHTML = "<p>No invoices found for this user.</p>";
    return;
  }

  userInvoiceDisplay.innerHTML = user.invoices.map(invoice => `
    <div class="card" style="margin:10px 0;padding:12px;border:1px solid #ccc;">
      <p><strong>${invoice.invoiceNumber}</strong></p>
      <p>Date: ${invoice.dateOfInvoice}</p>
      <p>Total: ${currency(invoice.totalCost)}</p>
    </div>
  `).join("");
}

// Question 1, 2, 3, 4, 5, 6 - run functions by page
document.addEventListener("DOMContentLoaded", function() {
  const protectedPages = ["products.html", "cart.html", "checkout.html", "invoice.html", "dashboard.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage)) {
    requireLogin();
  }

  if (currentPage === "products.html") {
    renderProducts();
  }

  if (currentPage === "cart.html") {
    renderCart();
    const clearBtn = document.getElementById("clearCartBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", clearCart);
    }
  }

  if (currentPage === "checkout.html") {
    renderCheckoutSummary();
    setupCheckoutForm();
  }

  if (currentPage === "invoice.html") {
    renderInvoicePage();
  }

  if (currentPage === "dashboard.html") {
    showUserFrequency();
  }
});


// ==========================
// ADDED: Auto Load User Invoices (Dashboard)
// ==========================
function loadCurrentUserInvoices() {
  const userInvoiceDisplay = document.getElementById("userInvoiceDisplay");
  if (!userInvoiceDisplay) return;

  const currentUserTRN = localStorage.getItem("currentUserTRN");

  if (!currentUserTRN) {
    userInvoiceDisplay.innerHTML = "<p>No user is currently logged in.</p>";
    return;
  }

  const user = getRegistrationData().find(item => item.trn === currentUserTRN);

  if (!user || !Array.isArray(user.invoices) || user.invoices.length === 0) {
    userInvoiceDisplay.innerHTML = "<p>No invoices found for this user.</p>";
    return;
  }

  userInvoiceDisplay.innerHTML = user.invoices.map(invoice => `
    <div class="card" style="margin:10px 0;padding:12px;border:1px solid #ccc;">
      <p><strong>${invoice.invoiceNumber}</strong></p>
      <p>Date: ${invoice.dateOfInvoice}</p>
      <p>Total: ${currency(invoice.totalCost)}</p>
    </div>
  `).join("");
}

// ==========================
// ADDED: Run on Dashboard Load
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  loadCurrentUserInvoices();
});
