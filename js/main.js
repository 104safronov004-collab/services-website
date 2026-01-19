// Навигация кнопок "Ознакомиться и купить"
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const service = e.target.closest('.service');
        const page = service?.dataset.page;
        if (page) window.location.href = page;
    });
});

// Навигация кнопок "Пробовать бесплатно"
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});

// Логика показа кнопки по UUID и флагу эксперимента
(function() {
    if (typeof ymab !== 'undefined') {
        ymab('metrika.106324646', 'init', function() {
            ymab('getFlags', ['exp_show_free_button'], function(flags) {
                // Эксперимент должен быть включен
                if (flags.exp_show_free_button !== 'enabled') return;

                ymab('getClientInfo', function(info) {
                    var uuid = info.user_id;
                    if (!uuid) return; // нет UUID → ничего не показываем

                    var lastChar = uuid.slice(-1).toLowerCase();

                    // пользователь вне эксперимента
                    if (lastChar === 'f') return;

                    // четность последнего символа (hex -> int)
                    var lastDigit = parseInt(lastChar, 16);
                    var showButton = !isNaN(lastDigit) && (lastDigit % 2 === 0);

                    document.querySelectorAll('.try-free-btn').forEach(function(btn) {
                        btn.style.display = showButton ? 'inline-block' : 'none';
                    });
                });
            });
        });
    }
})();
