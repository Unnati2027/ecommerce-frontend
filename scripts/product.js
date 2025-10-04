const minusBtn = document.getElementById('decrease-qty');
const plusBtn = document.getElementById('increase-qty');
const quantitySpan = document.getElementById('quantity');
const totalPriceEl = document.getElementById('total-price');
const productTitle = document.getElementById('product-title');
const productDescription = document.getElementById('product-description');
const discountedPriceEl = document.getElementById('discounted-price');
const originalPriceEl = document.getElementById('original-price');
const discountTagEl = document.getElementById('discount-tag');
const mainImage = document.getElementById('main-product-image');
const sizeSelect = document.getElementById('size-select');
const colorSelect = document.getElementById('color-select');
const addToCartBtn = document.getElementById('add-to-cart');
const cartCountEl = document.querySelector('.cart-count');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.close');

let quantity = 1;
let basePrice = 0;
let currentProduct = null;

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id')) || 1;

// Fetch product data
fetch('assets/products.json')
.then(res => res.json())
.then(products => {
    const product = products.find(p => p.id === productId);
    if (product) {
        currentProduct = product;
        renderProduct(product);
    } else {
        productTitle.textContent = "Product Not Found";
    }
})
.catch(err => console.error("Error loading product.json:", err));

function renderProduct(product) {
    productTitle.textContent = product.title;
    productDescription.textContent = product.description;
    discountedPriceEl.textContent = `₹${product.discountedPrice}`;
    originalPriceEl.textContent = `₹${product.price}`;
    discountTagEl.textContent = `${product.discount}% OFF`;
    mainImage.src = product.image;

    basePrice = product.discountedPrice;
    totalPriceEl.textContent = `₹${basePrice.toFixed(2)}`;

    const sizes = ["S","M","L","XL"];
    const colors = ["Black","White","Red","Blue"];
    sizeSelect.innerHTML = sizes.map(s => `<option value="${s}">${s}</option>`).join('');
    colorSelect.innerHTML = colors.map(c => `<option value="${c}">${c}</option>`).join('');
}

// Quantity buttons
plusBtn.addEventListener('click', () => { quantity++; quantitySpan.textContent = quantity; updateTotal(); });
minusBtn.addEventListener('click', () => { if(quantity>1){ quantity--; quantitySpan.textContent=quantity; updateTotal(); } });

function updateTotal(){ totalPriceEl.textContent = `₹${(basePrice*quantity).toFixed(2)}`; }

// Lightbox
mainImage.addEventListener('click', ()=>{ lightbox.style.display='block'; lightboxImg.src=mainImage.src; });
lightboxClose.addEventListener('click', ()=>{ lightbox.style.display='none'; });
lightbox.addEventListener('click', e=>{ if(e.target===lightbox) lightbox.style.display='none'; });

// Add to cart
addToCartBtn.addEventListener('click', () => {
    if(!currentProduct) return alert("Product not loaded yet.");
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === currentProduct.id);
    if(existing) { existing.quantity += quantity; } 
    else { cart.push({...currentProduct, quantity, size:sizeSelect.value, color:colorSelect.value}); }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('✅ Product added to cart!');
});

// Update cart count
function updateCartCount(){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum,i)=>sum+i.quantity,0);
    if(count>0){ cartCountEl.style.display='inline-block'; cartCountEl.textContent=count; }
    else{ cartCountEl.style.display='none'; }
}
updateCartCount();