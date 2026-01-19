(function () {

    function showFreeButton() {
        // Ждём пока ymab определён
        if (typeof ymab === 'undefined') {
            requestAnimationFrame(showFreeButton);
            return;
        }

        ymab('getFlags', function(flagsArray){
            if (!Array.isArray(flagsArray)) return;
            const flag = flagsArray.find(f => f.n === 'show_free_button');
            if (!flag) return;

            // Любой вариант "true" — показываем кнопку
            const val = String(flag.v).toLowerCase();
            if (val === 'true' || val === '1') {
                document.querySelectorAll('.try-free-btn')
                    .forEach(btn => btn.style.display = 'inline-block');
            }
        });

        // Кнопка "Ознакомиться и купить"
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const service = e.target.closest('.service');
                if (service?.dataset.page) window.location.href = service.dataset.page;
            });
        });

        // Кнопка "Пробовать бесплатно"
        document.querySelectorAll('.try-free-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = 'free-info.html';
            });
        });
    }

    // Ждём полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showFreeButton);
    } else {
        showFreeButton();
    }

})();
