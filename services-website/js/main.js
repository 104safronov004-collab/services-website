// Кнопка "Наверх"
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

// Фильтр услуг
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

// Корзина
let cart = [];

const cartItems = document.getElementById('cart-items');
const totalEl = document.getElementById('total');

document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const serviceEl = e.target.closest('.service');
        const name = serviceEl.querySelector('h3').innerText;
        const price = Number(serviceEl.dataset.price);
        cart.push({name, price});
        // Сохраняем в localStorage для страницы оплаты
        localStorage.setItem('cart', JSON.stringify(cart));
        // Переход на страницу оплаты
        window.location.href = 'checkout.html';
    });
});

// Кнопка "Пробовать бесплатно"
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});

// Страница оплаты
const checkoutInfo = document.getElementById('checkout-info');
const confirmPayment = document.getElementById('confirm-payment');
if(checkoutInfo){
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    if(cartData.length > 0){
        const lastItem = cartData[cartData.length - 1]; // берём последнюю добавленную услугу
        checkoutInfo.innerHTML = `<p>Вы выбрали услугу: <strong>${lastItem.name}</strong></p>
                                  <p>Цена: <strong>${lastItem.price} ₽</strong></p>`;
    }
}

if(confirmPayment){
    confirmPayment.addEventListener('click', () => {
        alert('Оплата прошла успешно!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
}

// Форма обратной связи
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
}
