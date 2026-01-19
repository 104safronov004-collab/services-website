// ===============================
// Навигация кнопок "Ознакомиться и купить"
// ===============================
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const service = e.target.closest('.service');
        const page = service?.dataset.page;
        if (page) window.location.href = page;
    });
});

// ===============================
// Навигация кнопок "Пробовать бесплатно"
// ===============================
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});

// ===============================
// Логика показа кнопки "Пробовать бесплатно" по UUID и флагу эксперимента
// ===============================
(function() {
    // проверяем, подключен ли VarioQub
    if (typeof ymab !== 'undefined') {
        ymab('metrika.106324646', 'init', function() {
            // получаем флаг эксперимента
            ymab('getFlags', ['exp_show_free_button'], function(flags) {
                var expEnabled = flags.exp_show_free_button === 'enabled';
                if (!expEnabled) return; // эксперимент выключен → кнопка никому не показывается

                // получаем UUID пользователя
                ymab('getClientInfo', function(info) {
                    var uuid = info.user_id;
                    if (!uuid) return; // если UUID нет, ничего не показываем

                    var lastChar = uuid.slice(-1).toLowerCase();

                    // пользователь вне эксперимента
                    if (lastChar === 'f') return;

                    // проверяем четность последнего символа (hex -> int)
                    var lastDigit = parseInt(lastChar, 16);
                    var showButton = !isNaN(lastDigit) && (lastDigit % 2 === 0);

                    // показываем или скрываем кнопку
                    document.querySelectorAll('.try-free-btn').forEach(function(btn) {
                        btn.style.display = showButton ? 'inline-block' : 'none';
                    });
                });
            });
        });
    }
})();
