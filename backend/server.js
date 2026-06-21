// backend/server.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { pool, testConnection } from './config/db.js';

const app = express();

// Настройка multer для парсинга FormData
const upload = multer({
  storage: multer.memoryStorage(), // Храним в памяти, можно настроить diskStorage для сохранения файлов
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB лимит для файлов
    fieldSize: 10 * 1024 * 1024 // 10MB для текстовых полей
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', "http://127.0.0.1:3030"], // URL вашего Nuxt приложения
  credentials: true
}));
app.use(express.json()); // Парсим JSON
app.use(express.urlencoded({ extended: true })); // Парсим обычные формы (application/x-www-form-urlencoded)

// Эндпоинт для приема FormData
app.post('/api/submit-form', upload.any(), (req, res) => {
  // req.body содержит текстовые поля из FormData
  // req.files содержит загруженные файлы

  const { name, email, message } = req.body;

  console.log('📝 Текстовые поля:', req.body);
  console.log('📎 Файлы:', req.files);

  if (!name || !email) {
    return res.status(400).json({
      error: 'Имя и email обязательны',
      received: { name, email }
    });
  }

  // Пример обработки файлов
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      console.log(`Файл ${file.originalname} (${file.mimetype}) размер: ${file.size} bytes`);
    });
  }

  res.json({
    success: true,
    message: 'Данные успешно получены!',
    data: {
      name,
      email,
      message: message || '',
      filesCount: req.files?.length || 0
    }
  });
});

// Альтернативный эндпоинт для конкретных названий полей
app.post('/api/submit-form-fields', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]), (req, res) => {
  console.log('Files by field:', req.files);
  console.log('Body:', req.body);

  res.json({
    success: true,
    files: req.files,
    body: req.body
  });
});

// Эндпоинт для форм с файлами (один файл)
app.post('/api/submit-with-file', upload.single('attachment'), (req, res) => {
  console.log('Текстовые поля:', req.body);
  console.log('Загруженный файл:', req.file);

  res.json({
    success: true,
    fileName: req.file?.originalname,
    fileSize: req.file?.size,
    ...req.body
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Express сервер запущен на http://localhost:${PORT}`);
  console.log(`📡 Поддерживает: JSON, FormData, URL-encoded формы`);
  console.log(`📎 Поддерживает загрузку файлов до 5MB`);
});

const startServer = async () => {
  try {
    // Проверяем подключение к БД
    const isDbConnected = await testConnection();

    if (!isDbConnected) {
      console.error('❌ Не удалось подключиться к базе данных. Сервер не будет запущен.');
      process.exit(1);
    }

    // Если БД подключена, запускаем сервер
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`✅ Express сервер запущен на http://localhost:${PORT}`);
      console.log(`📡 Поддерживает: JSON, FormData, URL-encoded формы`);
      console.log(`📎 Поддерживает загрузку файлов до 5MB`);
      console.log(`🗄️  MySQL база данных: ${process.env.DB_NAME || 'form_db'}`);
    });

  } catch (error) {
    console.error('❌ Ошибка при запуске сервера:', error.message);
    process.exit(1);
  }
};

// Запускаем сервер с проверкой БД
startServer();