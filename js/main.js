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

// Логика эксперимента VarioQub — ждём инициализацию
(function () {
    if (typeof ymab === 'undefined') return;

    // ymab('метрика', 'init', callback)
    ymab('metrika.106324646', 'init', function() {
        // Теперь ymab точно готов
        ymab('getFlags', function(flagsArray) {
            if (!Array.isArray(flagsArray)) return;

            const flagObj = flagsArray.find(f => f.n === 'show_free_button');
            if (!flagObj) return;

            const showFree = flagObj.v === true || flagObj.v === 'true';
            if (showFree) {
                document.querySelectorAll('.try-free-btn').forEach(btn => {
                    btn.style.display = 'inline-block';
                });
            }
        });
    });
})();
