const express = require('express');
const { faker } = require('@faker-js/faker');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// CORS для разрешения запросов с клиента (в т.ч. с GitHub Pages)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');

  // Быстрый ответ на preflight-запросы
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

// Хранилище сообщений (в реальном приложении это была бы БД)
let messages = [];
let lastTimestamp = Math.floor(Date.now() / 1000);

// Генерация случайных сообщений
function generateMessages(count = 1) {
  const newMessages = [];
  for (let i = 0; i < count; i++) {
    newMessages.push({
      id: faker.string.uuid(),
      from: faker.internet.email(),
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      received: lastTimestamp - Math.floor(Math.random() * 86400) // случайное время в последние 24 часа
    });
  }
  return newMessages;
}

// Инициализация начальных сообщений
messages = generateMessages(3);

// Endpoint для получения непрочитанных сообщений
app.get('/messages/unread', (req, res) => {
  // Случайно добавляем новые сообщения (30% вероятность)
  if (Math.random() < 0.3) {
    const newMessages = generateMessages(Math.floor(Math.random() * 3) + 1);
    messages = [...newMessages, ...messages];
  }

  const timestamp = Date.now();
  
  res.json({
    status: 'ok',
    timestamp: timestamp,
    messages: messages
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/messages/unread`);
});
