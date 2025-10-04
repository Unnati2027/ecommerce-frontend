// ===== Select DOM elements ===== 
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

// ===== Get Product ID from URL =====
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id')) || 1;

// ===== Fetch Product Data =====
fetch('assets/products.json')
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id === productId);
    if (product) {
      currentProduct = product;
      renderProduct(product);
      addToCartBtn.disabled = false; // enable after product loads
    } else {
      productTitle.textContent = "Product Not Found";
      addToCartBtn.disabled = true;
    }
  })
  .catch(err => {
    console.error("Error loading products.json:", err);
    productTitle.textContent = "Failed to load product";
    addToCartBtn.disabled = true;
  });

// ===== Render Product Details =====
function renderProduct(product) {
  productTitle.textContent = product.title;
  productDescription.textContent = product.description;
  discountedPriceEl.textContent = `₹${product.discountedPrice}`;
  originalPriceEl.textContent = `₹${product.price}`;
  discountTagEl.textContent = `${product.discount}% OFF`;
  mainImage.src = product.image;

  basePrice = product.discountedPrice;
  totalPriceEl.textContent = `₹${basePrice}`;

  // Populate sizes and colors
  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Black", "White", "Red", "Blue"];
  sizeSelect.innerHTML = sizes.map(s => `<option value="${s}">${s}</option>`).join('');
  colorSelect.innerHTML = colors.map(c => `<option value="${c}">${c}</option>`).join('');
}

// ===== Quantity Control =====
plusBtn.addEventListener('click', () => {
  quantity++;
  quantitySpan.textContent = quantity;
  updateTotal();
});

minusBtn.addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    quantitySpan.textContent = quantity;
    updateTotal();
  }
});

// ===== Update Total Price =====
function updateTotal() {
  let total = basePrice * quantity;
  totalPriceEl.textContent = `₹${total.toFixed(2)}`;
}

// ===== Variation Selection =====
[sizeSelect, colorSelect].forEach(select => {
  select.addEventListener('change', () => updateTotal());
});

// ===== Image Zoom on Hover =====
mainImage.addEventListener('mousemove', (e) => {
  const { left, top, width, height } = mainImage.getBoundingClientRect();
  const x = ((e.pageX - left - window.scrollX) / width) * 100;
  const y = ((e.pageY - top - window.scrollY) / height) * 100;
  mainImage.style.transformOrigin = `${x}% ${y}%`;
  mainImage.style.transform = 'scale(2)';
});

mainImage.addEventListener('mouseleave', () => {
  mainImage.style.transform = 'scale(1)';
});

// ===== Lightbox =====
mainImage.addEventListener('click', () => {
  lightbox.style.display = 'block';
  lightboxImg.src = mainImage.src;
});

lightboxClose.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});

// ===== Add to Cart =====
addToCartBtn.addEventListener('click', () => {
  if (!currentProduct) return alert("Product not loaded yet.");

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === currentProduct.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: currentProduct.id,
      title: currentProduct.title,
      image: currentProduct.image,
      price: currentProduct.price,
      discountedPrice: currentProduct.discountedPrice,
      discount: currentProduct.discount,
      quantity,
      size: sizeSelect.value,
      color: colorSelect.value
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  // Success message
  const msg = document.createElement('div');
  msg.textContent = "✅ Product added to cart!";
  msg.style.position = 'fixed';
  msg.style.top = '20px';
  msg.style.right = '20px';
  msg.style.background = '#27ae60';
  msg.style.color = '#fff';
  msg.style.padding = '10px 15px';
  msg.style.borderRadius = '5px';
  msg.style.zIndex = 10000;
  document.body.appendChild(msg);
  setTimeout(() => document.body.removeChild(msg), 2000);
});

// ===== Cart Count =====
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  if (count > 0) {
    cartCountEl.style.display = 'inline-block';
    cartCountEl.textContent = count;
  } else {
    cartCountEl.style.display = 'none';
  }
}
updateCartCount();
