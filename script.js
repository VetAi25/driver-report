const urlParams = new URLSearchParams(window.location.search);
const groupId = urlParams.get("group");

const form = document.getElementById("reportForm");

// Заповнення дати при завантаженні
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  form.querySelector('input[name="start_date"]').value = startOfWeek.toISOString().split('T')[0];
  form.querySelector('input[name="end_date"]').value = today.toISOString().split('T')[0];
});

// Автоматичний розрахунок компенсації
form.addEventListener("input", () => {
  const distance = parseFloat(form.querySelector('input[name="distance"]').value) || 0;
  const consumption = parseFloat(form.querySelector('input[name="consumption"]').value) || 0;
  const fuelPrice = parseFloat(form.querySelector('input[name="fuel_price"]').value) || 0;

  const compensation = (distance / 100) * consumption * fuelPrice;

  const compensationInput = form.querySelector('input[name="compensation"]');
  if (!compensationInput.matches(':focus')) {
    compensationInput.value = compensation.toFixed(2);
  }
});

// Надсилання
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  data.group_id = groupId;

  try {
    await fetch("https://n8n.vetai.win/webhook/6f1e4ab5-b06d-452f-9ae0-31b81718c63f", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    alert("Звіт надіслано. Дякуємо!");
    form.reset();
  } catch (err) {
    console.error("Помилка надсилання:", err);
    alert("Сталася помилка при надсиланні звіту.");
  }
});