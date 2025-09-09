// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Click logo to view image on same page
const logo = document.getElementById('logo');
logo.addEventListener('click', () => {
    logo.style.width = "300px";
    logo.style.height = "300px";
    logo.style.borderRadius = "10px"; // slightly rounded for viewing
});

// Dynamic Products from JSON
const productContainer = document.querySelector('.product-cards');

fetch('assets/products.json')
    .then(response => response.json())
    .then(products => {
        productContainer.innerHTML = ''; // Clear any static cards

        products.forEach(product => {
            const discountedPrice = Math.round(product.originalPrice * (1 - product.discount));

            const card = document.createElement('div');
            card.classList.add('product-card');

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discounted-price">₹${discountedPrice}</span>
                    <span class="discount-tag">${product.discount * 100}% Off</span>
                </p>
                <button>Add to Cart</button>
            `;

            productContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        productContainer.innerHTML = '<p>Failed to load products.</p>';
    });


    // Cart functionality
const cartCount = document.querySelector('.cart-count');
let cartItems = 0; // Initial cart count

// Function to update the cart badge
function updateCart() {
    if(cartItems > 0){
        cartCount.textContent = cartItems;
        cartCount.style.display = 'inline'; // show badge
    } else {
        cartCount.style.display = 'none'; // hide badge if 0
    }
}

// Initially hide badge if no items
updateCart();

// Add event listeners to dynamically created "Add to Cart" buttons
productContainer.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON') {
        cartItems++;
        updateCart();
    }
});
