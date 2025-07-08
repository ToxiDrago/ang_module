# 🔧 CORS Fix Documentation

## 🚨 Проблема

Frontend на `http://localhost:59177` не может обращаться к backend на `http://localhost:3000` из-за CORS политики.

## ✅ Решение

### 1. Обновлена CORS конфигурация в `src/backend.main.ts`:

```typescript
app.enableCors({
  origin: [
    "http://localhost:4200",
    "http://localhost:59177",
    /^http:\/\/localhost:\d+$/, // Разрешаем все localhost порты
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Accept, Authorization",
  credentials: true,
});
```

### 2. Что изменилось:

- ✅ Добавлен `http://localhost:59177` в список разрешенных origins
- ✅ Добавлен regex `/^http:\/\/localhost:\d+$/` для всех localhost портов
- ✅ Добавлен метод `OPTIONS` для preflight запросов
- ✅ Добавлен заголовок `Authorization` для JWT токенов

### 3. Как применить изменения:

```bash
# 1. Остановить backend (если запущен)
taskkill //F //IM node.exe

# 2. Пересобрать backend
npm run build:backend

# 3. Запустить backend
npm run start:backend

# 4. Обновить страницу frontend в браузере
```

### 4. Проверка исправления:

После применения изменений:

1. Откройте DevTools в браузере (F12)
2. Перейдите на вкладку Network
3. Попробуйте выполнить действие, которое вызывает API запрос
4. Проверьте, что запросы проходят без CORS ошибок

### 5. Альтернативные решения:

Если проблема остается, можно временно использовать:

```typescript
// В src/backend.main.ts - разрешить все origins (только для разработки!)
app.enableCors({
  origin: true, // Разрешить все origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Accept, Authorization",
  credentials: true,
});
```

## 🧪 Тестирование

Создан тест `test-cors-fix.js` для проверки CORS конфигурации:

```bash
node test-cors-fix.js
```

## 📝 Примечания

- CORS настройки применяются только к backend
- Frontend не требует изменений
- После изменения CORS нужно перезапустить backend
- В production используйте конкретные домены вместо wildcard

## 🔍 Отладка

Если CORS ошибки продолжаются:

1. Проверьте, что backend перезапущен
2. Очистите кэш браузера
3. Проверьте заголовки ответа в DevTools
4. Убедитесь, что frontend делает запросы к правильному URL
