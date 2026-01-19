// ===============================
// Показываем кнопку "Пробовать бесплатно" только если включена логика сайта
// ===============================
function showFreeButton() {
    document.querySelectorAll('.try-free-btn').forEach(btn => {
        btn.style.display = 'inline-block';
    });
}

// ===============================
// Навигация кнопок "Ознакомиться и купить" и "Пробовать бесплатно"
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


// Навигация кнопок "Ознакомиться и купить"
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const service = e.target.closest('.service');
        const page = service?.dataset.page;
        if (page) {
            window.location.href = page;
        }
    });
});

// Навигация кнопок "Пробовать бесплатно"
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});
