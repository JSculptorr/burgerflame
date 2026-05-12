/* ============================================
   BURGER FLAME — Shopping Cart Logic
   ============================================ */

const Cart = (() => {
    const STORAGE_KEY = 'bf_cart';
    const FREE_DELIVERY_THRESHOLD = 500;
    const DELIVERY_PRICE = 150;

    let items = [];

    // ========== Load / Save ==========
    function load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            items = saved ? JSON.parse(saved) : [];
        } catch (e) {
            items = [];
        }
    }

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.warn('Cart save failed', e);
        }
    }

    // ========== Public API ==========
    function add(productId) {
        const product = window.PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existing = items.find(i => i.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                qty: 1
            });
        }
        save();
        render();
        bump();
        showToast(`«${product.name}» добавлен в корзину`, 'success');
    }

    function remove(productId) {
        items = items.filter(i => i.id !== productId);
        save();
        render();
    }

    function increase(productId) {
        const item = items.find(i => i.id === productId);
        if (item) {
            item.qty += 1;
            save();
            render();
        }
    }

    function decrease(productId) {
        const item = items.find(i => i.id === productId);
        if (!item) return;
        if (item.qty <= 1) {
            remove(productId);
            return;
        }
        item.qty -= 1;
        save();
        render();
    }

    function clear() {
        items = [];
        save();
        render();
    }

    function getItems() { return [...items]; }

    function getCount() {
        return items.reduce((sum, i) => sum + i.qty, 0);
    }

    function getSubtotal() {
        return items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    }

    function getDelivery() {
        if (items.length === 0) return 0;
        return getSubtotal() >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_PRICE;
    }

    function getTotal() {
        return getSubtotal() + getDelivery();
    }

    function format(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    }

    // ========== Render ==========
    function render() {
        renderCount();
        renderDrawer();
    }

    function renderCount() {
        const count = getCount();
        const el = document.getElementById('cartCount');
        if (!el) return;
        el.textContent = count;
        el.classList.toggle('is-active', count > 0);
    }

    function bump() {
        const btn = document.getElementById('cartToggle');
        if (!btn) return;
        btn.classList.remove('bump');
        // force reflow
        void btn.offsetWidth;
        btn.classList.add('bump');
    }

    function renderDrawer() {
        const cartEmpty = document.getElementById('cartEmpty');
        const cartItems = document.getElementById('cartItems');
        const cartFoot = document.getElementById('cartFoot');
        const itemsCount = document.getElementById('cartItemsCount');
        if (!cartItems) return;

        const count = getCount();
        if (itemsCount) {
            itemsCount.textContent = `${count} ${pluralize(count, ['товар', 'товара', 'товаров'])}`;
        }

        if (items.length === 0) {
            cartEmpty.style.display = '';
            cartItems.style.display = 'none';
            cartFoot.classList.remove('is-active');
            return;
        }

        cartEmpty.style.display = 'none';
        cartItems.style.display = '';
        cartFoot.classList.add('is-active');

        cartItems.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img class="cart-item__img" src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy">
                <div class="cart-item__body">
                    <div class="cart-item__name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                    <div class="cart-item__price">${format(item.price)}</div>
                    <div class="cart-item__qty">
                        <button data-cart-decrease="${item.id}" aria-label="Уменьшить"><i data-lucide="minus"></i></button>
                        <span>${item.qty}</span>
                        <button data-cart-increase="${item.id}" aria-label="Увеличить"><i data-lucide="plus"></i></button>
                    </div>
                </div>
                <div class="cart-item__actions">
                    <button class="cart-item__remove" data-cart-remove="${item.id}" aria-label="Удалить">
                        <i data-lucide="trash-2"></i>
                    </button>
                    <div class="cart-item__total">${format(item.price * item.qty)}</div>
                </div>
            </div>
        `).join('');

        document.getElementById('cartSubtotal').textContent = format(getSubtotal());

        const delivery = getDelivery();
        const deliveryEl = document.getElementById('cartDelivery');
        deliveryEl.textContent = delivery === 0 ? 'Бесплатно' : format(delivery);
        if (delivery === 0) deliveryEl.style.color = 'var(--success)';
        else deliveryEl.style.color = '';

        document.getElementById('cartTotal').textContent = format(getTotal());

        if (window.lucide) window.lucide.createIcons();
    }

    // ========== Helpers ==========
    function pluralize(n, forms) {
        const cases = [2, 0, 1, 1, 1, 2];
        return forms[(n % 100 > 4 && n % 100 < 20) ? 2 : cases[Math.min(n % 10, 5)]];
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function showToast(message, type = 'info') {
        const wrap = document.getElementById('toastWrap');
        if (!wrap) return;

        const icons = {
            success: 'check-circle-2',
            error: 'x-circle',
            info: 'info'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast__icon"><i data-lucide="${icons[type] || 'info'}"></i></div>
            <span>${escapeHtml(message)}</span>
        `;
        wrap.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        requestAnimationFrame(() => toast.classList.add('is-show'));

        setTimeout(() => {
            toast.classList.remove('is-show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ========== Init ==========
    function init() {
        load();
        render();

        // Event delegation for cart actions
        document.addEventListener('click', (e) => {
            const inc = e.target.closest('[data-cart-increase]');
            if (inc) { increase(inc.dataset.cartIncrease); return; }

            const dec = e.target.closest('[data-cart-decrease]');
            if (dec) { decrease(dec.dataset.cartDecrease); return; }

            const rem = e.target.closest('[data-cart-remove]');
            if (rem) { remove(rem.dataset.cartRemove); return; }
        });
    }

    return {
        init, add, remove, increase, decrease, clear,
        getItems, getCount, getSubtotal, getDelivery, getTotal,
        format, showToast
    };
})();

window.Cart = Cart;
