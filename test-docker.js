const http = require("http");

console.log("🧪 Testing Docker Stack...\n");

// Test Frontend
console.log("1. Testing Frontend (http://localhost:80)...");
const frontendReq = http.request(
  {
    hostname: "localhost",
    port: 80,
    path: "/",
    method: "GET",
  },
  (res) => {
    console.log(`   ✅ Frontend Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log("   ✅ Frontend is accessible");
    }
  }
);

frontendReq.on("error", (err) => {
  console.log(`   ❌ Frontend Error: ${err.message}`);
});

frontendReq.end();

// Test Backend
console.log("\n2. Testing Backend (http://localhost:3000)...");

// Test backend health
const backendHealthReq = http.request(
  {
    hostname: "localhost",
    port: 3000,
    path: "/api/health",
    method: "GET",
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log(`   ✅ Backend Health Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log("   ✅ Backend health endpoint working");
        try {
          const response = JSON.parse(data);
          console.log(`   📄 Response: ${JSON.stringify(response)}`);
        } catch (e) {
          console.log(`   📄 Raw Response: ${data}`);
        }
      }
    });
  }
);

backendHealthReq.on("error", (err) => {
  console.log(`   ❌ Backend Health Error: ${err.message}`);
});

backendHealthReq.end();

// Test backend users endpoint
setTimeout(() => {
  const backendUsersReq = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/users",
      method: "GET",
    },
    (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(`   ✅ Backend Users Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log("   ✅ Backend users endpoint working");
          try {
            const response = JSON.parse(data);
            console.log(`   📄 Users: ${JSON.stringify(response)}`);
          } catch (e) {
            console.log(`   📄 Raw Response: ${data}`);
          }
        }
      });
    }
  );

  backendUsersReq.on("error", (err) => {
    console.log(`   ❌ Backend Users Error: ${err.message}`);
  });

  backendUsersReq.end();
}, 1000);

// Test MongoDB connection
console.log("\n3. Testing MongoDB connection...");
const mongoReq = http.request(
  {
    hostname: "localhost",
    port: 27017,
    method: "GET",
  },
  (res) => {
    console.log(`   ✅ MongoDB Status: ${res.statusCode}`);
  }
);

mongoReq.on("error", (err) => {
  if (err.code === "ECONNREFUSED") {
    console.log("   ❌ MongoDB connection refused (expected for direct HTTP)");
  } else {
    console.log(`   ❌ MongoDB Error: ${err.message}`);
  }
});

mongoReq.end();

console.log("\n🎉 Docker Stack Test Complete!");
console.log("\n📋 Summary:");
console.log("   • Frontend: http://localhost:80");
console.log("   • Backend: http://localhost:3000");
console.log("   • MongoDB: localhost:27017");
console.log("\n🌐 You can now open your browser and go to:");
console.log("   http://localhost");
console.log("\n🔧 To stop the stack: docker-compose down");
console.log("🔧 To view logs: docker-compose logs");
