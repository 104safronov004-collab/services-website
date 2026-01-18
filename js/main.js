// ======== A/B эксперимент с UUID ========

// Генерация UUID v4
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Получение или создание userId
let userId = localStorage.getItem('userId');
if(!userId){
    userId = generateUUID();
    localStorage.setItem('userId', userId);
}

// Определяем группу эксперимента (чётность последнего символа UUID)
let experimentGroup;
const lastChar = userId[userId.length - 1];
const lastDigit = parseInt(lastChar, 16);
experimentGroup = (lastDigit % 2 === 0); // true = exp_01, false = control_01
localStorage.setItem('experimentGroup', experimentGroup);

// Для проверки в консоли
console.log('User ID:', userId);
console.log('Experiment group:', experimentGroup ? 'exp_01' : 'control_01');

// ======== Кнопка "Наверх" ========
let toTopBtn = document.getElementById("toTopBtn");
window.onscroll = function() {
    if(toTopBtn){
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            toTopBtn.style.display = "block";
        } else {
            toTopBtn.style.display = "none";
        }
    }
};
if(toTopBtn){
    toTopBtn.onclick = function() {
        window.scrollTo({top:0, behavior:'smooth'});
    };
}

// ======== Фильтр услуг ========
const filterBtns = document.querySelectorAll('.filter-btn');
const services = document.querySelectorAll('.service');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        services.forEach(service => {
            if(filter === 'all' || service.dataset.type === filter) {
                service.style.display = 'block';
            } else {
                service.style.display = 'none';
            }
        });
    });
});

// ======== Корзина ========
let cart = [];

document.querySelectorAll('.buy-btn').forEach(btn => {
    // Меняем цвет кнопки в зависимости от группы эксперимента
    if(experimentGroup){
        btn.style.backgroundColor = '#e94e77'; // красный для exp_01
    } else {
        btn.style.backgroundColor = '#4a90e2'; // синий для control_01
    }

    btn.addEventListener('click', (e) => {
        const serviceEl = e.target.closest('.service');
        const name = serviceEl.querySelector('h3').innerText;
        const price = Number(serviceEl.dataset.price);

        // Добавляем userId и группу в корзину
        cart.push({
            name,
            price,
            userId: userId,
            group: experimentGroup ? 'exp_01' : 'control_01'
        });

        // Сохраняем корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Переход на страницу оплаты
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
if(checkoutInfo){
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    if(cartData.length > 0){
        const lastItem = cartData[cartData.length - 1]; // последняя добавленная услуга
        checkoutInfo.innerHTML = `<p>Вы выбрали услугу: <strong>${lastItem.name}</strong></p>
                                  <p>Цена: <strong>${lastItem.price} ₽</strong></p>
                                  <p>User ID: <strong>${lastItem.userId}</strong></p>
                                  <p>Группа: <strong>${lastItem.group}</strong></p>`;
    }
}

if(confirmPayment){
    confirmPayment.addEventListener('click', () => {
        alert('Оплата прошла успешно!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
}

// ======== Форма обратной связи ========
const contactForm = document.getElementById('contactForm');
if(contactForm){
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        if(name && email && message){
            alert('Сообщение отправлено!');
            contactForm.reset();
        } else {
            alert('Пожалуйста, заполните все поля.');
        }
    });

// Метрика
    function sendUserExperimentInfo() {
    const userId = localStorage.getItem('userId');
    const experimentGroupRaw = localStorage.getItem('experimentGroup');
    const alreadySent = localStorage.getItem('userExperimentSent');

    if (!userId || alreadySent) return;

    const experimentGroup =
        experimentGroupRaw === 'true' ? 'exp_01' : 'control_01';

    const payload = {
        userId: userId,
        experimentGroup: experimentGroup,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };

    fetch('https://webhook.site/ТВОЙ-URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        console.log('📡 User experiment info sent', payload);
        localStorage.setItem('userExperimentSent', 'true');
    })
    .catch(err => {
        console.error('❌ Send failed', err);
    });
}

//Автоматический запуск при заходе на страницу
document.addEventListener('DOMContentLoaded', () => {
    sendUserExperimentInfo();
});

}
