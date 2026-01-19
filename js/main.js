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
    // Проверяем, подключен ли VarioQub
    if (typeof ymab === 'undefined') return;

    // Инициализация VarioQub
    ymab('metrika.106324646', 'init', function() {
        // Получаем флаг эксперимента
        ymab('getFlags', ['exp_show_free_button'], function(flags) {
            if (!flags) return; // Если флаги не пришли — не показываем
            if (flags.exp_show_free_button !== 'enabled') return; // Эксперимент выключен

            // Получаем UUID пользователя
            ymab('getClientInfo', function(info) {
                const uuid = info.user_id;
                if (!uuid) return; // UUID нет — не показываем

                const lastChar = uuid.slice(-1).toLowerCase();

                // Пользователь вне эксперимента
                if (lastChar === 'f') return;

                // Проверяем четность последнего символа
                const lastDigit = parseInt(lastChar, 16);
                if (!isNaN(lastDigit) && lastDigit % 2 === 0) {
                    // Показываем кнопку только группе exp
                    document.querySelectorAll('.try-free-btn').forEach(btn => {
                        btn.style.display = 'inline-block';
                    });
                }
            });
        });
    });
})();
// Сначала навигация кнопок оставляем без изменений
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const service = e.target.closest('.service');
        const page = service?.dataset.page;
        if (page) window.location.href = page;
    });
});
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});

// ===============================
// Показываем кнопку только если эксперимент включен
ymab('metrika.106324646', 'init', function() {
    // здесь VarioQub уже готов
    ymab('getFlags', ['exp_show_free_button'], function(flags) {
        // если эксперимент выключен или флаг неправильный — ничего не показываем
        if (!flags || flags.exp_show_free_button !== 'enabled') return;

        ymab('getClientInfo', function(info) {
            const uuid = info.user_id;
            if (!uuid) return; // UUID нет — не показываем

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
