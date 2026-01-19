// Купить
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const page = e.target.closest('.service')?.dataset.page;
        if (page) location.href = page;
    });
});

// Бесплатно
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        location.href = 'free-info.html';
    });
});
