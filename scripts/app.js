// scripts/app.js

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

// Function to fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();

        displayProducts(products);
    } catch (error) {
        productContainer.innerHTML = `<p style="color:red; font-weight:bold;">Failed to load products. Please try again later.</p>`;
        console.error('Error fetching products:', error);
    }
}

// Function to display products dynamically
function displayProducts(products) {
    productContainer.innerHTML = ''; // Clear loading spinner

    products.forEach(product => {
        // Generate random discount for demonstration
        const discountPercent = Math.floor(Math.random() * 31) + 10; // 10% - 40%
        const discountedPrice = (product.price * (1 - discountPercent / 100)).toFixed(2);

        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <h3>${product.title}</h3>
            <div class="price">
                <span class="original-price">$${product.price}</span>
                <span class="discounted-price">$${discountedPrice}</span>
            </div>
            <div class="discount-tag">${discountPercent}% OFF</div>
            <button>Add to Cart</button>
        `;

        productContainer.appendChild(productCard);
    });
}

// Initial fetch
fetchProducts();

// Optional: Refresh Products Button (if you want)
const refreshBtn = document.createElement('button');
refreshBtn.textContent = 'Refresh Products';
refreshBtn.className = 'cta-btn';
refreshBtn.style.marginBottom = '20px';
refreshBtn.addEventListener('click', fetchProducts);

// Insert the button above the product grid
productContainer.parentElement.insertBefore(refreshBtn, productContainer);
