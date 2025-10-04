// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Back to Home Button Scroll
const backToHomeBtn = document.getElementById('back-to-home');
backToHomeBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Product Section
const productContainer = document.querySelector('.product-cards');

// Show loading spinner initially
productContainer.innerHTML = `<div class="loading">Loading Products...</div>`;

// Fetch products from local JSON
async function fetchProducts() {
    try {
        const response = await fetch('assets/products.json'); // Use your JSON file
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();

        displayProducts(products);
    } catch (error) {
        productContainer.innerHTML = `<p style="color:red; font-weight:bold;">Failed to load products. Please try again later.</p>`;
        console.error('Error fetching products:', error);
    }
}

// Display products dynamically
function displayProducts(products) {
    productContainer.innerHTML = ''; // Clear loading spinner

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <h3 class="product-title">${product.title}</h3>
            <div class="price">
                <span class="original-price">₹${product.price}</span>
                <span class="discounted-price">₹${product.discountedPrice}</span>
                <span class="discount-tag">${product.discount}% OFF</span>
            </div>
            <button class="add-to-cart">Add to Cart</button>
        `;

        // Redirect to product detail page
        productCard.querySelector('.product-image').addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });
        productCard.querySelector('.product-title').addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        // Add to Cart functionality
        productCard.querySelector('.add-to-cart').addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
        });

        productContainer.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id == productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("Product added to cart!");
}

// Update cart count in header
const cartCount = document.querySelector('.cart-count');
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
        cartCount.style.display = 'inline';
        cartCount.textContent = totalItems;
    } else {
        cartCount.style.display = 'none';
    }
}

// Initial fetch and cart count
fetchProducts();
updateCartCount();

// Refresh Products Button
const refreshBtn = document.getElementById('refresh-products');
refreshBtn.addEventListener('click', fetchProducts);

// Shop Now Button scroll
const shopNowBtn = document.getElementById('shop-now-btn');
shopNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
});
