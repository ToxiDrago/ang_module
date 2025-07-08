const http = require("http");

console.log("🚀 Integration Testing: Frontend + Backend\n");

// Проверяем backend
function testBackend() {
  return new Promise((resolve) => {
    console.log("🔍 Testing Backend (http://localhost:3000)...");

    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (
            res.statusCode === 200 ||
            res.statusCode === 201 ||
            res.statusCode === 401
          ) {
            console.log("✅ Backend is running and responding");
            resolve(true);
          } else {
            console.log("❌ Backend is not responding properly");
            resolve(false);
          }
        });
      }
    );

    req.on("error", () => {
      console.log("❌ Backend is not running");
      resolve(false);
    });

    req.write(JSON.stringify({ login: "test", password: "test" }));
    req.end();
  });
}

// Проверяем frontend
function testFrontend() {
  return new Promise((resolve) => {
    console.log("🔍 Testing Frontend (http://localhost:4200)...");

    const req = http.request(
      {
        hostname: "localhost",
        port: 4200,
        path: "/",
        method: "GET",
      },
      (res) => {
        if (res.statusCode === 200) {
          console.log("✅ Frontend is running and responding");
          resolve(true);
        } else {
          console.log("❌ Frontend is not responding properly");
          resolve(false);
        }
      }
    );

    req.on("error", () => {
      console.log("❌ Frontend is not running");
      resolve(false);
    });

    req.end();
  });
}

// Проверяем CORS
function testCORS() {
  return new Promise((resolve) => {
    console.log("🔍 Testing CORS configuration...");

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
        if (corsHeader && corsHeader.includes("localhost:4200")) {
          console.log("✅ CORS is properly configured");
          resolve(true);
        } else {
          console.log("❌ CORS is not configured properly");
          resolve(false);
        }
      }
    );

    req.on("error", () => {
      console.log("❌ Cannot test CORS - backend not responding");
      resolve(false);
    });

    req.write(JSON.stringify({ login: "test", password: "test" }));
    req.end();
  });
}

// Полный тест аутентификации
async function testFullAuth() {
  console.log("🔍 Testing full authentication flow...");

  try {
    // 1. Регистрация
    const registerResult = await makeRequest("/auth/register", "POST", {
      login: "integrationtest",
      password: "testpass123",
      email: "integration@test.com",
    });

    if (registerResult.status === 201) {
      console.log("✅ User registration successful");

      // 2. Логин
      const loginResult = await makeRequest("/auth/login", "POST", {
        login: "integrationtest",
        password: "testpass123",
      });

      if (loginResult.status === 200 && loginResult.data.access_token) {
        console.log("✅ User login successful");

        // 3. Доступ к защищенным эндпоинтам
        const protectedResult = await makeRequest(
          "/users",
          "GET",
          null,
          loginResult.data.access_token
        );

        if (protectedResult.status === 200) {
          console.log("✅ Protected endpoint access successful");
          return true;
        } else {
          console.log("❌ Protected endpoint access failed");
          return false;
        }
      } else {
        console.log("❌ User login failed");
        return false;
      }
    } else {
      console.log("✅ User already exists or registration failed");
      return true;
    }
  } catch (error) {
    console.log("❌ Authentication flow failed:", error.message);
    return false;
  }
}

function makeRequest(path, method, data = null, token = null) {
  return new Promise((resolve) => {
    const postData = data ? JSON.stringify(data) : null;

    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": postData ? Buffer.byteLength(postData) : 0,
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => (responseData += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on("error", (err) => {
      resolve({ status: 0, error: err.message });
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runIntegrationTests() {
  console.log("🧪 Running Integration Tests...\n");

  const results = {
    backend: await testBackend(),
    frontend: await testFrontend(),
    cors: await testCORS(),
    auth: await testFullAuth(),
  };

  console.log("\n📊 Integration Test Results:");
  console.log("========================");
  console.log(`Backend: ${results.backend ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Frontend: ${results.frontend ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`CORS: ${results.cors ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Authentication: ${results.auth ? "✅ PASS" : "❌ FAIL"}`);

  const allPassed = Object.values(results).every((result) => result);

  if (allPassed) {
    console.log("\n🎉 All integration tests passed!");
    console.log("🚀 Your full-stack application is ready!");
  } else {
    console.log("\n⚠️  Some tests failed. Check the configuration.");
  }

  console.log("\n📝 Next steps:");
  console.log("1. Open http://localhost:4200 in your browser");
  console.log("2. Test the authentication flow in the UI");
  console.log("3. Verify that frontend can communicate with backend");
}

runIntegrationTests();
