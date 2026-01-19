// ===============================
// Навигация кнопок "Ознакомиться и купить"
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const service = e.target.closest('.service');
        const page = service?.dataset.page;
        if (page) window.location.href = page;
    });
});

// ===============================
// Навигация кнопок "Пробовать бесплатно"
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});

// ===============================
// Логика показа кнопки "Пробовать бесплатно" по флагу и UUID
(function() {
    if (typeof ymab === 'undefined') return;

    ymab('metrika.106324646', 'init', function() {
        // Получаем флаг эксперимента
        ymab('getFlags', ['exp_show_free_button'], function(flags) {
            if (!flags || flags.exp_show_free_button !== 'enabled') return;

            // Получаем UUID пользователя
            ymab('getClientInfo', function(info) {
                const uuid = info.user_id;
                if (!uuid) return;

                const lastChar = uuid.slice(-1).toLowerCase();
                if (lastChar === 'f') return; // вне эксперимента

                const lastDigit = parseInt(lastChar, 16);
                if (!isNaN(lastDigit) && lastDigit % 2 === 0) {
                    document.querySelectorAll('.try-free-btn').forEach(btn => {
                        btn.style.display = 'inline-block';
                    });
                }
            });
        });
    });
})();
