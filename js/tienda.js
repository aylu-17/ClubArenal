// Variables globales
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let filteredProducts = [];
let currentFilter = 'todos';
let currentSort = 'default';
let productsPerPage = 12;
let currentPage = 1;

// Productos de ejemplo (cargados desde JS)
const sampleProducts = [
    {
        id: 'camiseta-titular-2024',
        name: 'Camiseta Titular 2024',
        category: 'camisetas',
        price: 3500,
        originalPrice: null,
        description: 'Camiseta oficial titular temporada 2024. Tecnología Dri-FIT para máximo rendimiento.',
        image: './images/remera.jpeg',
        badge: 'nuevo',
        popular: true,
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: 'camiseta-suplente-2024',
        name: 'Camiseta Suplente 2024',
        category: 'camisetas',
        price: 3200,
        originalPrice: null,
        description: 'Camiseta oficial suplente temporada 2024. Diseño moderno y cómodo.',
        image: './images/remera.jpeg',
        badge: 'nuevo',
        popular: true,
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: 'camiseta-retro-1995',
        name: 'Camiseta Retro 1995',
        category: 'camisetas',
        price: 2800,
        originalPrice: 3500,
        description: 'Edición especial conmemorativa del campeonato de 1995.',
        image: './images/remera.jpeg',
        badge: 'oferta',
        popular: false,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'gorra-oficial',
        name: 'Gorra Oficial',
        category: 'accesorios',
        price: 1200,
        originalPrice: null,
        description: 'Gorra oficial del club con bordado de alta calidad.',
        image: './images/gorra.jpeg',
        badge: null,
        popular: true,
        sizes: ['Única']
    },
    {
        id: 'bufanda-hincha',
        name: 'Bufanda del Hincha',
        category: 'accesorios',
        price: 800,
        originalPrice: 1000,
        description: 'Bufanda oficial para acompañar al equipo en cada partido.',
        image: './images/bufanda.jpeg',
        badge: 'oferta',
        popular: true,
        sizes: ['Única']
    },
    {
        id: 'campera-entrenamiento',
        name: 'Campera de Entrenamiento',
        category: 'deportivo',
        price: 4500,
        originalPrice: null,
        description: 'Campera oficial de entrenamiento con tecnología térmica.',
        image: './images/campera.jpeg',
        badge: 'nuevo',
        popular: false,
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: 'short-entrenamiento',
        name: 'Short de Entrenamiento',
        category: 'deportivo',
        price: 2200,
        originalPrice: null,
        description: 'Short oficial de entrenamiento con tecnología Dri-FIT.',
        image: './images/short.jpeg',
        badge: null,
        popular: false,
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: 'llavero-escudo',
        name: 'Llavero del Escudo',
        category: 'souvenirs',
        price: 350,
        originalPrice: null,
        description: 'Llavero metálico con el escudo oficial del club.',
        image: './images/llavero.jpeg',
        badge: null,
        popular: true,
        sizes: ['Única']
    },
    {
        id: 'taza-oficial',
        name: 'Taza Oficial',
        category: 'souvenirs',
        price: 650,
        originalPrice: null,
        description: 'Taza de cerámica con el escudo y colores del club.',
        image: './images/taza.jpeg',
        badge: null,
        popular: false,
        sizes: ['Única']
    },
    {
        id: 'medias-oficiales',
        name: 'Medias Oficiales',
        category: 'accesorios',
        price: 450,
        originalPrice: null,
        description: 'Medias oficiales del club para completar tu outfit.',
        image: './images/medias.jpeg',
        badge: null,
        popular: true,
        sizes: ['35-38', '39-42', '43-46']
    },
    {
        id: 'remera-casual',
        name: 'Remera Casual',
        category: 'deportivo',
        price: 1800,
        originalPrice: null,
        description: 'Remera casual con diseño moderno del club.',
        image: './images/remera casual.jpeg',
        badge: null,
        popular: false,
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: 'bandera-grande',
        name: 'Bandera Grande',
        category: 'souvenirs',
        price: 1500,
        originalPrice: null,
        description: 'Bandera oficial del club 90x60cm para tu casa.',
        image: './images/bandera.jpeg   ',
        badge: null,
        popular: true,
        sizes: ['90x60cm']
    }
];

// Número de WhatsApp del club
const WHATSAPP_NUMBER = '5491123456789';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando tienda...');
    
    products = [...sampleProducts];
    filteredProducts = [...products];
    
    console.log('Productos cargados:', products.length);
    console.log('Productos filtrados:', filteredProducts.length);
    
    initializeNavigation();
    renderProducts();
    updateCartUI();
    initializeFilters();
    updateDebugInfo();
    
    console.log('Tienda inicializada correctamente');
});

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== PRODUCTOS =====
function renderProducts() {
    const grid = document.getElementById('productosGrid');
    if (!grid) {
        console.error('No se encontró el elemento productosGrid');
        return;
    }
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(0, endIndex);
    
    console.log('Renderizando productos:', productsToShow.length);
    
    if (productsToShow.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3>No se encontraron productos</h3>
                <p>Intenta con otra categoría o filtro</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="producto-card" data-category="${product.category}">
            <div class="producto-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="producto-badge ${product.badge}">${getBadgeText(product.badge)}</div>` : ''}
            </div>
            <div class="producto-info">
                <div class="producto-categoria">${getCategoryName(product.category)}</div>
                <h3 class="producto-nombre">${product.name}</h3>
                <p class="producto-descripcion">${product.description}</p>
                <div class="producto-precio">
                    ${product.originalPrice ? `<span class="precio-anterior">$${product.originalPrice.toLocaleString()}</span>` : ''}
                    $${product.price.toLocaleString()}
                </div>
                <div class="producto-actions">
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
                        Agregar al Carrito
                    </button>
                    <button class="quick-view-btn" onclick="openProductModal('${product.id}')" title="Vista rápida">👁️</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Mostrar/ocultar botón "Cargar más"
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex >= filteredProducts.length ? 'none' : 'block';
    }
}

function getBadgeText(badge) {
    const badges = {
        'nuevo': 'Nuevo',
        'oferta': 'Oferta',
        'popular': 'Popular'
    };
    return badges[badge] || badge;
}

function getCategoryName(category) {
    const categories = {
        'camisetas': 'Camisetas',
        'accesorios': 'Accesorios',
        'deportivo': 'Ropa Deportiva',
        'souvenirs': 'Souvenirs'
    };
    return categories[category] || category;
}

function loadMoreProducts() {
    currentPage++;
    renderProducts();
}

// ===== FILTROS =====
function initializeFilters() {
    // Event listeners para filtros ya están en el HTML
}

function filterProducts(category) {
    currentFilter = category;
    currentPage = 1;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Encontrar y activar el botón correcto
    const activeBtn = document.querySelector(`[onclick="filterProducts('${category}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Filtrar productos
    if (category === 'todos') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // Aplicar ordenamiento actual
    if (currentSort !== 'default') {
        sortProducts(currentSort);
    } else {
        renderProducts();
    }
}

function sortProducts(sortType) {
    currentSort = sortType;
    
    switch (sortType) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.popular - a.popular);
            break;
        default:
            filteredProducts = products.filter(product => 
                currentFilter === 'todos' || product.category === currentFilter
            );
    }
    
    currentPage = 1;
    renderProducts();
}

// ===== CARRITO MEJORADO =====
function addToCart(id, name, price, image, size = null, quantity = 1) {
    // Crear un identificador único que incluya el talle
    const uniqueId = size ? `${id}-${size}` : id;
    const existingItem = cart.find(item => item.uniqueId === uniqueId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            uniqueId,
            id,
            name,
            price,
            image,
            size,
            quantity
        });
    }
    
    updateCartUI();
    saveCart();
    showNotification(`${name} agregado al carrito`, 'success');
}

function removeFromCart(uniqueId) {
    cart = cart.filter(item => item.uniqueId !== uniqueId);
    updateCartUI();
    saveCart();
    showNotification('Producto eliminado del carrito', 'success');
}

function updateQuantity(uniqueId, newQuantity) {
    const item = cart.find(item => item.uniqueId === uniqueId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(uniqueId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
            saveCart();
        }
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Actualizar items del carrito
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <h3>Tu carrito está vacío</h3>
                    <p>¡Agrega algunos productos para comenzar!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=60&width=60&text=Producto'">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        ${item.size && item.size !== 'Única' ? `<div class="cart-item-size">Talle: ${item.size}</div>` : ''}
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity('${item.uniqueId}', ${item.quantity - 1})" title="Disminuir cantidad">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.uniqueId}', ${item.quantity + 1})" title="Aumentar cantidad">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-item" onclick="removeFromCart('${item.uniqueId}')" title="Eliminar producto">🗑️</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Actualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString();
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        
        // Prevenir scroll del body cuando el carrito está abierto
        if (cartSidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('El carrito ya está vacío', 'error');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        updateCartUI();
        saveCart();
        showNotification('Carrito vaciado', 'success');
    }
}

// ===== WHATSAPP =====
function sendWhatsAppOrder() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    // Obtener datos del formulario
    const customerName = document.getElementById('customerName').value.trim();
    const orderComments = document.getElementById('orderComments').value.trim();
    
    // Validar campos requeridos
    if (!customerName) {
        showNotification('Por favor ingresa tu nombre', 'error');
        document.getElementById('customerName').focus();
        return;
    }
    
    // Generar mensaje de WhatsApp
    const message = generateWhatsAppMessage(customerName, orderComments);
    
    // Abrir WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    
    // Mostrar confirmación
    showNotification('Redirigiendo a WhatsApp...', 'success');
}

function generateWhatsAppMessage(name, comments) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let message = `🏆 *PEDIDO - CLUB DE FUTBOL ARENAL* 🏆\n\n`;
    message += `👤 *Cliente:* ${name}\n\n`;
    message += `🛒 *PRODUCTOS SOLICITADOS:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        if (item.size && item.size !== 'Única') {
            message += `   📏 Talle: ${item.size}\n`;
        }
        message += `   💰 Precio: $${item.price}\n`;
        message += `   📦 Cantidad: ${item.quantity}\n`;
        message += `   💵 Subtotal: $${item.price * item.quantity}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📊 *RESUMEN DEL PEDIDO:*\n`;
    message += `• Total de productos: ${itemCount}\n`;
    message += `• *TOTAL A PAGAR: $${total.toLocaleString()}*\n\n`;
    
    if (comments) {
        message += `💬 *Comentarios adicionales:*\n${comments}\n\n`;
    }
    
    message += `⏰ *Fecha del pedido:* ${new Date().toLocaleString('es-AR')}\n\n`;
    message += `¡Gracias por elegir la tienda oficial del Club de Futbol Arenal! ⚽💙`;
    
    return message;
}

// ===== MODAL DE PRODUCTO =====
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}'">
        </div>
        <div class="modal-info">
            <h2>${product.name}</h2>
            <div class="modal-price">
                ${product.originalPrice ? `<span class="precio-anterior">$${product.originalPrice}</span>` : ''}
                $${product.price}
            </div>
            <p class="modal-description">${product.description}</p>
            
            ${product.sizes && product.sizes.length > 1 && product.sizes[0] !== 'Única' ? `
                <div class="size-selector">
                    <label>Talle:</label>
                    <div class="size-options">
                        ${product.sizes.map(size => `
                            <button class="size-option" onclick="selectSize(this, '${size}')">${size}</button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="quantity-selector">
                <label>Cantidad:</label>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="changeModalQuantity(-1)">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10" id="modalQuantity">
                    <button class="quantity-btn" onclick="changeModalQuantity(1)">+</button>
                </div>
            </div>
            
            <button class="modal-add-to-cart" onclick="addFromModal('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
                Agregar al Carrito
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function selectSize(button, size) {
    // Remover selección anterior
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Seleccionar nuevo talle
    button.classList.add('selected');
    button.dataset.selectedSize = size;
}

function changeModalQuantity(change) {
    const quantityInput = document.getElementById('modalQuantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        const newValue = Math.max(1, Math.min(10, currentValue + change));
        quantityInput.value = newValue;
    }
}

function addFromModal(id, name, price, image) {
    const selectedSizeBtn = document.querySelector('.size-option.selected');
    const size = selectedSizeBtn ? selectedSizeBtn.dataset.selectedSize : 'Única';
    const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
    
    // Verificar si se requiere talle
    const product = products.find(p => p.id === id);
    if (product && product.sizes && product.sizes.length > 1 && product.sizes[0] !== 'Única' && !selectedSizeBtn) {
        showNotification('Por favor selecciona un talle', 'error');
        return;
    }
    
    addToCart(id, name, price, image, size, quantity);
    closeProductModal();
}

// Cerrar modal al hacer click fuera
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
}

// ===== BÚSQUEDA =====
function searchProducts(query) {
    if (!query.trim()) {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    currentPage = 1;
    renderProducts();
}

// Event listener para búsqueda
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.search-btn');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchSubmit = document.getElementById('searchSubmit');

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // Mostrar u ocultar el cuadro de búsqueda
            searchBox.style.display = (searchBox.style.display === 'none') ? 'block' : 'none';
            searchInput.focus();
        });
    }

    if (searchSubmit) {
        searchSubmit.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query !== '') {
                searchProducts(query); // tu función para buscar
            }
        });
    }
});

// ===== NOTIFICACIONES =====
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// ===== UTILIDADES =====
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Auto-guardar datos del formulario
function saveCustomerData() {
    const customerData = {
        name: document.getElementById('customerName').value,
        comments: document.getElementById('orderComments').value
    };
    localStorage.setItem('customerData', JSON.stringify(customerData));
}

function loadCustomerData() {
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (document.getElementById('customerName')) document.getElementById('customerName').value = data.name || '';
        if (document.getElementById('orderComments')) document.getElementById('orderComments').value = data.comments || '';
    }
}

// Event listeners para auto-guardar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadCustomerData();
        
        // Auto-guardar cuando el usuario escribe
        ['customerName', 'orderComments'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', saveCustomerData);
            }
        });
    }, 1000);
});

// ===== EFECTOS ADICIONALES =====
// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(135, 206, 235, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #87CEEB 0%, #ffffff 100%)';
            header.style.backdropFilter = 'none';
        }
    }
});

// Animaciones al scroll
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const elementsToAnimate = document.querySelectorAll('.producto-card, .categoria-item');
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Inicializar efectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeScrollEffects, 500);
});

console.log('🛒 Tienda del Club de Futbol Arenal cargada correctamente');
