

// script.js file for safe keeping
// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });

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
                if (navLinks.classList.contains('active')) {
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

    // Form submission for newsletter (prevent default for demo)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value.trim() !== '') {
                // In a real implementation, you would send this to a backend
                alert('Thanks for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address');
            }
        });
    }

    // Add hover effect for featured items
    const featuredItems = document.querySelectorAll('.featured-item');
    
    featuredItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--bright-blue)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.borderColor = 'transparent';
        });
    });

    // Simple image preloader for better UX
    function preloadImages() {
        const imagePlaceholders = document.querySelectorAll('img[src^="images/"]');
        imagePlaceholders.forEach(img => {
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
});


const heroProductsElement = document.querySelector('.hero-products');
const images = [
    'Images/hydro-tower-generic.webp',
    'Images/plant-food.jpg',
    'Images/rockwood-thumbnail.jpg',
    'Images/led-grow-lights.jpg',
    // Add more image paths as needed
];
let currentIndex = 0;

function changeBackground() {
    // Fade out
    heroProductsElement.classList.add('fade-out');

    // Wait for fade-out to complete (3s), then change image and fade in
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % images.length;
        heroProductsElement.style.backgroundImage =
            `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${images[currentIndex]}')`;

        // Fade in
        heroProductsElement.classList.remove('fade-out');
    }, 000); // Wait for fade-out transition to finish
}

// Change background every 12 seconds
setInterval(changeBackground, 6000);


// Product--All Page **category filter**
 // Get the category filter dropdown and all product cards
 const categoryFilter = document.getElementById('category-filter');
 const productCards = document.querySelectorAll('.product-card');

 // Listen for changes in the category dropdown
 categoryFilter.addEventListener('change', function () {
     const selectedCategory = this.value;

     productCards.forEach(card => {
         const cardCategory = card.getAttribute('data-category');

         // Show or hide product depending on selected category
         if (selectedCategory === 'all' || cardCategory === selectedCategory) {
             card.style.display = 'block';
         } else {
             card.style.display = 'none';
         }
     });
 });

















































// cart.js - Shopping cart functionality for J & H Hydroponics

// Cart data structure
let cart = JSON.parse(localStorage.getItem('jhHydroponicsCart')) || [];

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Update cart badge on every page
    updateCartBadge();
    
    // Initialize cart page specific elements if we're on the cart page
    if (document.getElementById('cart-items')) {
        renderCart();
        
        // Add checkout button event listener
        document.getElementById('checkout-btn').addEventListener('click', processCheckout);
    }
});

// Add to cart function
function addToCart(productId, name, price, image) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Increment quantity if already in cart
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            id: productId,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartBadge();
    
    // Show feedback to user
    showNotification(`Added ${name} to cart!`);
}

// Display a temporary notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.5s';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Update cart badge with current number of items
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        // Calculate total quantity across all items
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;
        
        // Show/hide badge based on items
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('jhHydroponicsCart', JSON.stringify(cart));
}

// Render the cart contents
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartContents = document.getElementById('cart-contents');
    
    // Show/hide appropriate sections based on cart state
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartContents.style.display = 'none';
        return;
    } else {
        emptyCartMessage.style.display = 'none';
        cartContents.style.display = 'block';
    }
    
    // Clear current items
    cartItemsContainer.innerHTML = '';
    
    // Add each item to the cart table
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
    
    // Update summary values
    updateCartSummary();
}

// Update the quantity of an item
function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        // Update quantity, ensuring it doesn't go below 1
        cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity + change);
        
        // Save and refresh UI
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

// Update quantity directly from input
function updateQuantityDirect(id, value) {
    const quantity = parseInt(value);
    
    // Validate input
    if (isNaN(quantity) || quantity < 1) {
        renderCart(); // Reset to valid value
        return;
    }
    
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        
        // Save and refresh UI
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

// Remove an item from the cart
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    
    // Save and refresh UI
    saveCart();
    renderCart();
    updateCartBadge();
}

// Update the order summary section
function updateCartSummary() {
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate tax
    const taxRate = 0.08; // 8%
    const tax = subtotal * taxRate;
    
    // Calculate shipping (free over $50)
    const shipping = subtotal >= 50 ? 0 : 5.99;
    
    // Calculate total
    const total = subtotal + tax + shipping;
    
    // Update UI
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Process checkout
function processCheckout() {
    // In a real application, this would redirect to a checkout page
    // or handle payment processing
    alert('Proceeding to checkout...');
    // You could redirect to a checkout page here
    // window.location.href = 'checkout.html';
}

// Initialize event listeners for add to cart buttons
document.addEventListener('DOMContentLoaded', function() {
    // Find all "Add to Cart" buttons on the product pages
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product info from parent elements
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent.replace('$', '');
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Add to cart
            addToCart(productId, productName, productPrice, productImage);
        });
    });
});

// Clear entire cart
function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    updateCartBadge();
}

// Initialize cart data
function initializeCart() {
    // For testing purposes - can be removed in production
    if (cart.length === 0 && window.location.search.includes('demo=true')) {
        // Add some sample items
        addToCart(
            'light-1', 
            '3ft LED Grow Light Bulb', 
            19.95, 
            'Images/Products/lights/3ftbulb-product.webp'
        );
        addToCart(
            'light-2', 
            'Full Spectrum LED Grow Light Bulb', 
            18.99, 
            'Images/Products/lights/bulb-products.webp'
        );
    }
}



// cart.js - Shopping cart functionality for J & H Hydroponics

// Cart data structure
let cart = JSON.parse(localStorage.getItem('jhHydroponicsCart')) || [];

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Update cart badge on every page
    updateCartBadge();
    
    // Initialize cart page specific elements if we're on the cart page
    if (document.getElementById('cart-items')) {
        renderCart();
        
        // Add checkout button event listener
        document.getElementById('checkout-btn').addEventListener('click', processCheckout);
    }
});

// Add to cart function
function addToCart(productId, name, price, image) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Increment quantity if already in cart
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            id: productId,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartBadge();
    
    // Show feedback to user
    showNotification(`Added ${name} to cart!`);
}

// Display a temporary notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.5s';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Update cart badge with current number of items
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        // Calculate total quantity across all items
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;
        
        // Show/hide badge based on items
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('jhHydroponicsCart', JSON.stringify(cart));
}

// Render the cart contents
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartContents = document.getElementById('cart-contents');
    
    // Show/hide appropriate sections based on cart state
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartContents.style.display = 'none';
        return;
    } else {
        emptyCartMessage.style.display = 'none';
        cartContents.style.display = 'block';
    }
    
    // Clear current items
    cartItemsContainer.innerHTML = '';
    
    // Add each item to the cart table
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
    
    // Update summary values
    updateCartSummary();
}

// Update the quantity of an item
function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        // Update quantity, ensuring it doesn't go below 1
        cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity + change);
        
        // Save and refresh UI
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

// Update quantity directly from input
function updateQuantityDirect(id, value) {
    const quantity = parseInt(value);
    
    // Validate input
    if (isNaN(quantity) || quantity < 1) {
        renderCart(); // Reset to valid value
        return;
    }
    
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        
        // Save and refresh UI
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

// Remove an item from the cart
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    
    // Save and refresh UI
    saveCart();
    renderCart();
    updateCartBadge();
}

// Update the order summary section
function updateCartSummary() {
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate tax
    const taxRate = 0.08; // 8%
    const tax = subtotal * taxRate;
    
    // Calculate shipping (free over $50)
    const shipping = subtotal >= 50 ? 0 : 5.99;
    
    // Calculate total
    const total = subtotal + tax + shipping;
    
    // Update UI
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Process checkout
function processCheckout() {
    // In a real application, this would redirect to a checkout page
    // or handle payment processing
    alert('Proceeding to checkout...');
    // You could redirect to a checkout page here
    // window.location.href = 'checkout.html';
}

// Initialize event listeners for add to cart buttons
document.addEventListener('DOMContentLoaded', function() {
    // Find all "Add to Cart" buttons on the product pages
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product info from parent elements
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent.replace('$', '');
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Add to cart
            addToCart(productId, productName, productPrice, productImage);
        });
    });
});

// Clear entire cart
function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    updateCartBadge();
}

// Initialize cart data
function initializeCart() {
    // For testing purposes - can be removed in production
    if (cart.length === 0 && window.location.search.includes('demo=true')) {
        // Add some sample items
        addToCart(
            'light-1', 
            '3ft LED Grow Light Bulb', 
            19.95, 
            'Images/Products/lights/3ftbulb-product.webp'
        );
        addToCart(
            'light-2', 
            'Full Spectrum LED Grow Light Bulb', 
            18.99, 
            'Images/Products/lights/bulb-products.webp'
        );
    }
}




