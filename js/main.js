// ===============================
// Кнопка "Ознакомиться и купить"
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const service = e.target.closest('.service');
        const page = service.dataset.page;
        window.location.href = page;
    });
});

// ===============================
// Кнопка "Пробовать бесплатно"
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});
