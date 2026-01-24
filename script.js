// -------------------------------
// Рендер контента для каждой услуги
// -------------------------------
function renderService(service) {
  const content = document.getElementById("content");
  if(!content) return;

  let html = "";
  switch(service) {
    case "law":
      html = `
        <p>Федеральные, региональные и муниципальные нормативные акты.</p>
        <p>Шаблоны договоров, инструкции и образцы документов для предприятий.</p>
        <p>Дополнительные юридические материалы.</p>
      `;
      break;
    case "ot":
      html = `
        <p>Инструкции по охране труда для работников.</p>
        <p>Журналы, приказы и программы обучения по охране труда.</p>
        <p>Полезные методические материалы и шаблоны.</p>
      `;
      break;
    case "pb":
      html = `
        <p>Документы по промышленной безопасности.</p>
        <p>Шаблоны инструкций по Промбезопасности.</p>
        <p>Примеры отчетов для предприятий.</p>
      `;
      break;
    default:
      html = "<p>Документы не найдены.</p>";
  }

  content.innerHTML = html;
  content.classList.add("blur"); // по умолчанию размытый
}

// -------------------------------
// Универсальная функция подписки
// -------------------------------
function handleSubscription(service) {
  const content = document.getElementById("content");
  if(!content) return;

  // 1. Рендерим контент
  renderService(service);

  // 2. Проверяем подписку
  const notice = document.getElementById("subscriptionNotice");
  const paidDate = localStorage.getItem("paidDate_" + service);
  const now = new Date();
  let daysLeft = 0;

  if(paidDate) {
    const startDate = new Date(paidDate);
    const diffTime = now - startDate;
    daysLeft = 30 - Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  if(daysLeft > 0) {
    // Подписка активна
    if(notice) {
      notice.style.display = "block";
      document.getElementById("daysLeft").innerText = daysLeft;
    }
    content.classList.remove("blur"); // показываем контент
  } else {
    // Подписка истекла
    if(notice) notice.style.display = "none";
    content.classList.add("blur"); // снова размываем
    localStorage.removeItem("paid_" + service);
    localStorage.removeItem("paidDate_" + service);
  }
}

// -------------------------------
// Начало оплаты (кнопка "Купить подписку")
// -------------------------------
function goPay(service) {
  localStorage.setItem("currentPay", service);
  location.href = "payment.html"; // Переход на страницу оплаты
}

// -------------------------------
// Оплата на странице payment.html
// -------------------------------
function pay() {
  const service = localStorage.getItem("currentPay");
  if(!service) return;

  // Сохраняем факт оплаты и дату
  localStorage.setItem("paid_" + service, "true");
  localStorage.setItem("paidDate_" + service, new Date().toISOString());

  // Показать снек уведомление
  const snack = document.getElementById("snack");
  if(snack) {
    snack.style.display = "block";
    setTimeout(() => snack.style.display = "none", 3000);
  }

  // Возврат на страницу услуг
  location.href = "services.html";
}
