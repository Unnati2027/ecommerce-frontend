const orderItemsEl = document.getElementById("order-items");
const orderTotalEl = document.getElementById("order-total");
const checkoutForm = document.getElementById("checkout-form");
const cartCountEl = document.querySelector(".cart-count");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render order summary
function renderOrder() {
  orderItemsEl.innerHTML = "";
  if (cart.length === 0) {
    orderItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    orderTotalEl.textContent = "₹0.00";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("order-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div>
        <h4>${item.title}</h4>
        <p>Qty: ${item.quantity} × ₹${item.discountedPrice}</p>
        <p><strong>₹${(item.quantity * item.discountedPrice).toFixed(2)}</strong></p>
      </div>
    `;
    orderItemsEl.appendChild(div);
  });

  const total = cart.reduce((sum, i) => sum + i.discountedPrice * i.quantity, 0);
  orderTotalEl.textContent = `₹${total.toFixed(2)}`;
}

// Update cart count in header
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > 0) {
    cartCountEl.style.display = "inline-block";
    cartCountEl.textContent = totalItems;
  } else {
    cartCountEl.style.display = "none";
  }
}

// Handle form submission
checkoutForm.addEventListener("submit", e => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Clear cart and redirect
  localStorage.removeItem("cart");
  cart = [];
  renderOrder();
  updateCartCount();

  checkoutForm.reset();

  // Redirect to thank you page
  window.location.href = "thankyou.html";
});
