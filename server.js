/* ============================================
   BURGER FLAME — Backend Server
   Express + Telegram Bot Integration
   ============================================ */

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

// Load env vars from .env file if present (optional)
try { require('dotenv').config(); } catch (e) { /* dotenv optional */ }

const app = express();
const PORT = process.env.PORT || config.PORT || 3000;

// Use env vars first, then config file
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || config.BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || config.CHAT_ID;

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ========== HELPERS ==========
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatPrice(amount) {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽';
}

function formatDate(iso) {
    try {
        const d = iso ? new Date(iso) : new Date();
        const opts = {
            timeZone: 'Europe/Moscow',
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return d.toLocaleString('ru-RU', opts) + ' (МСК)';
    } catch (e) {
        return new Date().toLocaleString('ru-RU');
    }
}

function buildTelegramMessage(order) {
    const c = order.customer || {};
    const items = order.items || [];

    const itemsLines = items.map((it, idx) => {
        const lineTotal = it.price * it.qty;
        return `${idx + 1}. <b>${escapeHtml(it.name)}</b>\n` +
               `   ${it.qty} × ${formatPrice(it.price)} = <b>${formatPrice(lineTotal)}</b>`;
    }).join('\n');

    const deliveryText = order.delivery === 0 || order.delivery == null
        ? 'Бесплатно'
        : formatPrice(order.delivery);

    return [
        '🔥 <b>НОВЫЙ ЗАКАЗ — BURGER FLAME</b> 🔥',
        '━━━━━━━━━━━━━━━━━━━━',
        '',
        '👤 <b>Клиент</b>',
        `Имя: <b>${escapeHtml(c.name || '—')}</b>`,
        `Телефон: <a href="tel:${escapeHtml(c.phone || '')}">${escapeHtml(c.phone || '—')}</a>`,
        `Адрес: ${escapeHtml(c.address || '—')}`,
        c.comment ? `Комментарий: <i>${escapeHtml(c.comment)}</i>` : null,
        `Оплата: <b>${escapeHtml(c.payment || '—')}</b>`,
        '',
        '🍔 <b>Заказ</b>',
        itemsLines || '—',
        '',
        '━━━━━━━━━━━━━━━━━━━━',
        `Сумма: <b>${formatPrice(order.subtotal || 0)}</b>`,
        `Доставка: <b>${deliveryText}</b>`,
        `<b>💰 ИТОГО: ${formatPrice(order.total || 0)}</b>`,
        '',
        `🕒 ${formatDate(order.createdAt)}`,
    ].filter(Boolean).join('\n');
}

async function sendTelegramMessage(text) {
    if (!BOT_TOKEN || !CHAT_ID) {
        throw new Error('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не установлены. Откройте backend/config.js');
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // Use built-in fetch (Node 18+) or fall back to node-fetch
    const fetchFn = typeof fetch !== 'undefined'
        ? fetch
        : (...args) => import('node-fetch').then(({ default: f }) => f(...args));

    const res = await fetchFn(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
    });

    const data = await res.json();
    if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description || 'unknown'}`);
    }
    return data;
}

// ========== ROUTES ==========

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        service: 'BURGER FLAME API',
        telegram: BOT_TOKEN && CHAT_ID ? 'configured' : 'not configured',
        time: new Date().toISOString()
    });
});

// Order endpoint
app.post('/api/order', async (req, res) => {
    try {
        const order = req.body;

        // Validation
        if (!order || !order.customer) {
            return res.status(400).json({ ok: false, error: 'Некорректные данные заказа' });
        }
        const { name, phone, address } = order.customer;
        if (!name || !phone || !address) {
            return res.status(400).json({ ok: false, error: 'Заполните имя, телефон и адрес' });
        }
        if (!Array.isArray(order.items) || order.items.length === 0) {
            return res.status(400).json({ ok: false, error: 'Корзина пуста' });
        }

        const text = buildTelegramMessage(order);

        // Log to console (always works, useful for development)
        console.log('\n========== NEW ORDER ==========');
        console.log(text.replace(/<[^>]+>/g, '')); // strip HTML for console
        console.log('================================\n');

        // Try send to Telegram
        if (BOT_TOKEN && CHAT_ID) {
            try {
                await sendTelegramMessage(text);
                return res.json({ ok: true, message: 'Заказ отправлен в Telegram' });
            } catch (telegramErr) {
                console.error('Telegram send failed:', telegramErr.message);
                // Still return 200 — order is logged on server
                return res.json({
                    ok: true,
                    warning: 'Заказ принят, но не удалось отправить в Telegram. Проверьте конфигурацию.',
                    error: telegramErr.message
                });
            }
        } else {
            console.warn('⚠️  Telegram не настроен. Заказ только записан в консоль.');
            console.warn('   Откройте backend/config.js и добавьте BOT_TOKEN и CHAT_ID');
            return res.json({
                ok: true,
                warning: 'Telegram не настроен. Заказ записан только в консоль сервера.'
            });
        }
    } catch (err) {
        console.error('Order processing error:', err);
        return res.status(500).json({ ok: false, error: 'Внутренняя ошибка сервера' });
    }
});

// Fallback to index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ ok: false, error: 'Not found' });
    }
    res.status(404).send('404 — страница не найдена');
});

// ========== START ==========
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   🔥  BURGER FLAME — SERVER STARTED  🔥   ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`\n   ▶ Сайт:  http://localhost:${PORT}`);
    console.log(`   ▶ API:   http://localhost:${PORT}/api/health`);
    console.log(`   ▶ Telegram: ${BOT_TOKEN && CHAT_ID ? '✅ настроен' : '❌ не настроен — откройте backend/config.js'}`);
    console.log('\n   Для остановки: Ctrl+C\n');
});
