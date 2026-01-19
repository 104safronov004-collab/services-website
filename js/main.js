// Переход "Ознакомиться и купить"
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const service = e.target.closest('.service');
        if (service?.dataset.page) {
            window.location.href = service.dataset.page;
        }
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

    ymab('getFlags', function(flagsArray) {
        if (!Array.isArray(flagsArray)) return;

        // Ищем объект флага show_free_button
        const flagObj = flagsArray.find(f => f.n === 'show_free_button');
        if (!flagObj) return;

        // Приводим значение к boolean
        const showFree = flagObj.v === true || flagObj.v === 'true';
        if (showFree) {
            document.querySelectorAll('.try-free-btn').forEach(btn => {
                btn.style.display = 'inline-block';
            });
        }
    });
})();
