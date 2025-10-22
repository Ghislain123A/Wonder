// Main JavaScript for WONDER ELECTRONICS website

// Authentication system
let currentUser = null;
let users = [];
let otpCodes = {}; // Store OTP codes for password recovery
let adminSupporters = []; // Store admin supporters/workers
let affiliateLinks = []; // Store affiliate links and tracking
let chatMessages = []; // Store chat messages
let profitData = {}; // Store profit analytics data

// Currency system
let currentCurrency = 'USD';
let currencyRates = {
    USD: 1.0,
    RWF: 1300.0,  // 1 USD = 1300 RWF (approximate)
    EUR: 0.85,    // 1 USD = 0.85 EUR (approximate)
    GBP: 0.73     // 1 USD = 0.73 GBP (approximate)
};

let currencySymbols = {
    USD: '$',
    RWF: 'RWF',
    EUR: '€',
    GBP: '£'
};

// Sample products data
let products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 999.99,
        category: "smartphones",
        description: "The latest iPhone with A17 Pro chip and titanium design",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        stock: 50,
        brand: "Apple"
    },
    {
        id: 2,
        name: "MacBook Pro M3",
        price: 1999.99,
        category: "laptops",
        description: "Powerful laptop with M3 chip for professionals",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        stock: 25,
        brand: "Apple"
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        price: 399.99,
        category: "audio",
        description: "Industry-leading noise canceling headphones",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        stock: 30,
        brand: "Sony"
    },
    {
        id: 4,
        name: "PlayStation 5",
        price: 499.99,
        category: "gaming",
        description: "Next-generation gaming console",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        stock: 15,
        brand: "Sony"
    },
    {
        id: 5,
        name: "Samsung Galaxy S24",
        price: 799.99,
        category: "smartphones",
        description: "Android flagship with AI-powered features",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        stock: 40,
        brand: "Samsung"
    },
    {
        id: 6,
        name: "Dell XPS 13",
        price: 1299.99,
        category: "laptops",
        description: "Ultrabook with stunning display and performance",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        stock: 20,
        brand: "Dell"
    }
];

// Load products from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    loadProductsFromStorage();
    loadUsersFromStorage();
    loadCurrentUser();
    loadCurrencySettings();
    loadCategoriesFromStorage();
    loadSocialMediaLinks(); // New: Load social media links
    loadWebsiteSettings(); // New: Load website settings
    loadTrendingCarousel(); // New: Load trending carousel
    displayProducts();
    updateCartDisplay();
    updateCategoryFilters();
    setupEventListeners();
    updateNavigation();
});

// Load products from localStorage
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('wonderElectronicsProducts');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Save initial products to localStorage
        saveProductsToStorage();
    }
}

// Save products to localStorage
function saveProductsToStorage() {
    localStorage.setItem('wonderElectronicsProducts', JSON.stringify(products));
}

// Load users from localStorage
function loadUsersFromStorage() {
    const storedUsers = localStorage.getItem('wonderElectronicsUsers');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // Create default admin user
        users = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@wonderelectronics.com',
                password: 'admin123',
                phone: '+1-555-0123',
                role: 'admin',
                joinDate: new Date().toISOString()
            }
        ];
        saveUsersToStorage();
    }
}

// Save users to localStorage
function saveUsersToStorage() {
    localStorage.setItem('wonderElectronicsUsers', JSON.stringify(users));
}

// Load current user from localStorage
function loadCurrentUser() {
    const storedUser = localStorage.getItem('wonderElectronicsCurrentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
}

// Save current user to localStorage
function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('wonderElectronicsCurrentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('wonderElectronicsCurrentUser');
    }
}

// Load currency settings from admin settings
function loadCurrencySettings() {
    const storedSettings = localStorage.getItem('wonderElectronicsSettings');
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        if (settings.usdToRwf) currencyRates.RWF = settings.usdToRwf;
        if (settings.usdToEur) currencyRates.EUR = settings.usdToEur;
        if (settings.usdToGbp) currencyRates.GBP = settings.usdToGbp;
        if (settings.currency) currentCurrency = settings.currency;
    }

    // Update currency selector
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.value = currentCurrency;
    }

    // Update currency toggle
    updateCurrencyToggle();

    // Update all prices on the website with the loaded currency
    updateAllPricesOnWebsite();
}

// Load categories from localStorage
function loadCategoriesFromStorage() {
    const storedCategories = localStorage.getItem('wonderElectronicsCategories');
    if (storedCategories) {
        window.categories = JSON.parse(storedCategories);
    } else {
        // Default categories if none exist
        window.categories = [
            { name: 'smartphones', displayName: 'Smartphones', icon: 'fas fa-mobile-alt' },
            { name: 'laptops', displayName: 'Laptops', icon: 'fas fa-laptop' },
            { name: 'audio', displayName: 'Audio', icon: 'fas fa-headphones' },
            { name: 'gaming', displayName: 'Gaming', icon: 'fas fa-gamepad' }
        ];
    }
}

// Update category filter buttons
function updateCategoryFilters() {
    const filterContainer = document.querySelector('.product-filters');
    if (!filterContainer || !window.categories) return;

    // Keep the "All Products" button
    const allButton = filterContainer.querySelector('[data-category="all"]');
    filterContainer.innerHTML = '';
    filterContainer.appendChild(allButton);

    // Add category buttons
    window.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.setAttribute('data-category', category.name);
        button.innerHTML = `<i class="${category.icon}"></i> ${category.displayName}`;
        filterContainer.appendChild(button);
    });

    // Re-attach event listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Filter products
            const category = button.getAttribute('data-category');
            displayProducts(category);
        });
    });
}

// Update navigation based on login status
function updateNavigation() {
    const loginNavItem = document.getElementById('loginNavItem');
    const userNavItem = document.getElementById('userNavItem');
    const userNameLink = document.getElementById('userNameLink');

    if (currentUser) {
        loginNavItem.style.display = 'none';
        userNavItem.style.display = 'block';
        userNameLink.textContent = `Welcome, ${currentUser.name}`;
    } else {
        loginNavItem.style.display = 'block';
        userNavItem.style.display = 'none';
    }
}

// Open login modal
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        switchTab('login');
    }
}

// Close login modal
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        // Clear forms
        document.getElementById('loginFormElement').reset();
        document.getElementById('signupFormElement').reset();
    }
}

// Switch between login and signup tabs
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Remove active class from all tabs and forms
    tabBtns.forEach(btn => btn.classList.remove('active'));
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');

    // Add active class to selected tab and form
    if (tab === 'login') {
        document.querySelector('.tab-btn[onclick="switchTab(\'login\')"]').classList.add('active');
        loginForm.classList.add('active');
    } else {
        document.querySelector('.tab-btn[onclick="switchTab(\'signup\')"]').classList.add('active');
        signupForm.classList.add('active');
    }
}

// Handle login
function handleLogin(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        saveCurrentUser();
        updateNavigation();
        closeLoginModal();
        showNotification(`Welcome back, ${user.name}!`, 'success');
        return true;
    } else {
        showNotification('Invalid email or password', 'error');
        return false;
    }
}

// Handle signup
function handleSignup(name, email, password, phone) {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showNotification('User with this email already exists', 'error');
        return false;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        phone: phone,
        role: 'customer',
        joinDate: new Date().toISOString()
    };

    users.push(newUser);
    saveUsersToStorage();

    // Auto-login the new user
    currentUser = newUser;
    saveCurrentUser();
    updateNavigation();
    closeLoginModal();
    showNotification(`Account created successfully! Welcome, ${name}!`, 'success');
    return true;
}

// Logout function
function logout() {
    currentUser = null;
    saveCurrentUser();
    updateNavigation();
    showNotification('You have been logged out', 'info');
}

// OTP and Password Recovery System
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOTP(phoneNumber) {
    const otp = generateOTP();
    otpCodes[phoneNumber] = {
        code: otp,
        timestamp: Date.now(),
        attempts: 0
    };

    // In a real application, you would send this OTP via SMS
    // For demo purposes, we'll show it in an alert
    alert(`OTP sent to ${phoneNumber}: ${otp}`);

    showNotification('OTP sent to your mobile number!', 'success');
    return otp;
}

function verifyOTP(phoneNumber, enteredOTP) {
    const otpData = otpCodes[phoneNumber];
    if (!otpData) {
        showNotification('No OTP found for this number', 'error');
        return false;
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - otpData.timestamp > 300000) {
        delete otpCodes[phoneNumber];
        showNotification('OTP has expired. Please request a new one.', 'error');
        return false;
    }

    // Check attempts limit
    if (otpData.attempts >= 3) {
        delete otpCodes[phoneNumber];
        showNotification('Too many failed attempts. Please request a new OTP.', 'error');
        return false;
    }

    if (otpData.code === enteredOTP) {
        delete otpCodes[phoneNumber];
        return true;
    } else {
        otpData.attempts++;
        showNotification('Invalid OTP. Please try again.', 'error');
        return false;
    }
}

function openPasswordRecoveryModal() {
    document.getElementById('passwordRecoveryModal').style.display = 'block';
}

function closePasswordRecoveryModal() {
    document.getElementById('passwordRecoveryModal').style.display = 'none';
}

function requestPasswordReset() {
    const email = document.getElementById('recoveryEmail').value;
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }

    // Check if user exists with this email
    const user = users.find(u => u.email === email);
    if (!user) {
        showNotification('No account found with this email address', 'error');
        return;
    }

    // Create password reset request
    const resetRequest = {
        id: Date.now(),
        userEmail: email,
        userName: user.name,
        requestDate: new Date().toISOString(),
        status: 'pending',
        adminNotified: false
    };

    // Save reset request
    let resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    resetRequests.push(resetRequest);
    localStorage.setItem('wonderElectronicsResetRequests', JSON.stringify(resetRequests));

    showNotification('Password reset request submitted. Admin will be notified and send you a new password via email.', 'success');
    closePasswordRecoveryModal();

    // Notify admin about password reset request
    notifyAdminPasswordReset(user, resetRequest);
}

function verifyOTPForRecovery() {
    const phoneNumber = document.getElementById('recoveryPhone').value;
    const otp = document.getElementById('recoveryOTP').value;

    if (verifyOTP(phoneNumber, otp)) {
        document.getElementById('otpSection').style.display = 'none';
        document.getElementById('newPasswordSection').style.display = 'block';
        showNotification('OTP verified! Please enter your new password.', 'success');
    }
}

function resetPassword() {
    const phoneNumber = document.getElementById('recoveryPhone').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Find user and update password
    const userIndex = users.findIndex(u => u.phone === phoneNumber);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        users[userIndex].passwordResetPending = true; // Flag for admin approval
        users[userIndex].passwordResetDate = new Date().toISOString();
        saveUsersToStorage();

        showNotification('Password reset request submitted. Please wait for admin approval.', 'success');
        closePasswordRecoveryModal();

        // Notify admin about pending password reset
        notifyAdminPasswordReset(users[userIndex]);
    }
}

function notifyAdminPasswordReset(user) {
    // In a real application, this would send a notification to admin
    console.log(`Password reset requested for user: ${user.name} (${user.email})`);
    showNotification('Admin has been notified of your password reset request.', 'info');
}

// Chat Support System
function openChatSupport() {
    const modal = document.getElementById('chatSupportModal');
    modal.style.display = 'block';
    modal.classList.add('show');
    loadChatMessages();
}

function closeChatSupport() {
    const modal = document.getElementById('chatSupportModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Wait for animation to complete
}

function loadChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    const storedMessages = localStorage.getItem('wonderElectronicsChatMessages');

    if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        chatMessages.innerHTML = '';
        messages.forEach(message => {
            addMessageToChat(message.text, message.sender, message.timestamp);
        });
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) return;

    // Get or create guest ID for non-logged-in users
    let userName = 'Guest';
    let userId = null;

    if (currentUser) {
        userName = currentUser.name;
        userId = currentUser.email;
    } else {
        // Create a unique guest ID if not exists
        userId = localStorage.getItem('wonderElectronicsGuestId');
        if (!userId) {
            userId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('wonderElectronicsGuestId', userId);
        }
        userName = 'Guest User';
    }

    addMessageToChat(message, 'user', new Date().toISOString());
    chatInput.value = '';

    // Save message to localStorage with user name and ID
    saveChatMessage(message, 'user', userName, userId);
}

function addMessageToChat(text, sender, timestamp) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const time = new Date(timestamp).toLocaleTimeString();
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveChatMessage(text, sender, userName, userId) {
    const messages = JSON.parse(localStorage.getItem('wonderElectronicsChatMessages') || '[]');
    messages.push({
        text: text,
        sender: sender,
        userName: userName || (currentUser ? currentUser.name : 'Guest User'),
        userId: userId || (currentUser ? currentUser.email : localStorage.getItem('wonderElectronicsGuestId')),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('wonderElectronicsChatMessages', JSON.stringify(messages));
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Social Media Integration
function loadSocialMediaLinks() {
    const settings = JSON.parse(localStorage.getItem('wonderElectronicsSettings') || '{}');

    // Update social media names (numbers are fixed)
    const instagramName = document.getElementById('instagramName');
    if (instagramName) {
        instagramName.textContent = settings.instagramName || 'Wonder Electronics';
    }

    const facebookName = document.getElementById('facebookName');
    if (facebookName) {
        facebookName.textContent = settings.facebookName || 'Wonder Electronics';
    }

    const tiktokName = document.getElementById('tiktokName');
    if (tiktokName) {
        tiktokName.textContent = settings.tiktokName || 'Wonder Electronics';
    }

    // WhatsApp contact is fixed at +250787070049
}

// Check if stock quantity should be displayed
function shouldShowStock() {
    const settings = JSON.parse(localStorage.getItem('wonderElectronicsSettings') || '{}');
    return settings.showStockQuantity !== false; // Default to true if not set
}

// Product Detail Modal Functions
let currentDetailProduct = null;
let selectedColor = null;

function openProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentDetailProduct = product;
    selectedColor = null;

    // Populate modal with product details
    document.getElementById('detailProductName').textContent = product.name;

    // Badges
    let badges = '';
    if (product.condition) {
        badges += `<span class="product-condition-badge ${product.condition === 'N' ? 'new' : 'used'}">${product.condition === 'N' ? 'NEW' : 'USED'}</span>`;
    }
    if (product.discount && product.discount > 0) {
        badges += `<span class="product-discount-badge" style="margin-left: 0.5rem;">${product.discount}% OFF</span>`;
    }
    document.getElementById('detailProductBadges').innerHTML = badges;

    // Price
    let priceHTML = '';
    if (product.discount && product.discount > 0) {
        priceHTML = `
            <div class="detail-price">
                <span class="original-price">${formatCurrency(product.price)}</span>
                <span class="sale-price">${formatCurrency(product.price * (1 - product.discount / 100))}</span>
            </div>
        `;
    } else {
        priceHTML = `<div class="detail-price">${formatCurrency(product.price)}</div>`;
    }
    document.getElementById('detailProductPrice').innerHTML = priceHTML;

    // Description
    document.getElementById('detailProductDescription').textContent = product.description;

    // Brand
    document.getElementById('detailProductBrand').textContent = product.brand;

    // Stock
    if (shouldShowStock()) {
        document.getElementById('detailProductStock').innerHTML = `
            <div style="margin: 1rem 0; padding: 0.8rem; background: #e8f5e8; border-radius: 8px; color: #2e7d32;">
                <i class="fas fa-box"></i> <strong>${product.stock} units</strong> in stock
            </div>
        `;
    } else {
        document.getElementById('detailProductStock').innerHTML = '';
    }

    // Images
    displayProductImages(product);

    // Colors
    if (product.colors && product.colors.length > 0) {
        document.getElementById('colorSection').style.display = 'block';
        displayColorOptions(product.colors);
    } else {
        document.getElementById('colorSection').style.display = 'none';
    }

    // Add to cart button
    document.getElementById('addToCartDetailBtn').onclick = () => {
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            showNotification('Please select a color', 'error');
            return;
        }
        addToCart(product.id, selectedColor);
        closeProductDetail();
    };

    // Show modal
    document.getElementById('productDetailModal').style.display = 'block';
}

function closeProductDetail() {
    document.getElementById('productDetailModal').style.display = 'none';
    currentDetailProduct = null;
    selectedColor = null;
}

function displayProductImages(product) {
    const mainImageContainer = document.getElementById('mainProductImage');
    const thumbnailContainer = document.getElementById('thumbnailImages');

    // Collect all images
    let allImages = [product.image];
    if (product.images && product.images.length > 0) {
        allImages = allImages.concat(product.images);
    }

    // Display main image
    mainImageContainer.innerHTML = `<img src="${allImages[0]}" alt="${product.name}" class="detail-main-image">`;

    // Display thumbnails
    if (allImages.length > 1) {
        thumbnailContainer.innerHTML = allImages.map((img, index) => `
            <img src="${img}" alt="${product.name} ${index + 1}" class="thumbnail-image" onclick="changeMainImage('${img}')">
        `).join('');
    } else {
        thumbnailContainer.innerHTML = '';
    }
}

function changeMainImage(imageSrc) {
    document.getElementById('mainProductImage').innerHTML = `<img src="${imageSrc}" alt="Product" class="detail-main-image">`;
}

function displayColorOptions(colors) {
    const colorContainer = document.getElementById('colorOptions');
    colorContainer.innerHTML = colors.map(color => `
        <button class="color-option" onclick="selectColor('${color}')" data-color="${color}">
            ${color}
        </button>
    `).join('');
}

function selectColor(color) {
    selectedColor = color;

    // Update UI
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === color) {
            btn.classList.add('selected');
        }
    });

    showNotification(`Selected color: ${color}`, 'info');
}

// Load website settings and update client-side content
function loadWebsiteSettings() {
    const settings = JSON.parse(localStorage.getItem('wonderElectronicsSettings') || '{}');

    // Update site title
    if (settings.siteTitle) {
        document.title = settings.siteTitle;
        const logo = document.querySelector('.nav-logo h2');
        if (logo) logo.textContent = settings.siteTitle;
    }

    // Update hero section
    if (settings.heroTitle) {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) heroTitle.textContent = settings.heroTitle;
    }

    if (settings.heroSubtitle) {
        const heroSubtitle = document.querySelector('.hero-content p');
        if (heroSubtitle) heroSubtitle.textContent = settings.heroSubtitle;
    }

    // Update about section
    if (settings.aboutTitle) {
        const aboutTitle = document.querySelector('#about h2');
        if (aboutTitle) aboutTitle.textContent = settings.aboutTitle;
    }

    if (settings.aboutContent) {
        const aboutContent = document.querySelector('#about p');
        if (aboutContent) aboutContent.textContent = settings.aboutContent;
    }

    // Update contact information
    if (settings.contactPhone) {
        const phoneElement = document.querySelector('.contact-item:nth-child(1) p');
        if (phoneElement) phoneElement.textContent = settings.contactPhone;
    }

    if (settings.contactEmail) {
        const emailElement = document.querySelector('.contact-item:nth-child(2) p');
        if (emailElement) emailElement.textContent = settings.contactEmail;
    }

    if (settings.contactAddress) {
        const addressElement = document.querySelector('.contact-item:nth-child(3) p');
        if (addressElement) addressElement.textContent = settings.contactAddress;
    }

    // Update currency rates
    if (settings.usdToRwf) currencyRates.RWF = settings.usdToRwf;
    if (settings.usdToEur) currencyRates.EUR = settings.usdToEur;
    if (settings.usdToGbp) currencyRates.GBP = settings.usdToGbp;
    if (settings.currency) currentCurrency = settings.currency;

    // Update currency toggle
    updateCurrencyToggle();
}

// Trending Slideshow Functions
let currentSlide = 0;
let slideshowImages = [];

function loadTrendingCarousel() {
    const stored = localStorage.getItem('wonderElectronicsSlideshowImages');

    if (stored && stored !== '[]') {
        try {
            slideshowImages = JSON.parse(stored);
            console.log('Loaded', slideshowImages.length, 'slides from storage');
        } catch (e) {
            console.error('Error parsing slideshow images:', e);
            slideshowImages = [];
        }
    }

    // Only create defaults if no slides exist
    if (!slideshowImages || slideshowImages.length === 0) {
        slideshowImages = [
            {
                id: 1,
                image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200',
                title: 'Welcome to Wonder Electronics',
                description: 'Your trusted electronics store'
            },
            {
                id: 2,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
                title: 'Latest Electronics',
                description: 'Discover amazing deals'
            },
            {
                id: 3,
                image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200',
                title: 'Quality Products',
                description: 'Best prices guaranteed'
            }
        ];
        // Save default slides only if empty
        localStorage.setItem('wonderElectronicsSlideshowImages', JSON.stringify(slideshowImages));
        console.log('Created default slides');
    }

    console.log('Displaying slideshow with', slideshowImages.length, 'slides');
    displayTrendingSlides();

    if (slideshowImages.length > 1) {
        startCarousel();
    }
}

// Search Products Function
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (!searchTerm) {
        displayProducts();
        return;
    }

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm))
    );

    displayProducts('all', filtered);

    // Scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function displayTrendingSlides() {
    const slidesContainer = document.getElementById('slideshowContainer');
    const indicatorsContainer = document.getElementById('slideshowIndicators');

    if (!slidesContainer || !indicatorsContainer) {
        console.error('Slideshow containers not found');
        return;
    }

    slidesContainer.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    if (!slideshowImages || slideshowImages.length === 0) {
        console.warn('No slideshow images to display');
        slidesContainer.innerHTML = '<div style="height: 450px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #666; border-radius: 20px;"><p>No slideshow images available. Add slides in Admin Panel.</p></div>';
        return;
    }

    console.log('Creating slideshow with', slideshowImages.length, 'slides:', slideshowImages);

    slideshowImages.forEach((slide, index) => {
        console.log('Adding slide', index + 1, ':', slide.image);

        // Create slide
        const slideDiv = document.createElement('div');
        slideDiv.className = `slideshow-slide ${index === 0 ? 'active' : ''}`;
        slideDiv.innerHTML = `
            <img src="${slide.image}" alt="${slide.title || 'Slide ' + (index + 1)}" 
                 onerror="this.src='https://via.placeholder.com/1200x450?text=Image+Not+Found'"
                 onload="console.log('Slide ${index + 1} image loaded successfully')">
            ${slide.title || slide.description ? `
                <div class="slide-overlay">
                    ${slide.title ? `<h3>${slide.title}</h3>` : ''}
                    ${slide.description ? `<p>${slide.description}</p>` : ''}
                </div>
            ` : ''}
        `;
        slidesContainer.appendChild(slideDiv);

        // Create indicator
        const indicator = document.createElement('button');
        indicator.className = `slideshow-indicator ${index === 0 ? 'active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicatorsContainer.appendChild(indicator);
    });

    console.log('✓ Slideshow displayed successfully with', slidesContainer.children.length, 'slides');
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slideshow-slide');
    const indicators = document.querySelectorAll('.slideshow-indicator');

    if (slides.length === 0) return;

    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');

    // Calculate new slide index
    currentSlide += direction;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slideshow-slide');
    const indicators = document.querySelectorAll('.slideshow-indicator');

    if (slides.length === 0) return;

    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');

    // Set new slide
    currentSlide = index;

    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
}

function startCarousel() {
    setInterval(() => {
        changeSlide(1);
    }, 3000); // Change slide every 3 seconds
}

// Currency conversion functions
function convertCurrency(amount, fromCurrency = 'USD', toCurrency = currentCurrency) {
    if (fromCurrency === toCurrency) return amount;

    // Convert to USD first, then to target currency
    const usdAmount = amount / currencyRates[fromCurrency];
    return usdAmount * currencyRates[toCurrency];
}

function formatCurrency(amount, currency = currentCurrency) {
    const convertedAmount = convertCurrency(amount, 'USD', currency);
    const symbol = currencySymbols[currency];

    if (currency === 'RWF') {
        return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
    } else {
        return `${symbol}${convertedAmount.toFixed(2)}`;
    }
}

function changeCurrency() {
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currentCurrency = currencySelect.value;
        updateCartDisplay();
        updateCurrencyAmounts();
        updateCurrencyToggle();
        // Update all prices on the website
        updateAllPricesOnWebsite();
    }
}

function updateCurrencyAmounts() {
    const currencyAmountsContainer = document.getElementById('currencyAmounts');
    if (!currencyAmountsContainer) return;

    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const currencies = ['USD', 'RWF', 'EUR', 'GBP'];

    currencyAmountsContainer.innerHTML = currencies.map(currency => {
        const convertedTotal = convertCurrency(total, 'USD', currency);
        const symbol = currencySymbols[currency];
        const formattedAmount = currency === 'RWF'
            ? `${symbol}${Math.round(convertedTotal).toLocaleString()}`
            : `${symbol}${convertedTotal.toFixed(2)}`;

        return `
            <div class="currency-amount ${currency === currentCurrency ? 'selected' : ''}" 
                 onclick="selectCurrency('${currency}')">
                <span class="currency-code">${currency}</span>
                <span class="currency-value">${formattedAmount}</span>
            </div>
        `;
    }).join('');
}

function selectCurrency(currency) {
    currentCurrency = currency;
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.value = currency;
    }
    updateCartDisplay();
    updateCurrencyAmounts();
    updateCurrencyToggle();
    // Update all prices on the website
    updateAllPricesOnWebsite();
}

// Currency toggle functions
function toggleCurrency() {
    const dropdown = document.getElementById('currencyDropdown');
    const button = document.getElementById('currencyToggleBtn');

    if (dropdown) {
        dropdown.classList.toggle('show');
    }

    // Add click animation
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

function selectCurrencyFromDropdown(currency) {
    selectCurrency(currency);
    const dropdown = document.getElementById('currencyDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function updateCurrencyToggle() {
    const toggleBtn = document.getElementById('currencyToggleBtn');
    const toggleText = document.getElementById('currencyToggleText');
    const currencyIcons = {
        'USD': 'fas fa-dollar-sign',
        'RWF': 'fas fa-coins',
        'EUR': 'fas fa-euro-sign',
        'GBP': 'fas fa-pound-sign'
    };

    if (toggleBtn && toggleText) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = currencyIcons[currentCurrency] || 'fas fa-dollar-sign';
        }
        toggleText.textContent = currentCurrency;
    }

    // Update dropdown selection
    const currencyOptions = document.querySelectorAll('.currency-option');
    currencyOptions.forEach(option => {
        option.classList.remove('selected');
        const currencyText = option.textContent.trim();
        if (currencyText.includes(currentCurrency)) {
            option.classList.add('selected');
        }
    });
}

// Update all prices on the website when currency changes
function updateAllPricesOnWebsite() {
    // Update product prices in the main products section
    displayProducts();

    // Update cart display (this will also update cart summary)
    updateCartDisplay();

    // Update currency amounts in checkout if modal is open
    updateCurrencyAmounts();

    // Show notification about currency change
    showNotification(`💰 All prices now displayed in ${currentCurrency}`, 'success');
}

// Cart functionality
let cart = [];

// Load cart from localStorage
function loadCartFromStorage() {
    const storedCart = localStorage.getItem('wonderElectronicsCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('wonderElectronicsCart', JSON.stringify(cart));
}

// Update cart display
function updateCartDisplay() {
    loadCartFromStorage();
    updateCartCount();
    displayCartItems();
    updateCartSummary();
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <a href="#products" class="btn btn-primary" onclick="closeCart()">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';

        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    ${product.image ?
                `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 2rem; color: #6c757d;">
                             <i class="fas fa-mobile-alt"></i>
                         </div>` :
                `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 2rem; color: #6c757d;">
                             <i class="fas fa-mobile-alt"></i>
                         </div>`
            }
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${product.name}</div>
                    ${item.color ? `<div style="font-size: 0.85rem; color: #6c757d; margin-top: 0.25rem;"><i class="fas fa-palette"></i> Color: ${item.color}</div>` : ''}
                    ${(product.discount && product.discount > 0) ? `
                        <div class="cart-item-discount">${product.discount}% OFF</div>
                        <div class="cart-item-price">
                            <span style="text-decoration: line-through; color: #999; font-size: 0.9rem;">${formatCurrency(product.price)}</span>
                            <span style="color: #e74c3c; font-weight: 700;">${formatCurrency(product.price * (1 - product.discount / 100))}</span> each
                        </div>
                    ` : `
                        <div class="cart-item-price">${formatCurrency(product.price)} each</div>
                    `}
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${product.stock}" onchange="updateQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Update cart summary
function updateCartSummary() {
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return sum;

        // Calculate price with discount
        const discount = product.discount || 0;
        const finalPrice = product.price * (1 - discount / 100);
        return sum + (finalPrice * item.quantity);
    }, 0);

    document.getElementById('cartTotal').textContent = formatCurrency(total);
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > product.stock) {
        showNotification(`Only ${product.stock} items available in stock`, 'error');
        return;
    }

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        saveCartToStorage();
        updateCartDisplay();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}

// Open cart
function openCart() {
    updateCartDisplay();
    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
}

// Close cart
function closeCart() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    if (!currentUser) {
        showNotification('Please login to proceed with checkout', 'error');
        openLoginModal();
        return;
    }

    const modal = document.getElementById('checkoutModal');
    if (modal) {
        displayCheckoutItems();
        updateCurrencyAmounts();
        modal.style.display = 'block';
    }
}

// Display checkout items
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const checkoutTotalElement = document.getElementById('checkoutTotal');

    if (!checkoutItemsContainer || !checkoutTotalElement) return;

    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    checkoutItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';

        return `
            <div class="checkout-item">
                <span>${product.name} x${item.quantity}</span>
                <span>${formatCurrency(product.price * item.quantity)}</span>
            </div>
        `;
    }).join('');

    checkoutTotalElement.textContent = formatCurrency(total);
}

// Close checkout modal
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'none';
        // Clear form
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('paymentReference').value = '';
    }
}

// Copy phone number
function copyPhoneNumber() {
    const phoneNumber = '+250787070049';
    navigator.clipboard.writeText(phoneNumber).then(() => {
        showNotification('Phone number copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy phone number', 'error');
    });
}

// Place order
function placeOrder() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const paymentReference = document.getElementById('paymentReference').value;

    if (!customerName || !customerPhone || !customerAddress || !paymentReference) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Create order
    const order = {
        id: Date.now(),
        customerName,
        customerPhone,
        customerAddress,
        paymentReference,
        items: [...cart],
        subtotal: cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0),
        tax: cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0) * 0.05,
        total: cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0) * 1.05,
        status: 'pending',
        orderDate: new Date().toISOString()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    orders.push(order);
    localStorage.setItem('wonderElectronicsOrders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCartDisplay();

    // Close modal
    closeCheckoutModal();

    // Show success message
    showNotification(`Order placed successfully! Order #${order.id}`, 'success');
}

// Display products on the page
function displayProducts(filterCategory = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const filteredProducts = filterCategory === 'all'
        ? products
        : products.filter(product => product.category === filterCategory);

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found in this category.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';
    card.onclick = (e) => {
        // Don't open modal if clicking the add to cart button
        if (!e.target.closest('.add-to-cart')) {
            openProductDetail(product.id);
        }
    };
    card.innerHTML = `
        <div class="product-image">
            ${product.image ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 4rem; color: #6c757d;">
                    <i class="fas fa-mobile-alt"></i>
                </div>` :
            `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 4rem; color: #6c757d;">
                    <i class="fas fa-mobile-alt"></i>
                </div>`
        }
        </div>
        <div class="product-info">
            <div class="product-header">
                <div class="product-category">${product.category}</div>
                ${product.condition ? `<span class="product-condition-badge ${product.condition === 'N' ? 'new' : 'used'}">${product.condition === 'N' ? 'NEW' : 'USED'}</span>` : ''}
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-brand">Brand: ${product.brand}</div>
            ${(product.discount && product.discount > 0) ? `
                <div class="product-discount-badge">${product.discount}% OFF</div>
                <div class="product-price">
                    <span class="original-price">${formatCurrency(product.price)}</span>
                    <span class="sale-price">${formatCurrency(product.price * (1 - product.discount / 100))}</span>
                </div>
            ` : `
                <div class="product-price">${formatCurrency(product.price)}</div>
            `}
            ${shouldShowStock() ? `
                <div style="margin-bottom: 1rem; font-size: 0.9rem; color: #6c757d;">
                    Stock: ${product.stock} units
                </div>
            ` : ''}
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Filter products
            const category = button.getAttribute('data-category');
            displayProducts(category);
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');
            handleLogin(email, password);
        });
    }

    // Signup form submission
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const phone = formData.get('phone');
            handleSignup(name, email, password, phone);
        });
    }

    // Close modal when clicking outside
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }

    // Close currency dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const currencyToggle = document.querySelector('.currency-toggle');
        const currencyDropdown = document.getElementById('currencyDropdown');

        if (currencyToggle && currencyDropdown && !currencyToggle.contains(e.target)) {
            currencyDropdown.classList.remove('show');
        }
    });
}

// Add to cart functionality
function addToCart(productId, selectedColor = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
        showNotification('Sorry, this product is out of stock!', 'error');
        return;
    }

    // Load current cart
    loadCartFromStorage();

    // Check if product already exists in cart with same color
    const existingItem = cart.find(item => item.id === productId && item.color === selectedColor);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
        } else {
            showNotification('Cannot add more items. Stock limit reached!', 'error');
            return;
        }
    } else {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            discount: product.discount || 0
        };

        // Add color if selected
        if (selectedColor) {
            cartItem.color = selectedColor;
        }

        cart.push(cartItem);
    }

    // Save cart to localStorage
    saveCartToStorage();

    // Update cart display
    updateCartDisplay();

    // Show success message
    const colorMsg = selectedColor ? ` (${selectedColor})` : '';
    showNotification(`${product.name}${colorMsg} added to cart!`, 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Search functionality
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found matching your search.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Add search functionality if search input exists
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });
    }
});
