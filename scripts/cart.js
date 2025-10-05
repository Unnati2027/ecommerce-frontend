// ===== Select DOM Elements =====
const cartContainer = document.querySelector('.cart-container');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const cartCountEl = document.querySelector('.cart-count');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===== Render Cart Items =====
function renderCart() {
    cartContainer.innerHTML = '';
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        checkoutBtn.disabled = true;
        updateCartCount();
        cartTotalEl.textContent = '₹0.00';
        return;
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="item-details">
                <h3>${item.title}</h3>
                <p>Size: ${item.size} | Color: ${item.color}</p>
                <p>Price: ₹${item.discountedPrice}</p>
                <div class="quantity-control">
                    <button class="decrease-qty">−</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="increase-qty">+</button>
                </div>
                <button class="remove-item">Remove</button>
            </div>
        `;

        // Quantity buttons
        cartItem.querySelector('.increase-qty').addEventListener('click', () => {
            item.quantity++;
            updateCart();
        });
        cartItem.querySelector('.decrease-qty').addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                updateCart();
            }
        });

        // Remove button
        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            cart.splice(index, 1);
            updateCart();
        });

        cartContainer.appendChild(cartItem);
    });

    updateCartTotal();
    updateCartCount();
}

// ===== Update Cart =====
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// ===== Update Cart Total =====
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
    cartTotalEl.textContent = `₹${total.toFixed(2)}`;
}

// ===== Update Cart Count =====
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartCountEl.style.display = 'inline-block';
        cartCountEl.textContent = totalItems;
    } else {
        cartCountEl.style.display = 'none';
    }
}

// ===== Checkout Button =====
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    window.location.href = 'checkout.html'; // Replace with your checkout page
});

// Initial render
renderCart();
