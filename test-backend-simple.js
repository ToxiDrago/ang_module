const http = require("http");

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
        console.log(
          `   Response: ${data.substring(0, 200)}${
            data.length > 200 ? "..." : ""
          }`
        );
        console.log("");
        resolve();
      });
    });

    req.on("error", (err) => {
      console.log(`❌ ${description} (${method} ${path})`);
      console.log(`   Error: ${err.message}`);
      console.log("");
      resolve();
    });

    req.setTimeout(3000, () => {
      console.log(`⏰ Timeout: ${description} (${method} ${path})`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runSimpleTests() {
  console.log("🧪 Simple Backend Testing...\n");

  const endpoints = [
    { path: "/", method: "GET", description: "Root endpoint" },
    {
      path: "/auth/register",
      method: "POST",
      description: "Auth register endpoint",
    },
    { path: "/auth/login", method: "POST", description: "Auth login endpoint" },
    { path: "/users", method: "GET", description: "Users endpoint" },
    { path: "/tours", method: "GET", description: "Tours endpoint" },
    { path: "/orders", method: "GET", description: "Orders endpoint" },
  ];

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.path, endpoint.method, endpoint.description);
  }

  console.log("🎉 Simple testing completed!");
}

runSimpleTests();
