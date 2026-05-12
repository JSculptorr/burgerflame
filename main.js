/* ============================================
   BURGER FLAME — Main script
   UI, rendering, checkout, animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== ICON INIT ==========
    if (window.lucide) lucide.createIcons();

    // ========== AOS ==========
    if (window.AOS) {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
            disable: window.innerWidth < 640 ? 'mobile' : false
        });
    }

    // ========== CART INIT ==========
    Cart.init();

    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('is-hidden'), 800);
    });
    setTimeout(() => preloader.classList.add('is-hidden'), 3000); // safety fallback

    // ========== HEADER SCROLL ==========
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        header.classList.toggle('scrolled', scroll > 40);

        // back to top
        const btt = document.getElementById('backToTop');
        if (btt) btt.classList.toggle('is-visible', scroll > 600);

        lastScroll = scroll;
    });

    // ========== ACTIVE NAV LINK ==========
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.id;
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ========== MOBILE MENU ==========
    const burger = document.getElementById('burgerToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const overlay = document.getElementById('overlay');

    function openMobile() {
        mobileMenu.classList.add('is-open');
        overlay.classList.add('is-open');
        document.body.classList.add('no-scroll');
    }
    function closeMobile() {
        mobileMenu.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
    }

    burger?.addEventListener('click', openMobile);
    mobileClose?.addEventListener('click', closeMobile);
    overlay?.addEventListener('click', () => {
        closeMobile();
        closeCart();
    });
    mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

    // ========== CART DRAWER ==========
    const cartToggle = document.getElementById('cartToggle');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartClose = document.getElementById('cartClose');
    const cartEmptyClose = document.getElementById('cartEmptyClose');

    function openCart() {
        cartDrawer.classList.add('is-open');
        overlay.classList.add('is-open');
        document.body.classList.add('no-scroll');
    }
    function closeCart() {
        cartDrawer.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
    }

    cartToggle?.addEventListener('click', openCart);
    cartClose?.addEventListener('click', closeCart);
    cartEmptyClose?.addEventListener('click', () => {
        closeCart();
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    });

    // ========== SEARCH ==========
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchToggle?.addEventListener('click', () => {
        searchOverlay.classList.toggle('is-open');
        if (searchOverlay.classList.contains('is-open')) {
            setTimeout(() => searchInput.focus(), 200);
        }
    });
    searchClose?.addEventListener('click', () => {
        searchOverlay.classList.remove('is-open');
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    searchInput?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (q.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        const matches = window.PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
        ).slice(0, 6);

        if (matches.length === 0) {
            searchResults.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);">Ничего не найдено</div>`;
            return;
        }

        searchResults.innerHTML = matches.map(p => `
            <div class="search-result" data-id="${p.id}" style="cursor:pointer">
                <img src="${p.image}" alt="${p.name}">
                <div>
                    <div class="search-result__name">${p.name}</div>
                    <div class="search-result__price">${Cart.format(p.price)}</div>
                </div>
            </div>
        `).join('');

        searchResults.querySelectorAll('.search-result').forEach(el => {
            el.addEventListener('click', () => {
                Cart.add(el.dataset.id);
                searchClose.click();
            });
        });
    });

    // ========== RENDER PRODUCTS ==========
    const productsGrid = document.getElementById('productsGrid');

    function productCard(p) {
        const badges = (p.badges || []).map(b => {
            const labels = { hot: '🔥 HOT', new: '✨ NEW', sale: '% SALE', top: '⭐ TOP' };
            return `<span class="badge badge--${b}">${labels[b] || b.toUpperCase()}</span>`;
        }).join('');

        const oldPrice = p.oldPrice
            ? `<span class="product__price-old">${Cart.format(p.oldPrice)}</span>`
            : '';

        return `
            <article class="product" data-category="${p.category}" data-aos="fade-up">
                <div class="product__media">
                    <img class="product__img" src="${p.image}" alt="${p.name}" loading="lazy">
                    ${badges ? `<div class="product__badges">${badges}</div>` : ''}
                    <div class="product__rating">
                        <i data-lucide="star"></i>${p.rating || 4.8}
                    </div>
                </div>
                <div class="product__body">
                    <h3 class="product__name">${p.name}</h3>
                    <p class="product__desc">${p.desc}</p>
                    <div class="product__foot">
                        <div class="product__price">
                            <span class="product__price-now">${Cart.format(p.price)}</span>
                            ${oldPrice}
                        </div>
                        <button class="product__add" data-add="${p.id}" aria-label="Добавить ${p.name}">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    function renderProducts(category = 'all') {
        const filtered = category === 'all'
            ? window.PRODUCTS
            : window.PRODUCTS.filter(p => p.category === category);

        productsGrid.innerHTML = filtered.map(productCard).join('');
        if (window.lucide) lucide.createIcons();

        // Add to cart click
        productsGrid.querySelectorAll('[data-add]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.classList.add('added');
                setTimeout(() => btn.classList.remove('added'), 600);
                Cart.add(btn.dataset.add);
            });
        });
    }

    renderProducts('all');

    // ========== CATEGORY FILTER ==========
    const chips = document.querySelectorAll('.menu__filter .chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('chip--active'));
            chip.classList.add('chip--active');
            renderProducts(chip.dataset.category);
        });
    });

    // ========== BESTSELLERS SWIPER ==========
    const bestsellers = window.PRODUCTS.filter(p => p.bestseller);
    const bestsellersTrack = document.getElementById('bestsellersTrack');
    if (bestsellersTrack) {
        bestsellersTrack.innerHTML = bestsellers.map(p =>
            `<div class="swiper-slide">${productCard(p)}</div>`
        ).join('');

        if (window.lucide) lucide.createIcons();

        // Bind add buttons in slider
        bestsellersTrack.querySelectorAll('[data-add]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.classList.add('added');
                setTimeout(() => btn.classList.remove('added'), 600);
                Cart.add(btn.dataset.add);
            });
        });

        new Swiper('.bestsellers__swiper', {
            slidesPerView: 1.1,
            spaceBetween: 16,
            navigation: {
                nextEl: '.bestsellers__swiper .swiper-button-next',
                prevEl: '.bestsellers__swiper .swiper-button-prev',
            },
            pagination: {
                el: '.bestsellers__swiper .swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 28 },
            }
        });
    }

    // ========== REVIEWS SWIPER ==========
    new Swiper('.reviews__swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.reviews-pagination',
            clickable: true,
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            992: { slidesPerView: 3, spaceBetween: 24 },
        }
    });

    // ========== COUNTDOWN ==========
    function startCountdown() {
        // Set deadline 7 days from now
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);
        deadline.setHours(23, 59, 59, 0);

        function tick() {
            const now = new Date();
            const diff = deadline - now;
            if (diff <= 0) return;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const min = Math.floor((diff / (1000 * 60)) % 60);
            const sec = Math.floor((diff / 1000) % 60);

            const pad = n => String(n).padStart(2, '0');
            const d = document.getElementById('cdDays');
            const h = document.getElementById('cdHours');
            const m = document.getElementById('cdMin');
            const s = document.getElementById('cdSec');
            if (d) d.textContent = pad(days);
            if (h) h.textContent = pad(hours);
            if (m) m.textContent = pad(min);
            if (s) s.textContent = pad(sec);
        }
        tick();
        setInterval(tick, 1000);
    }
    startCountdown();

    // ========== STAT COUNTERS ==========
    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();

        function frame(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(target * eased);
            el.textContent = new Intl.NumberFormat('ru-RU').format(value) + (target >= 10000 ? '+' : '');
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // ========== BACK TO TOP ==========
    document.getElementById('backToTop')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== NEWSLETTER ==========
    document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = e.target.querySelector('input[type="email"]');
        Cart.showToast(`Спасибо! Подписка ${input.value} оформлена 🎉`, 'success');
        input.value = '';
    });

    // ========== CHECKOUT ==========
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutForm = document.getElementById('checkoutForm');
    const successModal = document.getElementById('successModal');

    function openModal(modal) {
        modal.classList.add('is-open');
        document.body.classList.add('no-scroll');
    }
    function closeModal(modal) {
        modal.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
    }

    document.querySelectorAll('[data-modal-close]').forEach(el => {
        el.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    checkoutBtn?.addEventListener('click', () => {
        if (Cart.getCount() === 0) {
            Cart.showToast('Корзина пуста', 'error');
            return;
        }
        closeCart();
        renderCheckoutSummary();
        openModal(checkoutModal);
    });

    function renderCheckoutSummary() {
        const summary = document.getElementById('checkoutSummary');
        const items = Cart.getItems();

        const itemsHtml = items.map(i => `
            <div class="checkout-summary__row">
                <span>${i.name} × ${i.qty}</span>
                <span>${Cart.format(i.price * i.qty)}</span>
            </div>
        `).join('');

        const delivery = Cart.getDelivery();
        const deliveryText = delivery === 0 ? 'Бесплатно' : Cart.format(delivery);

        summary.innerHTML = `
            ${itemsHtml}
            <div class="checkout-summary__row">
                <span>Доставка</span>
                <span>${deliveryText}</span>
            </div>
            <div class="checkout-summary__row checkout-summary__row--total">
                <span>Итого</span>
                <span>${Cart.format(Cart.getTotal())}</span>
            </div>
        `;
    }

    // ========== SUBMIT ORDER ==========
    checkoutForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('confirmOrderBtn');
        const formData = new FormData(checkoutForm);

        const order = {
            customer: {
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                comment: formData.get('comment') || '',
                payment: formData.get('payment')
            },
            items: Cart.getItems(),
            subtotal: Cart.getSubtotal(),
            delivery: Cart.getDelivery(),
            total: Cart.getTotal(),
            createdAt: new Date().toISOString()
        };

        // Disable button and show loading
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader-2" style="animation:spin 1s linear infinite"></i> Отправляем...';
        if (window.lucide) lucide.createIcons();

        try {
            // Try backend, fallback to demo mode
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            }).catch(() => null);

            if (response && response.ok) {
                showSuccess(order);
            } else {
                // Demo mode (no backend) — still simulate success
                console.warn('Backend not available, demo mode. Order:', order);
                await new Promise(r => setTimeout(r, 800));
                showSuccess(order);
            }
        } catch (err) {
            console.error(err);
            Cart.showToast('Не удалось отправить заказ. Попробуйте ещё раз.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            if (window.lucide) lucide.createIcons();
        }
    });

    function showSuccess(order) {
        closeModal(checkoutModal);
        const successOrder = document.getElementById('successOrder');
        const orderNum = '#' + Math.floor(100000 + Math.random() * 900000);
        successOrder.innerHTML = `
            Номер заказа: <strong>${orderNum}</strong><br>
            Сумма: <strong>${Cart.format(order.total)}</strong>
        `;
        openModal(successModal);
        Cart.clear();
        checkoutForm.reset();
    }

    // ========== KEYBOARD ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobile();
            closeCart();
            searchOverlay?.classList.remove('is-open');
            document.querySelectorAll('.modal.is-open').forEach(m => closeModal(m));
        }
    });

    // ========== SMOOTH ANCHORS ==========
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerOffset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ========== GSAP HERO ANIMATION ==========
    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to('.hero__plate img', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            scale: 0.85,
            opacity: 0.6
        });
    }

    // ========== ADD CSS FOR SPIN ==========
    const style = document.createElement('style');
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
});
