const http = require("http");

console.log("🧪 Testing Authentication with Existing User...\n");

const testUser = {
  login: "alex123",
  psw: "password123",
};

// Test 1: Try to authenticate with existing user
console.log("1. Testing Authentication with Existing User...");
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
  (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log(`   ✅ Authentication Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log("   ✅ User authenticated successfully");
        console.log(`   📄 Response: ${data}`);
      } else {
        console.log(`   ❌ Authentication failed: ${data}`);
      }
    });
  }
);

authReq.on("error", (err) => {
  console.log(`   ❌ Authentication Error: ${err.message}`);
});

authReq.write(authData);
authReq.end();

// Test 2: Try login endpoint
setTimeout(() => {
  console.log("\n2. Testing Login Endpoint...");
  const loginData = JSON.stringify(testUser);
  const loginReq = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/users/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(loginData),
      },
    },
    (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(`   ✅ Login Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log("   ✅ Login successful");
          try {
            const response = JSON.parse(data);
            console.log(
              `   📄 Access Token: ${
                response.access_token ? "Present" : "Missing"
              }`
            );
            console.log(
              `   📄 Refresh Token: ${
                response.refresh_token ? "Present" : "Missing"
              }`
            );
          } catch (e) {
            console.log(`   📄 Response: ${data}`);
          }
        } else {
          console.log(`   ❌ Login failed: ${data}`);
        }
      });
    }
  );

  loginReq.on("error", (err) => {
    console.log(`   ❌ Login Error: ${err.message}`);
  });

  loginReq.write(loginData);
  loginReq.end();
}, 1000);

// Test 3: Try with wrong password
setTimeout(() => {
  console.log("\n3. Testing with Wrong Password...");
  const wrongUser = {
    login: "alex123",
    psw: "wrongpassword",
  };
  const wrongData = JSON.stringify(wrongUser);
  const wrongReq = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: `/users/${wrongUser.login}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(wrongData),
      },
    },
    (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(`   ✅ Wrong Password Status: ${res.statusCode}`);
        if (res.statusCode === 500) {
          console.log("   ✅ Correctly rejected wrong password");
        } else {
          console.log(`   ❌ Unexpected response: ${data}`);
        }
      });
    }
  );

  wrongReq.on("error", (err) => {
    console.log(`   ❌ Wrong Password Error: ${err.message}`);
  });

  wrongReq.write(wrongData);
  wrongReq.end();
}, 2000);

console.log("\n🎉 Authentication Test Complete!");
