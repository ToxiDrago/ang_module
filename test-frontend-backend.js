const http = require("http");

console.log("🔗 Testing Frontend-Backend Communication\n");

// Проверяем, что оба сервиса запущены
async function checkServices() {
  console.log("📋 Service Status Check:");

  // Backend check
  const backendStatus = await checkService("localhost", 3000, "Backend");

  // Frontend check
  const frontendStatus = await checkService("localhost", 4200, "Frontend");

  return { backend: backendStatus, frontend: frontendStatus };
}

function checkService(host, port, name) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: host,
        port: port,
        path: "/",
        method: "GET",
        timeout: 3000,
      },
      (res) => {
        console.log(`✅ ${name} (${host}:${port}) - Status: ${res.statusCode}`);
        resolve(true);
      }
    );

    req.on("error", (err) => {
      console.log(`❌ ${name} (${host}:${port}) - ${err.message}`);
      resolve(false);
    });

    req.on("timeout", () => {
      console.log(`⏰ ${name} (${host}:${port}) - Timeout`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Тестируем API эндпоинты
async function testAPIEndpoints() {
  console.log("\n🔌 API Endpoints Test:");

  const endpoints = [
    { path: "/auth/register", method: "POST", name: "Auth Register" },
    { path: "/auth/login", method: "POST", name: "Auth Login" },
    { path: "/users", method: "GET", name: "Users (Protected)" },
    { path: "/tours", method: "GET", name: "Tours (Protected)" },
    { path: "/orders", method: "GET", name: "Orders (Protected)" },
  ];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(
      endpoint.path,
      endpoint.method,
      endpoint.name
    );
    console.log(`   ${result ? "✅" : "❌"} ${endpoint.name}`);
  }
}

function testEndpoint(path, method, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      // 200, 201, 401, 404 - все валидные ответы для тестирования
      const isValidResponse = [200, 201, 401, 404].includes(res.statusCode);
      resolve(isValidResponse);
    });

    req.on("error", () => {
      resolve(false);
    });

    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });

    // Отправляем пустые данные для POST запросов
    if (method === "POST") {
      req.write(JSON.stringify({}));
    }

    req.end();
  });
}

// Тестируем CORS
async function testCORS() {
  console.log("\n🌐 CORS Configuration Test:");

  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:4200",
        },
      },
      (res) => {
        const corsHeader = res.headers["access-control-allow-origin"];
        const hasCORS = corsHeader && corsHeader.includes("localhost:4200");

        console.log(`   ${hasCORS ? "✅" : "❌"} CORS configured for frontend`);
        console.log(`   CORS Header: ${corsHeader || "Not found"}`);

        resolve(hasCORS);
      }
    );

    req.on("error", () => {
      console.log("   ❌ Cannot test CORS");
      resolve(false);
    });

    req.write(JSON.stringify({ login: "test", password: "test" }));
    req.end();
  });
}

// Основная функция
async function runTests() {
  console.log("🚀 Starting Frontend-Backend Integration Test\n");

  // Проверяем сервисы
  const services = await checkServices();

  // Тестируем API
  await testAPIEndpoints();

  // Тестируем CORS
  const corsWorks = await testCORS();

  // Результаты
  console.log("\n📊 Test Summary:");
  console.log("================");
  console.log(`Backend Running: ${services.backend ? "✅" : "❌"}`);
  console.log(`Frontend Running: ${services.frontend ? "✅" : "❌"}`);
  console.log(`CORS Configured: ${corsWorks ? "✅" : "❌"}`);

  const allGood = services.backend && services.frontend && corsWorks;

  if (allGood) {
    console.log("\n🎉 Integration Test PASSED!");
    console.log("✅ Your full-stack application is ready for development");
    console.log("\n📝 What you can do now:");
    console.log("1. Open http://localhost:4200 in your browser");
    console.log("2. Test the authentication features");
    console.log("3. Verify that frontend can make API calls to backend");
    console.log("4. Start building your application features");
  } else {
    console.log("\n⚠️  Integration Test FAILED");
    console.log("Check the configuration and try again");
  }
}

runTests();
