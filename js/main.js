// ======== A/B эксперимент с UUID ========

// Генерация UUID v4
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Получение или создание userId
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = generateUUID();
    localStorage.setItem('userId', userId);
}

// Определяем группу эксперимента
const lastChar = userId[userId.length - 1];
const lastDigit = parseInt(lastChar, 16);
const experimentGroupBool = (lastDigit % 2 === 0); // true = exp, false = control
localStorage.setItem('experimentGroup', experimentGroupBool);

// Логи
console.log('User ID:', userId);
console.log('Experiment group:', experimentGroupBool ? 'exp_01' : 'control_01');

// ======== ОТПРАВКА СОБЫТИЙ (A/B) ========
function sendEvent(eventType) {
    const userId = localStorage.getItem('userId');
    const experimentGroupRaw = localStorage.getItem('experimentGroup');

    if (!userId || experimentGroupRaw === null) return;

    const experimentGroup =
        experimentGroupRaw === 'true' ? 'exp_01' : 'control_01';

    const payload = {
        eventType: eventType,
        userId: userId,
        experimentGroup: experimentGroup
    };

    fetch('https://webhook.site/ВСТАВЬ_СВОЙ_URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        console.log('📡 Event sent:', payload);
    })
    .catch(err => {
        console.error('❌ Event send failed', err);
    });
}


// ======== Кнопка "Наверх" ========
const toTopBtn = document.getElementById("toTopBtn");
window.onscroll = function () {
    if (toTopBtn) {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            toTopBtn.style.display = "block";
        } else {
            toTopBtn.style.display = "none";
        }
    }
};

if (toTopBtn) {
    toTopBtn.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}


// ======== Фильтр услуг ========
const filterBtns = document.querySelectorAll('.filter-btn');
const services = document.querySelectorAll('.service');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        services.forEach(service => {
            service.style.display =
                (filter === 'all' || service.dataset.type === filter)
                    ? 'block'
                    : 'none';
        });
    });
});


// ======== Корзина ========
let cart = [];

document.querySelectorAll('.buy-btn').forEach(btn => {

    // Цвет кнопки по группе
    btn.style.backgroundColor = experimentGroupBool ? '#e94e77' : '#4a90e2';

    btn.addEventListener('click', (e) => {
        const serviceEl = e.target.closest('.service');
        const name = serviceEl.querySelector('h3').innerText;
        const price = Number(serviceEl.dataset.price);

        cart.push({
            name,
            price,
            userId: userId,
            group: experimentGroupBool ? 'exp_01' : 'control_01'
        });

        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    });
});


// ======== Кнопка "Пробовать бесплатно" ========
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});


// ======== Страница оплаты ========
const checkoutInfo = document.getElementById('checkout-info');
const confirmPayment = document.getElementById('confirm-payment');

if (checkoutInfo) {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartData.length > 0) {
        const lastItem = cartData[cartData.length - 1];
        checkoutInfo.innerHTML = `
            <p>Услуга: <strong>${lastItem.name}</strong></p>
            <p>Цена: <strong>${lastItem.price} ₽</strong></p>
            <p>User ID: <strong>${lastItem.userId}</strong></p>
            <p>Группа: <strong>${lastItem.group}</strong></p>
        `;
    }
}

if (confirmPayment) {
    confirmPayment.addEventListener('click', () => {
        alert('Оплата прошла успешно!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
}


// ======== Форма обратной связи ========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            alert('Сообщение отправлено!');
            contactForm.reset();
        } else {
            alert('Пожалуйста, заполните все поля.');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    sendEvent('page_view');
});
