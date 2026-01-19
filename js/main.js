(function () {

    function showFreeButton() {
        // Если ymab ещё не определён, ждём
        if (typeof ymab === 'undefined') {
            requestAnimationFrame(showFreeButton);
            return;
        }

        ymab('getFlags', function(flagsArray) {
            if (!flagsArray || !Array.isArray(flagsArray)) return;

            const flag = flagsArray.find(f => f.n === 'show_free_button');
            if (!flag) return;

            // ВСЕ варианты true
            if (flag.v === true || flag.v === 'true' || flag.v === '1') {
                // Находим кнопки в DOM и показываем их
                document.querySelectorAll('.try-free-btn').forEach(btn => {
                    btn.style.display = 'inline-block';
                });
            }
        });
    }

    // Ждём DOM полностью
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showFreeButton);
    } else {
        showFreeButton();
    }

})();
