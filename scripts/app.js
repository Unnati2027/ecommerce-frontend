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

