// END WATER Website JavaScript
console.log('🚀 JavaScript loaded successfully!');

// Cart functionality
let cart = [];
let quantities = {
    '500ml': 1,
    '1.5L': 1,
    '5L': 1,
    '10L': 1
};

// DOM Elements
let cartModal, cartItems, cartTotal, cartCount, notification;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded!');
    initializeDOMElements();
    setupEventListeners();
});

function initializeDOMElements() {
    cartModal = document.getElementById('cartModal');
    cartItems = document.getElementById('cartItems');
    cartTotal = document.getElementById('cartTotal');
    cartCount = document.getElementById('cart-count'); // Using correct ID
    notification = document.getElementById('notification');
    
    console.log('DOM Elements found:', {
        cartModal: !!cartModal,
        cartItems: !!cartItems,
        cartTotal: !!cartTotal,
        cartCount: !!cartCount,
        notification: !!notification
    });
}

function setupEventListeners() {
    // Cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    
    // Close cart button
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

// Change quantity function
function changeQuantity(productId, change) {
    console.log(`Quantity change: ${productId} by ${change}`);
    
    if (quantities[productId]) {
        quantities[productId] = Math.max(1, quantities[productId] + change);
        
        // Update display - using correct ID format
        const quantityDisplay = document.getElementById(`qty-${productId}`);
        if (quantityDisplay) {
            quantityDisplay.textContent = quantities[productId];
            console.log(`Updated display for ${productId}: ${quantities[productId]}`);
        } else {
            console.log(`Quantity display element not found: qty-${productId}`);
        }
        
        console.log(`${productId} quantity changed to:`, quantities[productId]);
        showNotification(`${productId} quantity: ${quantities[productId]}`, 'success');
    }
}

// Add to cart function
function addToCart(productName, price, productId) {
    console.log(`Adding to cart: ${productName}`);
    
    const quantity = quantities[productId] || 1;
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    showNotification(`Added ${quantity}x ${productName} to cart!`, 'success');
    console.log('Cart updated:', cart);
}

// Update cart display
function updateCartDisplay() {
    console.log('Updating cart display, cart length:', cart.length);
    
    if (!cartCount) {
        console.log('Cart count element not found!');
        return;
    }
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    console.log('Total items in cart:', totalItems);
    
    if (totalItems > 0) {
        cartCount.style.display = 'inline-block';
        cartCount.style.visibility = 'visible';
    } else {
        cartCount.style.display = 'none';
    }
}

// Open cart
function openCart() {
    console.log('Opening cart!');
    
    if (!cartModal) {
        console.log('Cart modal not found!');
        return;
    }
    
    // Update cart items display
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cart.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <span>${item.name}</span>
                    <span>Qty: ${item.quantity}</span>
                    <span>R${(item.price * item.quantity).toFixed(2)}</span>
                    <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
                `;
                cartItems.appendChild(itemDiv);
            });
        }
    }
    
    // Update total
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2); // Remove R since HTML already has it
    }
    
    cartModal.style.display = 'block';
}

// Close cart
function closeCart() {
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    openCart(); // Refresh cart display
    showNotification('Item removed from cart', 'info');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Prepare WhatsApp message
    let message = "🛒 *END WATER ORDER*\n\n";
    
    cart.forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Quantity: ${item.quantity}\n`;
        message += `  Price: R${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `💰 *Total: R${total.toFixed(2)}*\n\n`;
    message += "📍 Delivery Address: (Please provide your address)\n";
    message += "📞 Contact: (Please provide your contact number)";
    
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const phoneNumber = "27637530316";
    
    if (isMobile) {
        // For mobile devices
        const whatsappMobile = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        const whatsappWeb = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        
        // Try WhatsApp app first
        window.location.href = whatsappMobile;
        
        // Fallback to web version
        setTimeout(() => {
            window.open(whatsappWeb, '_blank');
        }, 1000);
        
        // Additional fallback - copy to clipboard
        setTimeout(() => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(`WhatsApp: ${phoneNumber}\n\n${message}`).then(() => {
                    showNotification('Order details copied to clipboard! Paste in WhatsApp.', 'info');
                });
            }
        }, 2000);
    } else {
        // For desktop
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    // Clear cart after order
    cart = [];
    updateCartDisplay();
    closeCart();
    
    showNotification('Order sent via WhatsApp!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

// WhatsApp contact
function openWhatsAppDirect() {
    const phoneNumber = "27637530316";
    const message = "Hi END WATER! I would like to place an order or make an inquiry.";
    
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // For mobile devices, try different WhatsApp URL formats
        const whatsappMobile = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        const whatsappWeb = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        
        // Try to open WhatsApp app first
        window.location.href = whatsappMobile;
        
        // Fallback to web version after a short delay
        setTimeout(() => {
            window.open(whatsappWeb, '_blank');
        }, 1000);
    } else {
        // For desktop, use web WhatsApp
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Smooth scrolling
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Make functions globally available
window.changeQuantity = changeQuantity;
window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.openWhatsAppDirect = openWhatsAppDirect;
window.scrollToSection = scrollToSection;

console.log('All functions registered globally');
