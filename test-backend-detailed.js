const http = require("http");

// Тестируем основные эндпоинты
const endpoints = [
  { path: "/", method: "GET", description: "Root endpoint" },
  { path: "/users", method: "GET", description: "Get all users" },
  { path: "/tours", method: "GET", description: "Get all tours" },
  { path: "/orders", method: "GET", description: "Get all orders" },
];

function testEndpoint(path, method, description) {
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

    console.log(`🔍 Testing: ${method} ${path}`);

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`✅ ${description} (${method} ${path})`);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Headers:`, res.headers);
        console.log(
          `   Response: ${data.substring(0, 500)}${
            data.length > 500 ? "..." : ""
          }`
        );
        console.log("");
        resolve();
      });
    });

    req.on("error", (err) => {
      console.log(`❌ ${description} (${method} ${path})`);
      console.log(`   Error: ${err.message}`);
      console.log(`   Error Code: ${err.code}`);
      console.log("");
      resolve();
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ Timeout: ${description} (${method} ${path})`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log("🧪 Detailed Backend API Testing...\n");

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.path, endpoint.method, endpoint.description);
  }

  console.log("🎉 Testing completed!");
}

runTests();
