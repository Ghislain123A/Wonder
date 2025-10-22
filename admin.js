// Admin JavaScript for WONDER ELECTRONICS

let products = [];
let users = [];
let categories = [];
let currentEditingId = null;

// Load products from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    loadProductsFromStorage();
    loadUsersFromStorage();
    loadCategoriesFromStorage();
    loadWebsiteSettings();
    displayProductsTable();
    displayUsersTable();
    displayCategoriesTable();
    displayOrdersTable();
    displayPasswordResetRequests(); // New: Display password reset requests
    displaySlidesGrid(); // New: Display slideshow
    loadChatSessions(); // New: Load chat sessions
    updateUserStats();
    setupAdminEventListeners();
    setupAdminNavigation(); // Setup admin menu navigation
});

// Load products from localStorage
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('wonderElectronicsProducts');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Initialize with sample products if none exist
        products = [
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
                joinDate: new Date().toISOString(),
                status: 'active'
            }
        ];
        saveUsersToStorage();
    }
}

// Save users to localStorage
function saveUsersToStorage() {
    localStorage.setItem('wonderElectronicsUsers', JSON.stringify(users));
}

// Display users in table
function displayUsersTable() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No users found.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        const joinDate = new Date(user.joinDate).toLocaleDateString();
        const status = user.status || 'active';

        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="user-role ${user.role}">${user.role}</span></td>
            <td>${joinDate}</td>
            <td><span class="user-status ${status}">${status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})" ${user.role === 'admin' ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update user statistics
function updateUserStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => (user.status || 'active') === 'active').length;
    const today = new Date().toDateString();
    const newUsersToday = users.filter(user =>
        new Date(user.joinDate).toDateString() === today
    ).length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('newUsersToday').textContent = newUsersToday;
}

// Edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newName = prompt('Enter new name:', user.name);
    if (newName && newName !== user.name) {
        user.name = newName;
        saveUsersToStorage();
        displayUsersTable();
        updateUserStats();
        showNotification('User updated successfully!', 'success');
    }
}

// Delete user
function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.role === 'admin') {
        showNotification('Cannot delete admin user', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            saveUsersToStorage();
            displayUsersTable();
            updateUserStats();
            showNotification('User deleted successfully!', 'success');
        }
    }
}

// Setup admin event listeners
function setupAdminEventListeners() {
    // Admin menu navigation
    const adminLinks = document.querySelectorAll('.admin-link');
    const adminSections = document.querySelectorAll('.admin-section');

    adminLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and sections
            adminLinks.forEach(l => l.classList.remove('active'));
            adminSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Product form submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleAddProduct);
    }

    // Edit product form submission
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', handleEditProduct);
    }

    // Modal close functionality
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Settings form submissions
    const settingsForms = [
        'generalSettingsForm',
        'heroSettingsForm',
        'aboutSettingsForm',
        'contactSettingsForm',
        'paymentSettingsForm'
    ];

    settingsForms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleSettingsFormSubmit(formId);
            });
        }
    });

    // Category form submission
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', handleAddCategory);
    }

    // Update product category dropdown
    updateProductCategoryDropdown();
}

// Handle settings form submission
function handleSettingsFormSubmit(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);

    // Update website settings based on form
    switch (formId) {
        case 'generalSettingsForm':
            websiteSettings.siteTitle = formData.get('siteTitle');
            websiteSettings.siteDescription = formData.get('siteDescription');
            websiteSettings.currency = formData.get('currency');
            websiteSettings.taxRate = parseFloat(formData.get('taxRate'));
            websiteSettings.usdToRwf = parseFloat(formData.get('usdToRwf'));
            websiteSettings.usdToEur = parseFloat(formData.get('usdToEur'));
            websiteSettings.usdToGbp = parseFloat(formData.get('usdToGbp'));
            websiteSettings.showStockQuantity = formData.get('showStockQuantity') === 'true';
            break;
        case 'socialSettingsForm':
            websiteSettings.instagramName = formData.get('instagramName');
            websiteSettings.facebookName = formData.get('facebookName');
            websiteSettings.tiktokName = formData.get('tiktokName');
            break;
        case 'heroSettingsForm':
            websiteSettings.heroTitle = formData.get('heroTitle');
            websiteSettings.heroSubtitle = formData.get('heroSubtitle');
            websiteSettings.heroButtonText = formData.get('heroButtonText');
            break;
        case 'aboutSettingsForm':
            websiteSettings.aboutTitle = formData.get('aboutTitle');
            websiteSettings.aboutContent = formData.get('aboutContent');
            break;
        case 'contactSettingsForm':
            websiteSettings.contactPhone = formData.get('contactPhone');
            websiteSettings.contactEmail = formData.get('contactEmail');
            websiteSettings.contactAddress = formData.get('contactAddress');
            break;
        case 'paymentSettingsForm':
            websiteSettings.paymentPhone = formData.get('paymentPhone');
            websiteSettings.paymentInstructions = formData.get('paymentInstructions');
            websiteSettings.deliveryFee = parseFloat(formData.get('deliveryFee'));
            break;
    }

    saveWebsiteSettings();
    showNotification('Settings saved successfully!', 'success');
}

// Handle add category form submission
function handleAddCategory(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newCategory = {
        id: Date.now(),
        name: formData.get('categoryName').toLowerCase().replace(/\s+/g, '-'),
        displayName: formData.get('categoryName'),
        icon: formData.get('categoryIcon'),
        description: formData.get('categoryDescription'),
        isDefault: false
    };

    // Validate required fields
    if (!newCategory.displayName || !newCategory.icon) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Check if category already exists
    const existingCategory = categories.find(c => c.name === newCategory.name);
    if (existingCategory) {
        showNotification('Category with this name already exists', 'error');
        return;
    }

    // Add category to array
    categories.push(newCategory);
    saveCategoriesToStorage();

    // Clear form
    e.target.reset();

    // Show success message
    showNotification('Category added successfully!', 'success');

    // Refresh categories table
    displayCategoriesTable();

    // Update product category dropdown
    updateProductCategoryDropdown();
}

// Update product category dropdown with current categories
function updateProductCategoryDropdown() {
    const categorySelects = document.querySelectorAll('#productCategory, #editProductCategory');

    categorySelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Category</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.displayName;
            select.appendChild(option);
        });

        // Restore selected value if it still exists
        if (currentValue && categories.find(c => c.name === currentValue)) {
            select.value = currentValue;
        }
    });
}

// Handle add product form submission
function handleAddProduct(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Get additional images
    const additionalImagesText = formData.get('productImages');
    let additionalImages = [];
    if (additionalImagesText && additionalImagesText.trim()) {
        additionalImages = additionalImagesText.trim().split('\n').filter(url => url.trim());
    }

    const newProduct = {
        id: Date.now(), // Simple ID generation
        name: formData.get('productName'),
        price: parseFloat(formData.get('productPrice')),
        category: formData.get('productCategory'),
        description: formData.get('productDescription'),
        image: formData.get('productImage') || '',
        images: additionalImages, // Multiple images
        stock: parseInt(formData.get('productStock')),
        brand: formData.get('productBrand'),
        discount: parseInt(formData.get('productDiscount')) || 0,
        condition: formData.get('productCondition') || 'N',
        colors: formData.get('productColors') ? formData.get('productColors').split(',').map(c => c.trim()).filter(c => c) : []
    };

    // Validate required fields
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.description || !newProduct.brand) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Add product to array
    products.push(newProduct);
    saveProductsToStorage();

    // Clear form
    e.target.reset();

    // Show success message
    showNotification('Product added successfully!', 'success');

    // Refresh products table
    displayProductsTable();
}

// Handle edit product form submission
function handleEditProduct(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const productId = parseInt(document.getElementById('editProductId').value);

    const updatedProduct = {
        id: productId,
        name: formData.get('productName'),
        price: parseFloat(formData.get('productPrice')),
        category: formData.get('productCategory'),
        description: formData.get('productDescription'),
        image: formData.get('productImage') || '',
        stock: parseInt(formData.get('productStock')),
        brand: formData.get('productBrand')
    };

    // Find and update product
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = updatedProduct;
        saveProductsToStorage();

        // Close modal
        closeModal();

        // Show success message
        showNotification('Product updated successfully!', 'success');

        // Refresh products table
        displayProductsTable();
    }
}

// Display products in table
function displayProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No products found. Add some products to get started!</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        const discount = product.discount || 0;
        const discountBadge = discount > 0
            ? `<span class="discount-badge">${discount}% OFF</span>`
            : '<span style="color: #999;">No discount</span>';

        const condition = product.condition || 'N';
        const conditionBadge = condition === 'N'
            ? `<span class="condition-badge new">N - New</span>`
            : `<span class="condition-badge used">S - Second-hand</span>`;

        const colors = product.colors && product.colors.length > 0
            ? product.colors.join(', ')
            : '<span style="color: #999;">No colors</span>';

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${conditionBadge}</td>
            <td>${discountBadge}</td>
            <td>${colors}</td>
            <td>${product.stock}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-info" onclick="toggleCondition(${product.id})">
                        <i class="fas fa-tag"></i> Condition
                    </button>
                    <button class="btn btn-success" onclick="addDiscount(${product.id})">
                        <i class="fas fa-percent"></i> Discount
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Fill edit form with product data
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductImage').value = product.image;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductBrand').value = product.brand;

    // Show modal
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'block';
        currentEditingId = productId;
    }
}

// Toggle product condition (New/Second-hand)
function toggleCondition(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentCondition = product.condition || 'N';
    const conditionText = currentCondition === 'N' ? 'Brand New' : 'Second-hand';

    if (confirm(`Current condition: ${conditionText}\n\nChange to ${currentCondition === 'N' ? 'Second-hand (S)' : 'Brand New (N)'}?`)) {
        product.condition = currentCondition === 'N' ? 'S' : 'N';
        saveProductsToStorage();
        displayProductsTable();

        const newCondition = product.condition === 'N' ? 'Brand New' : 'Second-hand';
        showNotification(`${product.name} marked as ${newCondition}!`, 'success');
    }
}

// Add or update discount
function addDiscount(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentDiscount = product.discount || 0;
    const newDiscount = prompt(`Enter discount percentage for ${product.name}:\n(Current: ${currentDiscount}%, Enter 0 to remove discount)`, currentDiscount);

    if (newDiscount !== null) {
        const discountValue = parseInt(newDiscount);

        if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
            showNotification('Please enter a valid discount between 0 and 100', 'error');
            return;
        }

        product.discount = discountValue;
        saveProductsToStorage();
        displayProductsTable();

        if (discountValue > 0) {
            showNotification(`${discountValue}% discount added to ${product.name}!`, 'success');
        } else {
            showNotification(`Discount removed from ${product.name}`, 'success');
        }
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            saveProductsToStorage();
            displayProductsTable();
            showNotification('Product deleted successfully!', 'success');
        }
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
        currentEditingId = null;

        // Clear form
        const form = document.getElementById('editProductForm');
        if (form) {
            form.reset();
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.admin-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
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

    // Add animation styles if not already added
    if (!document.querySelector('#admin-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-notification-styles';
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
    }

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

// Export products (for backup)
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wonder-electronics-products.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import products (for restore)
function importProducts(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedProducts = JSON.parse(e.target.result);
            if (Array.isArray(importedProducts)) {
                products = importedProducts;
                saveProductsToStorage();
                displayProductsTable();
                showNotification('Products imported successfully!', 'success');
            } else {
                showNotification('Invalid file format', 'error');
            }
        } catch (error) {
            showNotification('Error reading file', 'error');
        }
    };
    reader.readAsText(file);
}

// Category Management
function loadCategoriesFromStorage() {
    const storedCategories = localStorage.getItem('wonderElectronicsCategories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    } else {
        // Default categories
        categories = [
            {
                id: 1,
                name: 'smartphones',
                displayName: 'Smartphones',
                icon: 'fas fa-mobile-alt',
                description: 'Latest smartphones and mobile devices',
                isDefault: true
            },
            {
                id: 2,
                name: 'laptops',
                displayName: 'Laptops',
                icon: 'fas fa-laptop',
                description: 'Laptops and portable computers',
                isDefault: true
            },
            {
                id: 3,
                name: 'audio',
                displayName: 'Audio',
                icon: 'fas fa-headphones',
                description: 'Audio equipment and accessories',
                isDefault: true
            },
            {
                id: 4,
                name: 'gaming',
                displayName: 'Gaming',
                icon: 'fas fa-gamepad',
                description: 'Gaming consoles and accessories',
                isDefault: true
            }
        ];
        saveCategoriesToStorage();
    }
}

function saveCategoriesToStorage() {
    localStorage.setItem('wonderElectronicsCategories', JSON.stringify(categories));
}

function displayCategoriesTable() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = '';

    if (categories.length === 0) {
        categoriesGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No categories found. Add some categories to get started!</p>';
        return;
    }

    categories.forEach(category => {
        const productCount = products.filter(p => p.category === category.name).length;
        const categoryCard = document.createElement('div');
        categoryCard.className = `category-card ${category.isDefault ? 'default' : ''}`;

        categoryCard.innerHTML = `
            <div class="category-count">${productCount}</div>
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <div class="category-name">${category.displayName}</div>
            <div class="category-description">${category.description}</div>
            <div class="category-actions">
                <button class="btn btn-warning" onclick="editCategory(${category.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                ${!category.isDefault ? `
                    <button class="btn btn-danger" onclick="deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                ` : ''}
            </div>
        `;

        categoriesGrid.appendChild(categoryCard);
    });
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newDisplayName = prompt('Enter new display name:', category.displayName);
    if (newDisplayName && newDisplayName !== category.displayName) {
        category.displayName = newDisplayName;
        saveCategoriesToStorage();
        displayCategoriesTable();
        showNotification('Category updated successfully!', 'success');
    }
}

function deleteCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (category.isDefault) {
        showNotification('Cannot delete default category', 'error');
        return;
    }

    const productCount = products.filter(p => p.category === category.name).length;
    if (productCount > 0) {
        showNotification(`Cannot delete category with ${productCount} products. Please move or delete products first.`, 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete category "${category.displayName}"?`)) {
        const categoryIndex = categories.findIndex(c => c.id === categoryId);
        if (categoryIndex !== -1) {
            categories.splice(categoryIndex, 1);
            saveCategoriesToStorage();
            displayCategoriesTable();
            showNotification('Category deleted successfully!', 'success');
        }
    }
}

// Website Settings
let websiteSettings = {};

// Load website settings from localStorage
function loadWebsiteSettings() {
    const storedSettings = localStorage.getItem('wonderElectronicsSettings');
    if (storedSettings) {
        websiteSettings = JSON.parse(storedSettings);
    } else {
        // Default settings
        websiteSettings = {
            siteTitle: 'WONDER ELECTRONICS',
            siteDescription: 'Discover the latest in consumer electronics with unbeatable prices and quality',
            currency: 'USD',
            taxRate: 5,
            usdToRwf: 1300,
            usdToEur: 0.85,
            usdToGbp: 0.73,
            showStockQuantity: true,
            heroTitle: 'Welcome to WONDER ELECTRONICS',
            heroSubtitle: 'Discover the latest in consumer electronics with unbeatable prices and quality',
            heroButtonText: 'Shop Now',
            aboutTitle: 'About WONDER ELECTRONICS',
            aboutContent: 'We are your trusted partner for premium consumer electronics. With years of experience in the industry, we bring you the latest technology at competitive prices. Our commitment to quality and customer satisfaction makes us the preferred choice for electronics enthusiasts.',
            contactPhone: '+1 (555) 123-4567',
            contactEmail: 'info@wonderelectronics.com',
            contactAddress: '123 Electronics Street, Tech City, TC 12345',
            paymentPhone: '+250787070049',
            paymentInstructions: 'Please include your order number in the payment reference when making payment via Mobile Money.',
            deliveryFee: 0
        };
        saveWebsiteSettings();
    }
    populateSettingsForms();
}

// Save website settings to localStorage
function saveWebsiteSettings() {
    localStorage.setItem('wonderElectronicsSettings', JSON.stringify(websiteSettings));
}

// Populate settings forms with current values
function populateSettingsForms() {
    // General settings
    document.getElementById('siteTitle').value = websiteSettings.siteTitle || '';
    document.getElementById('siteDescription').value = websiteSettings.siteDescription || '';
    document.getElementById('currency').value = websiteSettings.currency || 'USD';
    document.getElementById('taxRate').value = websiteSettings.taxRate || 5;
    document.getElementById('usdToRwf').value = websiteSettings.usdToRwf || 1300;
    document.getElementById('usdToEur').value = websiteSettings.usdToEur || 0.85;
    document.getElementById('usdToGbp').value = websiteSettings.usdToGbp || 0.73;
    document.getElementById('showStockQuantity').value = websiteSettings.showStockQuantity !== false ? 'true' : 'false';

    // Social media settings (only names are editable)
    const instagramNameField = document.getElementById('instagramName');
    if (instagramNameField) instagramNameField.value = websiteSettings.instagramName || 'Wonder Electronics';

    const facebookNameField = document.getElementById('facebookName');
    if (facebookNameField) facebookNameField.value = websiteSettings.facebookName || 'Wonder Electronics';

    const tiktokNameField = document.getElementById('tiktokName');
    if (tiktokNameField) tiktokNameField.value = websiteSettings.tiktokName || 'Wonder Electronics';

    // Hero settings
    document.getElementById('heroTitle').value = websiteSettings.heroTitle || '';
    document.getElementById('heroSubtitle').value = websiteSettings.heroSubtitle || '';
    document.getElementById('heroButtonText').value = websiteSettings.heroButtonText || '';

    // About settings
    document.getElementById('aboutTitle').value = websiteSettings.aboutTitle || '';
    document.getElementById('aboutContent').value = websiteSettings.aboutContent || '';

    // Contact settings
    document.getElementById('contactPhone').value = websiteSettings.contactPhone || '';
    document.getElementById('contactEmail').value = websiteSettings.contactEmail || '';
    document.getElementById('contactAddress').value = websiteSettings.contactAddress || '';

    // Payment settings
    document.getElementById('paymentPhone').value = websiteSettings.paymentPhone || '';
    document.getElementById('paymentInstructions').value = websiteSettings.paymentInstructions || '';
    document.getElementById('deliveryFee').value = websiteSettings.deliveryFee || 0;
}

// Switch settings tabs
function switchSettingsTab(tab) {
    const tabBtns = document.querySelectorAll('.settings-tab-btn');
    const contents = document.querySelectorAll('.settings-content');

    // Remove active class from all tabs and contents
    tabBtns.forEach(btn => btn.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and content
    document.querySelector(`.settings-tab-btn[onclick="switchSettingsTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}-settings`).classList.add('active');
}

// Display orders table
function displayOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;

    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    tableBody.innerHTML = '';

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No orders found.</td></tr>';
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');
        const orderDate = new Date(order.orderDate).toLocaleDateString();

        const paymentStatus = order.paymentVerified ? 'Verified' : 'Pending';
        const deliveryPeriod = order.deliveryPeriod || 'Standard';
        const expectedDelivery = calculateExpectedDelivery(order.orderDate, order.deliveryPeriod);

        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="order-status ${order.status}">${order.status}</span></td>
            <td><span class="payment-status ${order.paymentVerified ? 'verified' : 'pending'}">${paymentStatus}</span></td>
            <td>${deliveryPeriod}</td>
            <td>${orderDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="viewOrder(${order.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${!order.paymentVerified ? `<button class="btn btn-success" onclick="approveOrder(${order.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>` : ''}
                    <button class="btn btn-primary" onclick="updateOrderStatus(${order.id})">
                        <i class="fas fa-edit"></i> Update
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// View order details
function viewOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let orderDetails = `Order #${order.id}\n\n`;
    orderDetails += `Customer: ${order.customerName}\n`;
    orderDetails += `Phone: ${order.customerPhone}\n`;
    orderDetails += `Address: ${order.customerAddress}\n`;
    orderDetails += `Payment Ref: ${order.paymentReference}\n`;
    orderDetails += `Status: ${order.status}\n`;
    orderDetails += `Date: ${new Date(order.orderDate).toLocaleString()}\n\n`;
    orderDetails += `Items:\n`;
    order.items.forEach(item => {
        orderDetails += `- ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderDetails += `\nSubtotal: $${order.subtotal.toFixed(2)}\n`;
    orderDetails += `Tax: $${order.tax.toFixed(2)}\n`;
    orderDetails += `Total: $${order.total.toFixed(2)}`;

    alert(orderDetails);
}

// Update order status
function updateOrderStatus(orderId) {
    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newStatus = prompt('Update order status:', order.status);
    if (newStatus && newStatus !== order.status) {
        order.status = newStatus;
        localStorage.setItem('wonderElectronicsOrders', JSON.stringify(orders));
        displayOrdersTable();
        showNotification('Order status updated successfully!', 'success');
    }
}

// Approve order function
function approveOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].paymentVerified = true;
        orders[orderIndex].status = 'Approved';
        orders[orderIndex].approvedDate = new Date().toISOString();
        localStorage.setItem('wonderElectronicsOrders', JSON.stringify(orders));

        showNotification('Order approved successfully!', 'success');
        displayOrdersTable();
    }
}

// Calculate expected delivery date
function calculateExpectedDelivery(orderDate, deliveryPeriod) {
    const orderDateObj = new Date(orderDate);
    let daysToAdd = 5; // Default standard delivery

    switch (deliveryPeriod) {
        case 'express':
            daysToAdd = 2;
            break;
        case 'standard':
            daysToAdd = 5;
            break;
        case 'economy':
            daysToAdd = 10;
            break;
    }

    const expectedDate = new Date(orderDateObj.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    return expectedDate.toLocaleDateString();
}

// Display password reset requests
function displayPasswordResetRequests() {
    const tableBody = document.getElementById('resetRequestsTableBody');
    if (!tableBody) return;

    const resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    tableBody.innerHTML = '';

    if (resetRequests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No password reset requests found.</td></tr>';
        return;
    }

    // Update stats
    const pendingCount = resetRequests.filter(req => req.status === 'pending').length;
    const completedCount = resetRequests.filter(req => req.status === 'completed').length;

    document.getElementById('pendingResets').textContent = pendingCount;
    document.getElementById('completedResets').textContent = completedCount;

    resetRequests.forEach(request => {
        const row = document.createElement('tr');
        const requestDate = new Date(request.requestDate).toLocaleDateString();

        row.innerHTML = `
            <td>${request.userName}</td>
            <td>${request.userEmail}</td>
            <td>${requestDate}</td>
            <td><span class="reset-status ${request.status}">${request.status}</span></td>
            <td>
                <div class="action-buttons">
                    ${request.status === 'pending' ? `
                        <button class="btn btn-success" onclick="approvePasswordReset(${request.id})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-primary" onclick="sendPasswordResetEmail(${request.id})">
                            <i class="fas fa-envelope"></i> Send Email
                        </button>
                    ` : ''}
                    <button class="btn btn-warning" onclick="viewResetRequest(${request.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Approve password reset request
function approvePasswordReset(requestId) {
    const resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    const requestIndex = resetRequests.findIndex(req => req.id === requestId);

    if (requestIndex !== -1) {
        resetRequests[requestIndex].status = 'approved';
        resetRequests[requestIndex].approvedDate = new Date().toISOString();
        localStorage.setItem('wonderElectronicsResetRequests', JSON.stringify(resetRequests));

        showNotification('Password reset request approved!', 'success');
        displayPasswordResetRequests();
    }
}

// Send password reset email (simulated)
function sendPasswordResetEmail(requestId) {
    const resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    const request = resetRequests.find(req => req.id === requestId);

    if (!request) return;

    // Generate new password
    const newPassword = generateNewPassword();

    // Update user password
    const users = JSON.parse(localStorage.getItem('wonderElectronicsUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === request.userEmail);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        users[userIndex].passwordResetDate = new Date().toISOString();
        localStorage.setItem('wonderElectronicsUsers', JSON.stringify(users));
    }

    // Update request status
    const requestIndex = resetRequests.findIndex(req => req.id === requestId);
    if (requestIndex !== -1) {
        resetRequests[requestIndex].status = 'completed';
        resetRequests[requestIndex].completedDate = new Date().toISOString();
        resetRequests[requestIndex].newPassword = newPassword;
        localStorage.setItem('wonderElectronicsResetRequests', JSON.stringify(resetRequests));
    }

    // Simulate sending email
    alert(`Password reset email sent to ${request.userEmail}!\n\nNew Password: ${newPassword}\n\nPlease copy this password and send it to the user via email.`);

    showNotification('Password reset email sent successfully!', 'success');
    displayPasswordResetRequests();
}

// Generate new password
function generateNewPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// View reset request details
function viewResetRequest(requestId) {
    const resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    const request = resetRequests.find(req => req.id === requestId);

    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }

    // Create request details modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Password Reset Request Details</h2>
            <div class="request-details">
                <p><strong>User:</strong> ${request.userName}</p>
                <p><strong>Email:</strong> ${request.userEmail}</p>
                <p><strong>Request Date:</strong> ${new Date(request.requestDate).toLocaleString()}</p>
                <p><strong>Status:</strong> ${request.status}</p>
                ${request.approvedDate ? `<p><strong>Approved Date:</strong> ${new Date(request.approvedDate).toLocaleString()}</p>` : ''}
                ${request.completedDate ? `<p><strong>Completed Date:</strong> ${new Date(request.completedDate).toLocaleString()}</p>` : ''}
                ${request.newPassword ? `<p><strong>New Password:</strong> ${request.newPassword}</p>` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Slideshow Management Functions
let slideshowImages = [];

function loadSlideshowImages() {
    const stored = localStorage.getItem('wonderElectronicsSlideshowImages');
    if (stored) {
        slideshowImages = JSON.parse(stored);
    } else {
        slideshowImages = [];
    }
}

function saveSlideshowImages() {
    localStorage.setItem('wonderElectronicsSlideshowImages', JSON.stringify(slideshowImages));
}

function displaySlidesGrid() {
    loadSlideshowImages();
    const slidesGrid = document.getElementById('slidesGrid');
    if (!slidesGrid) return;

    slidesGrid.innerHTML = '';

    if (slideshowImages.length === 0) {
        slidesGrid.innerHTML = '<p style="text-align: center; padding: 2rem;">No slides yet. Add your first slide!</p>';
        return;
    }

    slideshowImages.forEach((slide, index) => {
        const slideCard = document.createElement('div');
        slideCard.className = 'slide-card';
        slideCard.innerHTML = `
            <img src="${slide.image}" alt="${slide.title || 'Slide'}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="slide-card-info">
                <h4>${slide.title || 'No Title'}</h4>
                <p>${slide.description || 'No description'}</p>
            </div>
            <div class="slide-card-actions">
                <button class="btn btn-danger" onclick="deleteSlide(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        slidesGrid.appendChild(slideCard);
    });
}

function deleteSlide(index) {
    if (confirm('Are you sure you want to delete this slide?')) {
        slideshowImages.splice(index, 1);
        saveSlideshowImages();
        displaySlidesGrid();
        showNotification('Slide deleted successfully!', 'success');
    }
}

// Image Upload Handlers
function handleImageUpload(input, targetId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById(targetId).value = e.target.result;
            showNotification('Image uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function handleMultipleImageUpload(input, targetId) {
    const files = input.files;
    if (files.length > 0) {
        let urls = [];
        let processed = 0;

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function (e) {
                urls.push(e.target.result);
                processed++;

                if (processed === files.length) {
                    const textarea = document.getElementById(targetId);
                    const existing = textarea.value.trim();
                    textarea.value = existing ? existing + '\n' + urls.join('\n') : urls.join('\n');
                    showNotification(`${files.length} images uploaded successfully!`, 'success');
                }
            };
            reader.readAsDataURL(files[i]);
        }
    }
}

// Chat Support Functions
let currentChatSession = null;

function loadChatSessions() {
    const chatMessages = JSON.parse(localStorage.getItem('wonderElectronicsChatMessages') || '[]');
    const sessionsList = document.getElementById('chatSessionsList');

    if (!sessionsList) return;

    // Group messages by user (using userId to handle multiple guests)
    const sessions = {};
    chatMessages.forEach(msg => {
        const userId = msg.userId || msg.userName || 'guest_unknown';
        const userName = msg.userName || 'Guest User';

        if (!sessions[userId]) {
            sessions[userId] = {
                userName: userName,
                messages: [],
                lastMessageTime: null
            };
        }
        sessions[userId].messages.push(msg);

        // Track the latest message timestamp
        const msgTime = new Date(msg.timestamp).getTime();
        if (!sessions[userId].lastMessageTime || msgTime > sessions[userId].lastMessageTime) {
            sessions[userId].lastMessageTime = msgTime;
        }
    });

    sessionsList.innerHTML = '';

    if (Object.keys(sessions).length === 0) {
        sessionsList.innerHTML = '<p style="padding: 1rem; color: #999;">No active chats</p>';
        return;
    }

    // Convert to array and sort by latest message time (newest first)
    const sortedSessions = Object.entries(sessions).sort((a, b) => {
        return b[1].lastMessageTime - a[1].lastMessageTime;
    });

    // Display sessions with newest on top
    sortedSessions.forEach(([userId, sessionData]) => {
        const session = document.createElement('div');
        session.className = 'chat-session';
        session.onclick = () => loadChatConversation(sessionData.userName, sessionData.messages);

        // Get last message preview
        const lastMessage = sessionData.messages[sessionData.messages.length - 1];
        const lastMessageText = lastMessage.text.substring(0, 30) + (lastMessage.text.length > 30 ? '...' : '');
        const lastMessageTime = new Date(lastMessage.timestamp).toLocaleString();

        // Identify guest users
        const userIcon = userId.startsWith('guest_') ? 'fa-user' : 'fa-user-circle';
        const userLabel = userId.startsWith('guest_') ? '(Guest)' : '';

        session.innerHTML = `
            <div class="session-info">
                <i class="fas ${userIcon}" style="font-size: 1.5rem;"></i>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <strong style="color: #333;">${sessionData.userName}</strong>
                        ${userLabel ? `<span style="font-size: 0.75rem; color: #999; font-weight: normal;">${userLabel}</span>` : ''}
                    </div>
                    <small style="display: block; color: #666; margin-top: 0.25rem;">${lastMessageText}</small>
                    <small style="display: block; color: #999; margin-top: 0.25rem; font-size: 0.7rem;">${sessionData.messages.length} messages • ${lastMessageTime}</small>
                </div>
            </div>
        `;
        sessionsList.appendChild(session);
    });
}

function loadChatConversation(userName, messages) {
    currentChatSession = userName;
    document.getElementById('currentChatUser').textContent = `Chat with ${userName}`;

    const messagesContainer = document.getElementById('adminChatMessages');
    messagesContainer.innerHTML = '';

    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${msg.sender}-message`;
        const time = new Date(msg.timestamp).toLocaleTimeString();
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${msg.text}</p>
                <small>${time}</small>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendAdminMessage() {
    const input = document.getElementById('adminChatInput');
    const message = input.value.trim();

    if (!message || !currentChatSession) return;

    const chatMessages = JSON.parse(localStorage.getItem('wonderElectronicsChatMessages') || '[]');

    chatMessages.push({
        text: message,
        sender: 'admin',
        userName: currentChatSession,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('wonderElectronicsChatMessages', JSON.stringify(chatMessages));

    input.value = '';
    loadChatSessions();

    // Reload conversation
    const sessions = {};
    chatMessages.forEach(msg => {
        const user = msg.userName || 'Guest User';
        if (!sessions[user]) {
            sessions[user] = [];
        }
        sessions[user].push(msg);
    });

    if (sessions[currentChatSession]) {
        loadChatConversation(currentChatSession, sessions[currentChatSession]);
    }
}

function handleAdminChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendAdminMessage();
    }
}

// Add slide form submission handler
document.addEventListener('DOMContentLoaded', function () {
    const slideForm = document.getElementById('addSlideForm');
    if (slideForm) {
        slideForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const imageUrl = formData.get('slideImage');

            if (!imageUrl || !imageUrl.trim()) {
                showNotification('Please provide an image URL or upload an image', 'error');
                return;
            }

            const newSlide = {
                id: Date.now(),
                image: imageUrl,
                title: formData.get('slideTitle'),
                description: formData.get('slideDescription')
            };

            loadSlideshowImages();
            slideshowImages.push(newSlide);
            saveSlideshowImages();
            console.log('Slide saved:', newSlide);
            console.log('Total slides now:', slideshowImages.length);
            displaySlidesGrid();
            e.target.reset();
            showNotification('Slide added successfully! Refresh the client page to see it.', 'success');
        });
    }
});

// Setup Admin Navigation
function setupAdminNavigation() {
    const adminLinks = document.querySelectorAll('.admin-link');
    const adminSections = document.querySelectorAll('.admin-section');

    adminLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links
            adminLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Get target section from href
            const targetId = this.getAttribute('href').substring(1);

            // Hide all sections
            adminSections.forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Show first section by default
    if (adminSections.length > 0) {
        adminSections[0].classList.add('active');
    }
}
