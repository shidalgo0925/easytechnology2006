// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Dropdown menu functionality
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.closest('.nav-item-dropdown');
        const isActive = dropdown.classList.contains('active');
        
        // Close all other dropdowns
        document.querySelectorAll('.nav-item-dropdown').forEach(item => {
            if (item !== dropdown) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active', !isActive);
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item-dropdown')) {
        document.querySelectorAll('.nav-item-dropdown').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Close mobile menu when clicking on a link (except dropdown toggle)
document.querySelectorAll('.nav-link').forEach(link => {
    if (!link.classList.contains('dropdown-toggle')) {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    }
});

// Close mobile menu when clicking on dropdown links
document.querySelectorAll('.dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        // Close all dropdowns
        document.querySelectorAll('.nav-item-dropdown').forEach(item => {
            item.classList.remove('active');
        });
    });
});

// Smooth scrolling for navigation links (only for internal page links that start with #)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default if it's an anchor on the same page
        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Contact form handling - Connected to Odoo CRM
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        try {
            // Prepare data for Odoo CRM
            const leadData = {
                name: data.name,
                email_from: data.email,
                phone: data.phone || '',
                title: data.subject,
                description: data.message,
                source_id: 1, // Website source
                team_id: 1, // Sales team
                user_id: 1, // Salesperson
                tag_ids: [[6, 0, [1]]], // Website tag
                medium_id: 1, // Website medium
                campaign_id: false,
                partner_name: data.name,
                contact_name: data.name,
                function: data.service || 'General Inquiry',
                website: 'easytech.services',
                street: '',
                city: '',
                zip: '',
                country_id: false,
                state_id: false,
                mobile: data.phone || '',
                type: 'lead',
                priority: '1', // Normal priority
                date_open: new Date().toISOString().split('T')[0],
                date_last_stage_update: new Date().toISOString().split('T')[0],
                date_conversion: false,
                date_closed: false,
                date_deadline: false,
                date_action: false,
                create_date: new Date().toISOString(),
                write_date: new Date().toISOString(),
                active: true,
                is_company: false,
                color: 0,
                partner_id: false,
                email_cc: '',
                email_bounce: '',
                message_bounce: 0,
                message_follower_ids: [],
                message_channel_ids: [],
                message_partner_ids: [],
                message_ids: [],
                message_needaction: false,
                message_needaction_counter: 0,
                message_has_error: false,
                message_has_error_counter: 0,
                message_attachment_count: 0,
                message_main_attachment_id: false,
                website_message_ids: [],
                message_is_follower: false,
                message_follower_ids: [],
                activity_ids: [],
                activity_state: false,
                activity_user_id: false,
                activity_type_id: false,
                activity_date_deadline: false,
                activity_summary: '',
                activity_note: '',
                activity_ids: [],
                message_needaction: false,
                message_needaction_counter: 0,
                message_has_error: false,
                message_has_error_counter: 0,
                message_attachment_count: 0,
                message_main_attachment_id: false,
                website_message_ids: [],
                message_is_follower: false,
                message_follower_ids: [],
                activity_ids: [],
                activity_state: false,
                activity_user_id: false,
                activity_type_id: false,
                activity_date_deadline: false,
                activity_summary: '',
                activity_note: ''
            };
            
            // Send to Odoo CRM
            const response = await fetch('https://crm.easytech.services/web/dataset/call_kw/crm.lead/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        model: 'crm.lead',
                        method: 'create',
                        args: [leadData],
                        kwargs: {}
                    },
                    id: Math.floor(Math.random() * 1000000)
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.result) {
                    showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                    this.reset();
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            } else {
                throw new Error('Error de conexión con el servidor');
            }
            
        } catch (error) {
            console.error('Error sending to Odoo:', error);
            showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo o contáctanos por WhatsApp.', 'error');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Chat en Vivo - WhatsApp Integration
function initLiveChat() {
    const liveChatButtons = document.querySelectorAll('a[href="#"]');
    
    liveChatButtons.forEach(button => {
        if (button.textContent.includes('Chat en Vivo') || button.textContent.includes('Iniciar Chat')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get current page info
                const pageTitle = document.title;
                const currentUrl = window.location.href;
                
                // Create WhatsApp message
                const message = `¡Hola! 👋 Me interesa conocer más sobre los servicios de EasyTech Services. 
                
Vengo desde: ${pageTitle}
Página: ${currentUrl}

¿Podrían ayudarme con información sobre sus servicios?`;
                
                // Encode message for URL
                const encodedMessage = encodeURIComponent(message);
                
                // Open WhatsApp
                const whatsappUrl = `https://wa.me/50769744086?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
            });
        }
    });
}

// Cotización Rápida - Calculadora Simple
function initQuickQuote() {
    const quickQuoteButtons = document.querySelectorAll('a[href="#"]');
    
    quickQuoteButtons.forEach(button => {
        if (button.textContent.includes('Cotización') || button.textContent.includes('Solicitar Cotización')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showQuickQuoteModal();
            });
        }
    });
}

// Modal de Cotización Rápida
function showQuickQuoteModal() {
    // Remove existing modal
    const existingModal = document.querySelector('.quote-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'quote-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-container">
            <div class="modal-header">
                <h3>Cotización Rápida</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-content">
                <form id="quickQuoteForm">
                    <div class="form-group">
                        <label>Nombre Completo *</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" name="phone">
                    </div>
                    <div class="form-group">
                        <label>Tipo de Proyecto *</label>
                        <select name="project_type" required>
                            <option value="">Selecciona un tipo</option>
                            <option value="desarrollo-web">Desarrollo Web</option>
                            <option value="app-movil">Aplicación Móvil</option>
                            <option value="sistema-erp">Sistema ERP/CRM</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="consultoria">Consultoría IT</option>
                            <option value="automatizacion">Automatización</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Complejidad del Proyecto *</label>
                        <select name="complexity" required>
                            <option value="">Selecciona complejidad</option>
                            <option value="basico">Básico (1-2 semanas)</option>
                            <option value="intermedio">Intermedio (1-2 meses)</option>
                            <option value="avanzado">Avanzado (3-6 meses)</option>
                            <option value="empresarial">Empresarial (6+ meses)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Presupuesto Estimado</label>
                        <select name="budget">
                            <option value="">Selecciona rango</option>
                            <option value="1000-5000">$1,000 - $5,000</option>
                            <option value="5000-15000">$5,000 - $15,000</option>
                            <option value="15000-50000">$15,000 - $50,000</option>
                            <option value="50000+">$50,000+</option>
                            <option value="consultar">Prefiero consultar</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Descripción del Proyecto</label>
                        <textarea name="description" rows="4" placeholder="Cuéntanos más detalles sobre tu proyecto..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Fecha Estimada de Inicio</label>
                        <input type="date" name="start_date">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" id="cancelQuote">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Enviar Cotización</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Close modal events
    modal.querySelector('.modal-close').addEventListener('click', () => closeQuoteModal(modal));
    modal.querySelector('.modal-overlay').addEventListener('click', () => closeQuoteModal(modal));
    modal.querySelector('#cancelQuote').addEventListener('click', () => closeQuoteModal(modal));
    
    // Form submission
    modal.querySelector('#quickQuoteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleQuickQuote(this, modal);
    });
}

function closeQuoteModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.remove();
    }, 300);
}

function handleQuickQuote(form, modal) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Calculate estimated cost
    const costEstimate = calculateCost(data.project_type, data.complexity);
    
    // Create WhatsApp message
    const message = `📋 *COTIZACIÓN RÁPIDA - EasyTech Services*

👤 *Cliente:* ${data.name}
📧 *Email:* ${data.email}
📱 *Teléfono:* ${data.phone || 'No proporcionado'}

🎯 *Proyecto:* ${data.project_type}
⚡ *Complejidad:* ${data.complexity}
💰 *Presupuesto:* ${data.budget || 'No especificado'}
📅 *Fecha inicio:* ${data.start_date || 'No especificada'}

📝 *Descripción:*
${data.description || 'Sin descripción adicional'}

💵 *Estimación inicial:* ${costEstimate}

¿Podrían enviarme una cotización detallada?`;
    
    // Encode and send to WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/50769744086?text=${encodedMessage}`;
    
    // Close modal and open WhatsApp
    closeQuoteModal(modal);
    window.open(whatsappUrl, '_blank');
    
    showNotification('Redirigiendo a WhatsApp para enviar tu cotización...', 'success');
}

function calculateCost(projectType, complexity) {
    const baseCosts = {
        'desarrollo-web': { basico: '$2,000', intermedio: '$8,000', avanzado: '$25,000', empresarial: '$50,000+' },
        'app-movil': { basico: '$3,000', intermedio: '$12,000', avanzado: '$35,000', empresarial: '$75,000+' },
        'sistema-erp': { basico: '$5,000', intermedio: '$20,000', avanzado: '$60,000', empresarial: '$150,000+' },
        'ecommerce': { basico: '$2,500', intermedio: '$10,000', avanzado: '$30,000', empresarial: '$80,000+' },
        'consultoria': { basico: '$1,000', intermedio: '$3,000', avanzado: '$8,000', empresarial: '$20,000+' },
        'automatizacion': { basico: '$1,500', intermedio: '$5,000', avanzado: '$15,000', empresarial: '$40,000+' },
        'otro': { basico: '$2,000', intermedio: '$8,000', avanzado: '$25,000', empresarial: '$50,000+' }
    };
    
    return baseCosts[projectType]?.[complexity] || 'Consultar precio';
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Portfolio card interactions
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Service card interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .portfolio-card, .contact-item, .contact-option').forEach(el => {
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('%') ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
        }
    }
    
    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h3');
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (number && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(statNumber, number);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Se eliminaron todas las funciones y eventos relacionados con "Demo" por requerimiento

// Contact option buttons
document.querySelectorAll('.contact-option .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const option = this.closest('.contact-option').querySelector('h4').textContent;
        showNotification(`${option} - Funcionalidad en desarrollo`, 'info');
    });
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.type === 'submit' || this.classList.contains('btn-primary')) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 2000);
        }
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add focus styles for accessibility
document.querySelectorAll('a, button, input, textarea, select').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #2563eb';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Advanced Animation Functions
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-animation');
    if (!typingElement) return;
    
    const words = ['Innovadoras', 'Eficientes', 'Modernas', 'Escalables'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 100 : 150;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    updateCounter();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Parallax Effect
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Enhanced Service Card Interactions
function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(37, 99, 235, 0.1);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                top: 50%;
                left: 50%;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        });
    });
}

// Add ripple animation to CSS
function addRippleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Smooth Scroll Enhancement
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


// Chatbot Functionality
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    // Chatbot responses
    const responses = {
        servicios: "Ofrecemos desarrollo web, aplicaciones móviles, cloud computing, consultoría IT, ciberseguridad y automatización. ¿Te interesa algún servicio en particular?",
        precios: "Nuestros precios varían según el proyecto. Para una cotización personalizada, te recomiendo hablar directamente con nuestro equipo. ¿Te conecto por WhatsApp?",
        contacto: "Para consultas específicas, te recomiendo contactarnos por WhatsApp (+507 6974-4086) donde nuestro equipo te responderá inmediatamente. ¿Te conecto ahora?",
        ubicacion: "Estamos ubicados en PH, Camino de Cruces, Boulevard el Dorado, local 31, Panamá. Ofrecemos servicios remotos y presenciales con cita previa.",
        cotizacion: "Para una cotización personalizada, necesito conectar contigo con nuestro equipo de ventas. ¿Te parece bien que te conecte por WhatsApp?",
        proyecto: "Excelente! Para discutir los detalles de tu proyecto, te recomiendo hablar directamente con nuestro equipo técnico. ¿Te conecto por WhatsApp?",
        soporte: "Para soporte técnico inmediato, te recomiendo contactar a nuestro equipo por WhatsApp (+507 6974-4086). ¿Te conecto ahora?",
        default: "Gracias por tu consulta. Para darte la mejor atención personalizada, te recomiendo hablar directamente con nuestro equipo. ¿Te conecto por WhatsApp?"
    };
    
    // Show chatbot immediately - force visibility
    if (chatbotToggle) {
        chatbotToggle.style.display = 'flex';
        chatbotToggle.style.opacity = '1';
        console.log('Chatbot toggle button found and made visible');
    } else {
        console.error('Chatbot toggle button not found!');
    }
    
    // Toggle chatbot
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotToggle.style.display = 'none';
        }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
        chatbotToggle.style.display = 'flex';
    });
    
    // Send message
    function sendMessage(message, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageContent.appendChild(messageText);
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        return messageDiv;
    }
    
    // Bot response
    function botResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = responses.default;
        
        // Detectar intenciones específicas que requieren WhatsApp
        if (lowerMessage.includes('cotiz') || lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
            response = responses.cotizacion;
        } else if (lowerMessage.includes('proyecto') || lowerMessage.includes('desarrollo') || lowerMessage.includes('app') || lowerMessage.includes('sistema')) {
            response = responses.proyecto;
        } else if (lowerMessage.includes('soporte') || lowerMessage.includes('problema') || lowerMessage.includes('error') || lowerMessage.includes('ayuda')) {
            response = responses.soporte;
        } else if (lowerMessage.includes('servicio') || lowerMessage.includes('que ofrecen') || lowerMessage.includes('que hacen')) {
            response = responses.servicios;
        } else if (lowerMessage.includes('contacto') || lowerMessage.includes('telefono') || lowerMessage.includes('email') || lowerMessage.includes('hablar')) {
            response = responses.contacto;
        } else if (lowerMessage.includes('ubicacion') || lowerMessage.includes('donde') || lowerMessage.includes('direccion')) {
            response = responses.ubicacion;
        }
        
        setTimeout(() => {
            sendMessage(response, false);
            
            // Si la respuesta sugiere WhatsApp, agregar botón de WhatsApp
            if (response.includes('WhatsApp') || response.includes('conecto')) {
                setTimeout(() => {
                    addWhatsAppButton();
                }, 2000);
            }
        }, 1000);
    }
    
    // Función para agregar botón de WhatsApp en el chat
    function addWhatsAppButton() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const whatsappButton = document.createElement('div');
        whatsappButton.className = 'message bot-message';
        whatsappButton.innerHTML = `
            <div class="message-content" style="text-align: center; padding: 1rem;">
                <a href="https://wa.me/50769744086?text=Hola%20EasyTech%20Services,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios" 
                   target="_blank" rel="noopener noreferrer" 
                   style="background: #25D366; color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: 600;">
                    <i class="fab fa-whatsapp"></i> Conectar por WhatsApp
                </a>
            </div>
        `;
        messagesContainer.appendChild(whatsappButton);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Handle input
    function handleInput() {
        const message = chatbotInput.value.trim();
        if (message) {
            sendMessage(message, true);
            chatbotInput.value = '';
            botResponse(message);
        }
    }
    
    // Event listeners
    chatbotSend.addEventListener('click', handleInput);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleInput();
        }
    });
    
    // Quick questions
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.textContent;
            sendMessage(question, true);
            const responseKey = this.getAttribute('data-question');
            setTimeout(() => {
                sendMessage(responses[responseKey], false);
            }, 1000);
        });
    });
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Reset all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Reset all dropdowns
    document.querySelectorAll('.nav-item-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
    
    // Check main nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
            // If it's in a dropdown, activate the dropdown
            const dropdown = link.closest('.nav-item-dropdown');
            if (dropdown) {
                dropdown.classList.add('active');
            }
        }
    });
    
    // Check dropdown links
    document.querySelectorAll('.dropdown-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
            // Activate the parent dropdown
            const dropdown = link.closest('.nav-item-dropdown');
            if (dropdown) {
                dropdown.classList.add('active');
                // Also mark the dropdown toggle as active
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.classList.add('active');
                }
            }
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set active nav link
    setActiveNavLink();
    // Initialize all animations
    createParticles();
    initTypingAnimation();
    animateCounters();
    initParallax();
    initServiceCardEffects();
    addRippleAnimation();
    initSmoothScroll();
    
    // Initialize Chatbot
    initChatbot();
    initLiveChat();
    initQuickQuote();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('EasyTech Services website loaded successfully! 🚀');
    console.log('Advanced animations initialized ✨');
    console.log('Chatbot initialized 🤖');
    
    // Package CTA buttons - Pre-fill form
    document.querySelectorAll('.btn-package-cta').forEach(button => {
        button.addEventListener('click', function(e) {
            const packageType = this.getAttribute('data-package');
            const serviceSelect = document.getElementById('service');
            const asesoriaCheckbox = document.getElementById('asesoria');
            
            if (serviceSelect && packageType) {
                // Map package types to form values
                const packageMap = {
                    'landing-page': 'landing-page',
                    'sitio-corporativo': 'sitio-corporativo',
                    'portal-corporativo': 'portal-corporativo'
                };
                
                if (packageMap[packageType]) {
                    serviceSelect.value = packageMap[packageType];
                    // Trigger change event to update form
                    serviceSelect.dispatchEvent(new Event('change'));
                }
            }
            
            // Auto-check asesoría if available
            if (asesoriaCheckbox) {
                asesoriaCheckbox.checked = true;
            }
            
            // Scroll to form after a short delay
            setTimeout(() => {
                const contactSection = document.getElementById('contacto');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    });
    
    // Asesoría link in contact info
    const asesoriaLink = document.querySelector('.btn-asesoria-link');
    if (asesoriaLink) {
        asesoriaLink.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceSelect = document.getElementById('service');
            const asesoriaCheckbox = document.getElementById('asesoria');
            
            if (serviceSelect) {
                serviceSelect.value = 'asesoria-gratuita';
                serviceSelect.dispatchEvent(new Event('change'));
            }
            
            if (asesoriaCheckbox) {
                asesoriaCheckbox.checked = true;
            }
            
            // Scroll to form
            setTimeout(() => {
                const form = document.getElementById('contactForm');
                if (form) {
                    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Focus on name field
                    const nameField = document.getElementById('name');
                    if (nameField) {
                        setTimeout(() => nameField.focus(), 500);
                    }
                }
            }, 100);
        });
    }
});
