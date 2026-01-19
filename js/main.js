// ===============================
// UUID пользователя
// ===============================
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = generateUUID();
    localStorage.setItem('userId', userId);
}


// ===============================
// Показ кнопки (ЕДИНСТВЕННАЯ ТОЧКА)
// ===============================
function showFreeButton(group) {
    if (group !== 'exp_01') return;

    document.querySelectorAll('.try-free-btn').forEach(btn => {
        btn.style.display = 'inline-block';
    });
}


// ===============================
// VARIOCUBE — ПРОВЕРКА ЭКСПЕРИМЕНТА
// ===============================
ymab('metrika.106320594', 'getExperiments', function (experiments) {

    if (!Array.isArray(experiments)) {
        console.log('❌ No experiments');
        return;
    }

    const exp = experiments.find(e => e.name === 'free_button_experiment');

    if (!exp) {
        console.log('❌ Experiment not found');
        return;
    }

    console.log('🧪 Experiment group:', exp.variant);

    localStorage.setItem('experimentGroup', exp.variant);
    showFreeButton(exp.variant);
});


// ===============================
// Навигация (БЕЗ аналитики)
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

document.querySelectorAll('.try-free-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'free-info.html';
    });
});
