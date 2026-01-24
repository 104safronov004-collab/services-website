// UUID
if (!localStorage.getItem("user_id")) {
  localStorage.setItem("user_id", crypto.randomUUID());
}
const uid = document.getElementById("userId");
if (uid) uid.innerText = "Ваш ID: " + localStorage.getItem("user_id");

// Переход на оплату
function goPay(service) {
  localStorage.setItem("currentPay", service);
  location.href = "payment.html";
}

// Оплата
function pay() {
  const service = localStorage.getItem("currentPay");
  localStorage.setItem("paid_" + service, "true");
  localStorage.setItem("paidDate_" + service, new Date().toISOString());

  const snack = document.getElementById("snack");
  if(snack) {
    snack.style.display = "block";
    setTimeout(() => snack.style.display = "none", 3000);
  }

  // Вернуть пользователя на страницу услуги или список услуг
  location.href = "services.html";
}

// Рендер услуги
function renderService(service) {
  const container = document.getElementById("content");
  let html = "";

  for (let i = 1; i <= 30; i++) {
    html += `<div>Документ ${i}. Описание шаблона</div>`;
  }

  container.innerHTML = html;

  if (!localStorage.getItem("paid_" + service)) {
    container.classList.add("blur");
  }
}
