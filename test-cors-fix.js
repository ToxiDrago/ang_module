const http = require("http");

console.log("🔧 Testing CORS Fix for localhost:59177\n");

// Тестируем CORS с разными origin
const origins = [
  "http://localhost:4200",
  "http://localhost:59177",
  "http://localhost:3001",
  "http://localhost:8080",
];

async function testCORS(origin) {
  return new Promise((resolve) => {
    console.log(`🔍 Testing CORS for origin: ${origin}`);

    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
        },
      },
      (res) => {
        const corsHeader = res.headers["access-control-allow-origin"];
        const hasCORS =
          corsHeader && (corsHeader === origin || corsHeader === "*");

        console.log(`   Status: ${res.statusCode}`);
        console.log(`   CORS Header: ${corsHeader || "Not found"}`);
        console.log(
          `   ${hasCORS ? "✅" : "❌"} CORS ${hasCORS ? "ALLOWED" : "BLOCKED"}`
        );
        console.log("");

        resolve(hasCORS);
      }
    );

    req.on("error", (err) => {
      console.log(`   ❌ Error: ${err.message}`);
      console.log("");
      resolve(false);
    });

    req.write(JSON.stringify({ login: "test", password: "test" }));
    req.end();
  });
}

async function runCORSFixTest() {
  console.log("🧪 CORS Fix Test Results:\n");

  const results = {};

  for (const origin of origins) {
    results[origin] = await testCORS(origin);
  }

  console.log("📊 Summary:");
  console.log("===========");

  for (const [origin, allowed] of Object.entries(results)) {
    console.log(`${origin}: ${allowed ? "✅ ALLOWED" : "❌ BLOCKED"}`);
  }

  const allAllowed = Object.values(results).every((result) => result);

  if (allAllowed) {
    console.log("\n🎉 CORS is now working for all localhost ports!");
    console.log("✅ Frontend should be able to communicate with backend");
  } else {
    console.log("\n⚠️  Some origins are still blocked");
    console.log("Check the CORS configuration");
  }

  console.log("\n💡 Try refreshing your frontend page now");
}

runCORSFixTest();
