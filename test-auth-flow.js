const http = require("http");

console.log("🧪 Testing Authentication Flow...\n");

const testUser = {
  login: "alex123",
  psw: "password123",
};

// Test 1: Register new user
console.log("1. Testing User Registration...");
const registerData = JSON.stringify(testUser);
const registerReq = http.request(
  {
    hostname: "localhost",
    port: 3000,
    path: "/users",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(registerData),
    },
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log(`   ✅ Registration Status: ${res.statusCode}`);
      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log("   ✅ User registered successfully");
        try {
          const response = JSON.parse(data);
          console.log(`   📄 User ID: ${response.id || response._id}`);
        } catch (e) {
          console.log(`   📄 Response: ${data}`);
        }

        // Test 2: Try to authenticate
        setTimeout(() => {
          console.log("\n2. Testing User Authentication...");
          const authData = JSON.stringify(testUser);
          const authReq = http.request(
            {
              hostname: "localhost",
              port: 3000,
              path: `/users/${testUser.login}`,
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(authData),
              },
            },
            (authRes) => {
              let authResponseData = "";
              authRes.on("data", (chunk) => {
                authResponseData += chunk;
              });
              authRes.on("end", () => {
                console.log(
                  `   ✅ Authentication Status: ${authRes.statusCode}`
                );
                if (authRes.statusCode === 200) {
                  console.log("   ✅ User authenticated successfully");
                  console.log(`   📄 Response: ${authResponseData}`);
                } else {
                  console.log(
                    `   ❌ Authentication failed: ${authResponseData}`
                  );
                }
              });
            }
          );

          authReq.on("error", (err) => {
            console.log(`   ❌ Authentication Error: ${err.message}`);
          });

          authReq.write(authData);
          authReq.end();
        }, 1000);
      } else {
        console.log(`   ❌ Registration failed: ${data}`);
      }
    });
  }
);

registerReq.on("error", (err) => {
  console.log(`   ❌ Registration Error: ${err.message}`);
});

registerReq.write(registerData);
registerReq.end();

// Test 3: Try to register the same user again (should fail)
setTimeout(() => {
  console.log("\n3. Testing Duplicate Registration (should fail)...");
  const duplicateData = JSON.stringify(testUser);
  const duplicateReq = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/users",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(duplicateData),
      },
    },
    (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(`   ✅ Duplicate Registration Status: ${res.statusCode}`);
        if (res.statusCode === 400 || res.statusCode === 409) {
          console.log("   ✅ Correctly rejected duplicate user");
        } else {
          console.log(`   ❌ Unexpected response: ${data}`);
        }
      });
    }
  );

  duplicateReq.on("error", (err) => {
    console.log(`   ❌ Duplicate Registration Error: ${err.message}`);
  });

  duplicateReq.write(duplicateData);
  duplicateReq.end();
}, 3000);

console.log("\n🎉 Authentication Flow Test Complete!");
console.log("\n📋 Summary:");
console.log("   • Registration: POST /users");
console.log("   • Authentication: POST /users/:login");
console.log("   • Login: POST /users/login");
