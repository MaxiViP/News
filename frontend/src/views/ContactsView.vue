<template>
  <div class="contacts-page">
    <h1>Контакты</h1>

    <section>
      <h2>Редакция</h2>
      <p>Email: <a href="batti@ya.ru">batti@ya.ru</a></p>
      <p>Телефон: <a href="tel:+79057353580">+7 (905) 7353580</a></p>
    </section>

    <section>
      <h2>Реклама и партнёрство</h2>
      <p>Email: <a href="batti@ya.ru">batti@ya.ru</a></p>
    </section>

    <section>
      <h2>Мы в соцсетях</h2>
      <ul>
        <li><a href="#" target="_blank">Telegram</a></li>
        <li><a href="#" target="_blank">ВКонтакте</a></li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
// тут логика не нужна, статическая страница
</script>

<style scoped>
.contacts-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 0.6s ease-in-out;
}

h1 {
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  text-align: center;
}

h2 {
  margin-top: 32px;
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #09278d;
  position: relative;
}

h2::after {
  content: "";
  display: block;
  width: 40px;
  height: 3px;
  background: #2563eb;
  margin-top: 6px;
  border-radius: 2px;
}

p, li {
  margin: 8px 0;
  font-size: 16px;
  color: #374151;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin: 6px 0;
}

ul li a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: all 0.2s ease-in-out;
}

ul li a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 2px;
  background: #2563eb;
  transition: width 0.25s ease;
}

ul li a:hover::after,
ul li a:focus::after,
ul li a:active::after {
  width: 100%;
}

ul li a:hover {
  color: #1d4ed8;
}

ul li a:focus {
  outline: none;
  color: #1e40af;
}

ul li a:active {
  color: #dc2626;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

