(function () {

    function showFreeButtonIfNeeded() {
        if (typeof ymab === 'undefined') {
            requestAnimationFrame(showFreeButtonIfNeeded);
            return;
        }

        ymab('getFlags', function (flags) {
            console.log('FLAGS FROM VARIOQUB:', flags);

            if (!Array.isArray(flags)) return;

            const flag = flags.find(f => f.n === 'show_free_button');

            if (flag && (flag.v === true || flag.v === 'true')) {
                document.querySelectorAll('.try-free-btn')
                    .forEach(btn => btn.style.display = 'inline-block');
            }
        });
    }

    showFreeButtonIfNeeded();

})();
