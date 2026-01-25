// ===============================
// CONFIG
// ===============================
const ANALYTICS_URL = "https://analytics-server-five.vercel.app/analytics";
const EXPERIMENT_NAME = "subscription_extend_exp_v1";

// ===============================
// UUID
// ===============================
function getUserUUID() {
  let uuid = localStorage.getItem("user_uuid");
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem("user_uuid", uuid);
  }
  return uuid;
}
const USER_UUID = getUserUUID();

// ===============================
// USER GROUP
// ===============================
function getUserGroup(uuid) {
  const last = uuid.slice(-1);
  if (/[a-zA-Z]/.test(last)) return "none";
  return parseInt(last, 10) % 2 === 0 ? "exp" : "control";
}
const USER_GROUP = getUserGroup(USER_UUID);

// ===============================
// SEND ANALYTICS (fetch POST на Vercel)
// ===============================
function sendAnalytics(payload) {
  if (USER_GROUP === "none") {
    return Promise.resolve();
  }

  return fetch(ANALYTICS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(res => {
    console.log("Analytics status:", res.status);
    return res;
  });
}


// ===============================
// TOGGLE DOC
// ===============================
function toggleText(el) {
  const p = el.nextElementSibling;
  p.style.display = p.style.display === "block" ? "none" : "block";
}

// ===============================
// RENDER SERVICE
// ===============================
function renderService(service) {
  const content = document.getElementById("content");
  if (!content) return;

  const data = {
    law: [{ title: "Law document", text: "Text..." }],
    ot: [{ title: "OT document", text: "Text..." }],
    pb: [{ title: "PB document", text: "Text..." }]
  };

  content.innerHTML = (data[service] || []).map(d => `
    <div class="document">
      <h4 onclick="toggleText(this)" style="cursor:pointer;text-decoration:underline">${d.title}</h4>
      <p style="display:none">${d.text}</p>
    </div>
  `).join("");
}

// ===============================
// SUBSCRIPTION HANDLER
// ===============================
function handleSubscription(service) {
  const content = document.getElementById("content");
  const notice = document.getElementById("subscriptionNotice");
  if (!content) return;

  renderService(service);

  const paidUntil = localStorage.getItem("paidUntil_" + service);
  const now = new Date();
  let daysLeft = 0;

  if (paidUntil) {
    daysLeft = Math.ceil((new Date(paidUntil) - now) / 86400000);
  }

  if (daysLeft > 0) {
    content.classList.remove("blur");
    if (notice) {
      notice.style.display = "block";
      document.getElementById("daysLeft").innerText = daysLeft;

      if (USER_GROUP === "exp" && daysLeft <= 10) {
        notice.classList.add("notice-exp");
      } else {
        notice.classList.remove("notice-exp");
      }
    }

    if (USER_GROUP === "exp" && daysLeft <= 10) {
      showExpModalOncePerDay(service, daysLeft);
    }
  } else {
    content.classList.add("blur");
    if (notice) notice.style.display = "none";
  }
}

// ===============================
// BUY BUTTON
// ===============================
function goPay(service) {
  localStorage.setItem("currentPay", service);
  location.href = "payment.html";
}

// ===============================
// PAY (+30 DAYS)
// ===============================
// ===============================
// PAY (+30 DAYS) — исправлено
// ===============================
function pay() {
  const service = localStorage.getItem("currentPay");
  if (!service) return;

  // Продлеваем подписку
  const key = "paidUntil_" + service;
  const now = new Date();
  let base = localStorage.getItem(key) ? new Date(localStorage.getItem(key)) : now;
  base.setDate(base.getDate() + 30);
  localStorage.setItem(key, base.toISOString());

  // Отправляем аналитику
  sendAnalytics({
    button_name: "pay",
    event_type: "click",
    user_group: USER_GROUP,
    experiment_name: EXPERIMENT_NAME,
    uuid: USER_UUID
  });

  // Показываем снек
  const snack = document.getElementById("snack");
  if (snack) {
    snack.innerText = "Оплата успешно прошла";
    snack.classList.add("show");

    // requestAnimationFrame гарантирует, что браузер увидит класс .show
    requestAnimationFrame(() => {
      setTimeout(() => {
        snack.classList.remove("show"); // скрываем снек
        location.href = "services.html"; // редирект после показа
      }, 1200); // время отображения снека
    });
  } else {
    // Если снека нет — редирект сразу
    location.href = "services.html";
  }
}

// ===============================
// Функция показа снека
// ===============================
function showSnack(text) {
  const snack = document.getElementById("snack");
  if (!snack) return;

  snack.innerText = text;
  snack.classList.add("show"); // показывает снек

  setTimeout(() => {
    snack.classList.remove("show"); // скрывает через 1 секунду
  }, 1000);
}



// ===============================
// EXP MODAL
// ===============================
function showExpModalOncePerDay(service, daysLeft) {
  const key = `exp_modal_${service}_sent`;
  const today = new Date().toDateString();

  if (localStorage.getItem(key) === today) return;
  localStorage.setItem(key, today);

  sendAnalytics({
    element: "extend_modal",
    experiment_name: EXPERIMENT_NAME,
    user_group: "exp",
    uuid: USER_UUID
  });

  const modal = document.createElement("div");
  modal.style.cssText = `
    position:fixed;inset:0;
    background:rgba(0,0,0,.5);
    display:flex;align-items:center;justify-content:center;
    z-index:9999;
  `;

  modal.innerHTML = `
    <div style="background:#fff;padding:24px;border-radius:12px;text-align:center">
      <h3>
        До конца подписки осталось
        <span style="color:red;font-weight:bold">${daysLeft}</span> дней,
        продлите подписку сейчас
      </h3>
      <button id="extendBtn" class="exp-btn green">Продлить</button>
      <button id="laterBtn" class="exp-btn red">Оформить позже</button>
    </div>
  `;

  document.body.appendChild(modal);

document.getElementById("extendBtn").onclick = () => {
  sendAnalytics({
    button_name: "extend",
    event_type: "click",
    user_group: "exp",
    experiment_name: EXPERIMENT_NAME,
    uuid: USER_UUID
  }).then(() => {
    goPay(service);
  });
};


  document.getElementById("laterBtn").onclick = () => {
    sendAnalytics({
      button_name: "later",
      event_type: "click",
      user_group: "exp",
      experiment_name: EXPERIMENT_NAME,
      uuid: USER_UUID
    });
    modal.remove();
  };
}

// ===============================
// КНОПКА «Купить» — аналитика только здесь
// ===============================
function onBuyClick(service) {
  sendAnalytics({
    button_name: "buy",
    event_type: "click",
    user_group: USER_GROUP,
    experiment_name: EXPERIMENT_NAME,
    uuid: USER_UUID
  }).then(() => {
    // ⬅️ fetch УЖЕ завершён
    goPay(service);
  });
}

