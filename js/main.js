// Переход "Ознакомиться и купить"
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const service = e.target.closest('.service');
        window.location.href = service.dataset.page;
    });
});

// Переход "Пробовать бесплатно"
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});

// Логика эксперимента VarioQub
(function () {
    if (typeof ymab === 'undefined') return;

    ymab('getFlags', ['show_free_button'], function (flags) {
        if (flags && flags.show_free_button === true) {
            document.querySelectorAll('.try-free-btn').forEach(btn => {
                btn.style.display = 'inline-block';
            });
        }
    });
})();
