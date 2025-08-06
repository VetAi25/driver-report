const urlParams = new URLSearchParams(window.location.search);
const groupId = urlParams.get("group");

const form = document.getElementById("reportForm");

// Формуємо заголовок: "Тижневий автозвіт від дд.мм.рррр"
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  form.start_date.value = startOfWeek.toISOString().split('T')[0];
  form.end_date.value = today.toISOString().split('T')[0];

  const formattedDate = today.toLocaleDateString('uk-UA');
  document.getElementById("reportTitle").innerText = `🚚 Тижневий автозвіт від ${formattedDate}`;
});

// Автоматичне обчислення компенсації
form.addEventListener("input", () => {
  const distance = parseFloat(form.distance.value) || 0;
  const consumption = parseFloat(form.consumption.value) || 0;
  const fuelPrice = parseFloat(form.fuel_price.value) || 0;
  const calculated = (distance / 100) * consumption * fuelPrice;
  form.compensation.value = calculated.toFixed(2);
});

// Обробка надсилання
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.group_id = groupId;

  await fetch("https://n8n.vetai.win/webhook/6f1e4ab5-b06d-452f-9ae0-31b81718c63f", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  alert("✅ Звіт надіслано. Дякуємо!");
});
