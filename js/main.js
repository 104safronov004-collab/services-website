// ===============================
// UUID пользователя
// ===============================
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = generateUUID();
    localStorage.setItem('userId', userId);
}


// ===============================
// Отправка событий (через IMG)
// ===============================
function sendEvent(eventType) {
    const group = localStorage.getItem('experimentGroup') || 'no_experiment';

    const img = new Image();
    img.src =
        'https://webhook.site/0361251e-7c59-4f4a-af4f-145917028be9' +
        '?eventType=' + encodeURIComponent(eventType) +
        '&userId=' + encodeURIComponent(userId) +
        '&group=' + encodeURIComponent(group) +
        '&page=' + encodeURIComponent(window.location.pathname);
}


// ===============================
// Кнопка "Наверх"
// ===============================
const toTopBtn = document.getElementById("toTopBtn");

window.onscroll = function () {
    if (!toTopBtn) return;

    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        toTopBtn.style.display = "block";
    } else {
        toTopBtn.style.display = "none";
    }
};

if (toTopBtn) {
    toTopBtn.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}


// ===============================
// Навигация по услугам (БЕЗ аналитики)
// ===============================
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const service = e.target.closest('.service');
        const page = service?.dataset.page;
        if (page) {
            window.location.href = page;
        }
    });
});

document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});


// ===============================
// VarioCube — управление экспериментом
// ===============================
ymab('metrika.106320594', 'getFlags', function (flags) {

    // ❗ если эксперимент выключен — кнопки не показываем НИКОМУ
    if (!flags || !flags.free_button_experiment) {
        return;
    }

    const experimentGroup = flags.free_button_experiment; // exp_01 / control_01
    localStorage.setItem('experimentGroup', experimentGroup);

    // Показываем кнопку ТОЛЬКО в exp_01
    if (experimentGroup === 'exp_01') {
        document.querySelectorAll('.try-free-btn').forEach(btn => {
            btn.style.display = 'inline-block';
        });
    }
});


// ===============================
// Страницы услуг — покупка
// ===============================
document.querySelectorAll('.buy-btn-page').forEach(btn => {
    btn.addEventListener('click', () => {

        // Определяем тип события по странице
        let eventType = 'buy_paid';

        if (window.location.pathname.includes('free-info')) {
            eventType = 'buy_free';
        }

        sendEvent(eventType);

        alert('Покупка зафиксирована (демо)');
    });
});


// ===============================
// Форма обратной связи
// ===============================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const message = document.getElementById('message')?.value;

        if (name && email && message) {
            alert('Сообщение отправлено!');
            contactForm.reset();
        } else {
            alert('Пожалуйста, заполните все поля.');
        }
    });
}


// ===============================
// Page view (один раз при загрузке)
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    sendEvent('page_view');
});
