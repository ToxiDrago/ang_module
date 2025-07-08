const http = require("http");

console.log("🔍 Checking Database Contents...\n");

// Test 1: Get all users (if endpoint exists)
console.log("1. Checking if we can get all users...");
const getAllReq = http.request(
  {
    hostname: "localhost",
    port: 3000,
    path: "/users",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log(`   ✅ Get Users Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        try {
          const users = JSON.parse(data);
          console.log(`   📄 Found ${users.length} users in database`);
          users.forEach((user, index) => {
            console.log(`   👤 User ${index + 1}:`);
            console.log(`      ID: ${user.id || user._id}`);
            console.log(`      Login: ${user.login}`);
            console.log(`      Password: ${user.psw ? "***" : "missing"}`);
            console.log(`      Email: ${user.email || "not set"}`);
            console.log(`      Card: ${user.cardNumber || "not set"}`);
          });
        } catch (e) {
          console.log(`   📄 Raw Response: ${data}`);
        }
      } else {
        console.log(`   ❌ Failed to get users: ${data}`);
      }
    });
  }
);

getAllReq.on("error", (err) => {
  console.log(`   ❌ Get Users Error: ${err.message}`);
});

getAllReq.end();

// Test 2: Try to register a new user with different credentials
setTimeout(() => {
  console.log("\n2. Testing registration with new user...");
  const newUser = {
    login: "testuser123",
    psw: "testpass123",
    email: "test@example.com",
    cardNumber: "1234567890",
  };

  const registerData = JSON.stringify(newUser);
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
        console.log(`   ✅ New User Registration Status: ${res.statusCode}`);
        if (res.statusCode === 201 || res.statusCode === 200) {
          console.log("   ✅ New user registered successfully");
          try {
            const response = JSON.parse(data);
            console.log(`   📄 New User ID: ${response.id || response._id}`);
            console.log(`   📄 New User Login: ${response.login}`);
          } catch (e) {
            console.log(`   📄 Response: ${data}`);
          }

          // Test 3: Try to authenticate with new user
          setTimeout(() => {
            console.log("\n3. Testing authentication with new user...");
            const authData = JSON.stringify(newUser);
            const authReq = http.request(
              {
                hostname: "localhost",
                port: 3000,
                path: `/users/${newUser.login}`,
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
                    `   ✅ New User Auth Status: ${authRes.statusCode}`
                  );
                  if (authRes.statusCode === 200) {
                    console.log("   ✅ New user authenticated successfully");
                    console.log(`   📄 Response: ${authResponseData}`);
                  } else {
                    console.log(
                      `   ❌ New user auth failed: ${authResponseData}`
                    );
                  }
                });
              }
            );

            authReq.on("error", (err) => {
              console.log(`   ❌ New User Auth Error: ${err.message}`);
            });

            authReq.write(authData);
            authReq.end();
          }, 1000);
        } else {
          console.log(`   ❌ New user registration failed: ${data}`);
        }
      });
    }
  );

  registerReq.on("error", (err) => {
    console.log(`   ❌ New User Registration Error: ${err.message}`);
  });

  registerReq.write(registerData);
  registerReq.end();
}, 1000);

console.log("\n🎉 Database Check Complete!");
