// check this section for background js

// Main DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking a link
                if (navLinks?.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(18, 18, 18, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
            header.style.boxShadow = 'none';
        }
        lastScrollTop = scrollTop;
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value.trim() !== '') {
                alert('Thanks for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address');
            }
        });
    }

    // Featured items hover effect
    document.querySelectorAll('.featured-item').forEach(item => {
        item.addEventListener('mouseenter', () => item.style.borderColor = 'var(--bright-blue)');
        item.addEventListener('mouseleave', () => item.style.borderColor = 'transparent');
    });

    // Image preloader
    function preloadImages() {
        document.querySelectorAll('img[src^="images/"]').forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                const preloadLink = document.createElement('link');
                preloadLink.href = src;
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                document.head.appendChild(preloadLink);
            }
        });
    }
    preloadImages();

    // Hero background rotation
    const heroProductsElement = document.querySelector('.hero-products');
    if (heroProductsElement) {
        const images = [
            'Images/hydro-tower-generic.webp',
            'Images/plant-food.jpg',
            'Images/rockwood-thumbnail.jpg',
            'Images/led-grow-lights.jpg'
        ];
        let currentIndex = 0;

        function changeBackground() {
            heroProductsElement.classList.add('fade-out');
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % images.length;
                heroProductsElement.style.backgroundImage = 
                    `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${images[currentIndex]}')`;
                heroProductsElement.classList.remove('fade-out');
            }, 500); // Fixed duration to match fade-out transition
        }
        setInterval(changeBackground, 3000);
    }

    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    const productCards = document.querySelectorAll('.product-card');
    
    if (categoryFilter && productCards.length > 0) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                card.style.display = 
                    (selectedCategory === 'all' || cardCategory === selectedCategory) 
                    ? 'block' 
                    : 'none';
            });
        });
    }

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('jhHydroponicsCart')) || [];

    // DOM elements for cart
    const cartBadge = document.getElementById('cart-badge');

    // Update cart badge
    function updateCartBadge() {
        if (cartBadge) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('jhHydroponicsCart', JSON.stringify(cart));
    }

    // Add to cart function
    function addToCart(productId, name, price, image) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: name,
                price: parseFloat(price),
                image: image,
                quantity: 1
            });
        }
        saveCart();
        updateCartBadge();
        showNotification(`Added ${name} to cart!`);
    }

    // Display notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '1000',
            transition: 'opacity 0.5s'
        });

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }

    // Cart page specific functionality
    if (document.getElementById('cart-items')) {
        renderCart();
        document.getElementById('checkout-btn').addEventListener('click', processCheckout);
    }

    function renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart');
        const cartContents = document.getElementById('cart-contents');
        
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartContents.style.display = 'none';
            return;
        } else {
            emptyCartMessage.style.display = 'none';
            cartContents.style.display = 'block';
        }
        
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            const tr = document.createElement('tr');
            tr.dataset.id = item.id;
            tr.innerHTML = `
                <td data-label="Product">
                    <div class="cart-product">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-product-info">
                            <h4>${item.name}</h4>
                            <button class="remove-item" onclick="removeItem('${item.id}')">
                                <i class="fas fa-trash-alt"></i> Remove
                            </button>
                        </div>
                    </div>
                </td>
                <td data-label="Price">$${item.price.toFixed(2)}</td>
                <td data-label="Quantity">
                    <div class="quantity-control">
                        <div class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</div>
                        <input type="text" class="quantity-input" value="${item.quantity}" 
                               onchange="updateQuantityDirect('${item.id}', this.value)">
                        <div class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</div>
                    </div>
                </td>
                <td data-label="Total">$${itemTotal}</td>
            `;
            cartItemsContainer.appendChild(tr);
        });
        updateCartSummary();
    }

    function updateQuantity(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity + change);
            saveCart();
            renderCart();
            updateCartBadge();
        }
    }

    function updateQuantityDirect(id, value) {
        const quantity = parseInt(value);
        if (isNaN(quantity) || quantity < 1) return renderCart();
        
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = quantity;
            saveCart();
            renderCart();
            updateCartBadge();
        }
    }

    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
        updateCartBadge();
    }

    function updateCartSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const taxRate = 0.08;
        const tax = subtotal * taxRate;
        const shipping = subtotal >= 50 ? 0 : 5.99;
        const total = subtotal + tax + shipping;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    function processCheckout() {
        alert('Proceeding to checkout...');
    }

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent.replace('$', '');
            const productImage = productCard.querySelector('.product-image img').src;
            
            addToCart(productId, productName, productPrice, productImage);
        });
    });

    // Initialize cart with demo data if needed
    function initializeCart() {
        if (cart.length === 0 && window.location.search.includes('demo=true')) {
            addToCart(
                'light-1', 
                '3ft LED Grow Light Bulb', 
                19.95, 
                'Images/Products/lights/3ftbulb-product.webp'
            );
            addToCart(
                'light-2', 
                'Full Spectr+um LED Grow Light Bulb', 
                18.99, 
                'Images/Products/lights/bulb-products.webp'
            );
        }
    }
    
    // Initializations
    updateCartBadge();
    initializeCart();
});

// section opacity transition effect

    // script.js
    document.addEventListener('DOMContentLoaded', function() {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            threshold: 0.2 // Adjust the threshold as needed
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    });