// ===============================
// Навигация кнопок "Ознакомиться и купить"
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

// ===============================
// Навигация кнопок "Пробовать бесплатно"
// ===============================
document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});

// ===============================
// Логика показа кнопки "Пробовать бесплатно" по UUID
// ===============================
(function() {
    // проверка через VarioQub
    if (typeof ymab !== 'undefined') {
        ymab('metrika.106324646', 'init', function() {
            ymab('getFlags', ['exp_show_free_button'], function(flags) {
                var expEnabled = flags.exp_show_free_button === 'enabled';
                if (!expEnabled) return; // эксперимент выключен → ничего не показываем

                // получаем UUID пользователя
                ymab('getClientInfo', function(info) {
                    var uuid = info.user_id || generateUUID(); // fallback
                    showButtonByUUID(uuid);
                });
            });
        });
    } else {
        // VarioQub не подключен → локально для теста
        var uuid = generateUUID();
        showButtonByUUID(uuid);
    }

    // ===============================
    // Функция проверки UUID и показа кнопки
    // ===============================
    function showButtonByUUID(uuid) {
        var lastChar = uuid.slice(-1).toLowerCase();

        // пользователь вне эксперимента
        if (lastChar === 'f') return;

        // проверяем четность последнего символа (hex -> int)
        var lastDigit = parseInt(lastChar, 16);
        var showButton = !isNaN(lastDigit) && (lastDigit % 2 === 0);

        document.querySelectorAll('.try-free-btn').forEach(function(btn) {
            btn.style.display = showButton ? 'inline-block' : 'none';
        });
    }

    // ===============================
    // Функция генерации временного UUID (для теста)
    // ===============================
    function generateUUID() {
        // простой UUID для теста: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
})();
