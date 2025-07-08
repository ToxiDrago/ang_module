const http = require("http");

console.log("🔐 Testing Login Endpoint...\n");

// Test with the newly created user
const testUser = {
  login: "testuser123",
  psw: "testpass123",
};

console.log("1. Testing Login with testuser123...");
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
          if (response.access_token) {
            console.log(
              `   🔑 Token Preview: ${response.access_token.substring(
                0,
                20
              )}...`
            );
          }
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

// Test with wrong password
setTimeout(() => {
  console.log("\n2. Testing Login with Wrong Password...");
  const wrongUser = {
    login: "testuser123",
    psw: "wrongpassword",
  };
  const wrongData = JSON.stringify(wrongUser);
  const wrongReq = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/users/login",
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
        console.log(`   ✅ Wrong Password Login Status: ${res.statusCode}`);
        if (res.statusCode === 500) {
          console.log("   ✅ Correctly rejected wrong password");
        } else {
          console.log(`   ❌ Unexpected response: ${data}`);
        }
      });
    }
  );

  wrongReq.on("error", (err) => {
    console.log(`   ❌ Wrong Password Login Error: ${err.message}`);
  });

  wrongReq.write(wrongData);
  wrongReq.end();
}, 1000);

console.log("\n🎉 Login Test Complete!");
