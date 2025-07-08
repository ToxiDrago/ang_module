# 🚀 Postman Guide - Тестирование API

## 📋 **Быстрый старт:**

### 1. **Импорт коллекции:**

1. Откройте Postman
2. Нажмите **Import** → **File** → выберите `postman-collection.json`
3. Коллекция "Angular + NestJS API Collection" будет импортирована

### 2. **Настройка переменных:**

1. Откройте коллекцию
2. Перейдите на вкладку **Variables**
3. Убедитесь, что `baseUrl` = `http://localhost:3000`

## 🔐 **Тестирование аутентификации:**

### **Шаг 1: Регистрация пользователя**

1. Выберите **🔐 Authentication** → **Register User**
2. Нажмите **Send**
3. **Ожидаемый результат:** Status 201 + JWT токен
4. **Токен автоматически сохранится** в переменную `authToken`

### **Шаг 2: Вход в систему**

1. Выберите **🔐 Authentication** → **Login User**
2. Нажмите **Send**
3. **Ожидаемый результат:** Status 200 + JWT токен
4. **Токен автоматически сохранится** в переменную `authToken`

## 👥 **Тестирование Users API:**

### **Get All Users**

- **Метод:** GET
- **URL:** `{{baseUrl}}/users`
- **Ожидаемый результат:** Status 200 + список пользователей

### **Create User**

- **Метод:** POST
- **URL:** `{{baseUrl}}/users`
- **Body:**

```json
{
  "login": "newuser",
  "password": "password123",
  "email": "newuser@example.com",
  "cardNumber": "1234567890"
}
```

### **Get User by ID**

- **Метод:** GET
- **URL:** `{{baseUrl}}/users/:id`
- **Замените:** `USER_ID_HERE` на реальный ID пользователя

## 🏖️ **Тестирование Tours API:**

### **Get All Tours**

- **Метод:** GET
- **URL:** `{{baseUrl}}/tours`
- **Ожидаемый результат:** Status 200 + список туров

### **Generate Test Tours**

- **Метод:** POST
- **URL:** `{{baseUrl}}/tours/generate`
- **Ожидаемый результат:** Status 200 + созданные тестовые туры

### **Create Tour**

- **Метод:** POST
- **URL:** `{{baseUrl}}/tours`
- **Body:**

```json
{
  "name": "Amazing Beach Tour",
  "description": "Beautiful beach vacation",
  "tourOperator": "Beach Tours Inc",
  "price": "1500",
  "img": "beach.jpg",
  "type": "single",
  "date": "2024-08-15"
}
```

## 📋 **Тестирование Orders API:**

### **Get All Orders**

- **Метод:** GET
- **URL:** `{{baseUrl}}/orders`
- **Ожидаемый результат:** Status 200 + список заказов

### **Create Order**

- **Метод:** POST
- **URL:** `{{baseUrl}}/orders`
- **Body:**

```json
{
  "age": "25",
  "birthDay": "1999-01-01",
  "cardNumber": "1234567890",
  "tourId": "TOUR_ID_HERE",
  "userId": "USER_ID_HERE"
}
```

## 🔄 **Последовательность тестирования:**

### **1. Базовое тестирование:**

```bash
1. Register User → получить токен
2. Login User → получить токен
3. Get All Users → проверить доступ
4. Get All Tours → проверить доступ
5. Get All Orders → проверить доступ
```

### **2. CRUD операции:**

```bash
1. Create User → создать пользователя
2. Get User by ID → получить созданного пользователя
3. Update User → обновить пользователя
4. Delete User → удалить пользователя
```

### **3. Работа с турами:**

```bash
1. Generate Test Tours → создать тестовые туры
2. Get All Tours → проверить созданные туры
3. Create Tour → создать новый тур
4. Get Tour by ID → получить конкретный тур
```

## 📊 **Ожидаемые ответы:**

### **Успешные ответы:**

- **200 OK** - GET запросы, обновления
- **201 Created** - создание новых ресурсов
- **204 No Content** - удаление

### **Ошибки:**

- **401 Unauthorized** - нет токена или неверный токен
- **404 Not Found** - ресурс не найден
- **400 Bad Request** - неверные данные

## 🔧 **Отладка:**

### **Проблема: 401 Unauthorized**

**Решение:**

1. Выполните **Login User** или **Register User**
2. Проверьте, что токен сохранился в переменной `authToken`
3. Убедитесь, что в запросе есть заголовок `Authorization: Bearer {{authToken}}`

### **Проблема: 404 Not Found**

**Решение:**

1. Проверьте, что backend запущен на `http://localhost:3000`
2. Убедитесь, что URL запроса правильный
3. Проверьте, что ID ресурса существует

### **Проблема: 400 Bad Request**

**Решение:**

1. Проверьте формат JSON в body запроса
2. Убедитесь, что все обязательные поля заполнены
3. Проверьте типы данных

## 🎯 **Полезные советы:**

1. **Используйте переменные** для ID ресурсов
2. **Сохраняйте токены** автоматически через тесты
3. **Проверяйте заголовки** ответов
4. **Используйте Environment** для разных окружений
5. **Создавайте тесты** для автоматической проверки ответов

## 📝 **Пример теста в Postman:**

```javascript
// Тест для проверки успешного ответа
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

// Тест для проверки структуры ответа
pm.test("Response has required fields", function () {
  const response = pm.response.json();
  pm.expect(response).to.have.property("id");
  pm.expect(response).to.have.property("name");
});

// Автоматическое сохранение токена
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.collectionVariables.set("authToken", response.access_token);
}
```
