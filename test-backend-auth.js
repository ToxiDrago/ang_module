const http = require("http");

// Тестовые данные
const testUser = {
  login: "testuser",
  password: "testpass123",
  email: "test@example.com",
};

let authToken = null;

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

    console.log(`🔍 ${method} ${path}${token ? " (with auth)" : ""}`);

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseData);
          console.log(`✅ Status: ${res.statusCode}`);
          console.log(`   Response:`, parsed);
          console.log("");
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          console.log(`✅ Status: ${res.statusCode}`);
          console.log(`   Response: ${responseData}`);
          console.log("");
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on("error", (err) => {
      console.log(`❌ Error: ${err.message}`);
      console.log("");
      resolve({ status: 0, error: err.message });
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

async function runAuthTests() {
  console.log("🧪 Backend Authentication Testing...\n");

  // 1. Регистрация пользователя
  console.log("📝 1. Testing user registration...");
  const registerResult = await makeRequest("/auth/register", "POST", testUser);

  if (registerResult.status === 201 || registerResult.status === 409) {
    console.log("✅ Registration successful or user already exists");
  }

  // 2. Аутентификация пользователя
  console.log("🔐 2. Testing user authentication...");
  const authResult = await makeRequest("/auth/login", "POST", {
    login: testUser.login,
    password: testUser.password,
  });

  if (authResult.status === 200 && authResult.data.access_token) {
    authToken = authResult.data.access_token;
    console.log("✅ Authentication successful, got JWT token");
  } else {
    console.log("❌ Authentication failed");
    return;
  }

  // 3. Тестирование защищенных эндпоинтов с токеном
  console.log("🔒 3. Testing protected endpoints...");

  const protectedEndpoints = [
    { path: "/users", method: "GET", description: "Get all users" },
    { path: "/tours", method: "GET", description: "Get all tours" },
    { path: "/orders", method: "GET", description: "Get all orders" },
  ];

  for (const endpoint of protectedEndpoints) {
    console.log(`\n🔍 Testing: ${endpoint.description}`);
    const result = await makeRequest(
      endpoint.path,
      endpoint.method,
      null,
      authToken
    );

    if (result.status === 200) {
      console.log(`✅ ${endpoint.description} - SUCCESS`);
    } else {
      console.log(
        `❌ ${endpoint.description} - FAILED (Status: ${result.status})`
      );
    }
  }

  console.log("\n🎉 Authentication testing completed!");
}

runAuthTests();
