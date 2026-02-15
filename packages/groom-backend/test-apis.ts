import axios from "axios";

const BASE_URL = "http://localhost:3002/api";
const EMAIL = `test-${Date.now()}@test.com`;
const PASSWORD = "Password123";

async function runTests() {
  console.log("🚀 Starting API tests...");

  // 1. Health Check
  try {
    const health = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health Check:", health.data);
  } catch (error: any) {
    console.error("❌ Health Check Failed:", error.message);
    process.exit(1);
  }

  // 2. Register User
  let cookie = "";
  let userId = "";
  try {
    const register = await axios.post(`${BASE_URL}/auth/register`, {
      email: EMAIL,
      password: PASSWORD,
      name: "Test User",
    });
    console.log("✅ Register User:", register.data.user.email);
    userId = register.data.user.id;
    // Extract cookie
    const setCookie = register.headers["set-cookie"];
    if (setCookie) {
      cookie = setCookie[0].split(";")[0];
      console.log("🍪 Cookie obtained:", cookie);
    }
  } catch (error: any) {
    console.error("❌ Register Failed:", error.response?.data || error.message);
    // Try login if conflict
    if (error.response?.status === 409) {
        console.log("User already exists, trying login...");
        try {
            const login = await axios.post(`${BASE_URL}/auth/login`, {
                email: EMAIL,
                password: PASSWORD
            });
            console.log("✅ Login Success:", login.data.user.email);
            userId = login.data.user.id;
            const setCookie = login.headers["set-cookie"];
            if (setCookie) {
                cookie = setCookie[0].split(";")[0];
                console.log("🍪 Cookie obtained:", cookie);
            }
        } catch (loginError: any) {
            console.error("❌ Login Failed:", loginError.response?.data || loginError.message);
            process.exit(1);
        }
    } else {
        process.exit(1);
    }
  }

  const headers = { Cookie: cookie };

  // 3. Get Profile (Auth Check)
  try {
    const me = await axios.get(`${BASE_URL}/user/profile`, { headers });
    console.log("✅ Auth Me (User Profile):", me.data.user.email);
  } catch (error: any) {
    console.error("❌ Auth Me Failed:", error.response?.data || error.message);
  }

  // 4. Create Booking
  try {
    const booking = await axios.post(
      `${BASE_URL}/bookings`,
      {
        when: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        reason: "Test Booking",
        userId: userId, // associate with user
        email: EMAIL,
        name: "Test User",
      },
      { headers } // usually requires auth or at least user ID depending on implementation
    );
    console.log("✅ Create Booking:", booking.data.id);
  } catch (error: any) {
    console.error("❌ Create Booking Failed:", error.response?.data || error.message);
  }

  // 5. List Bookings
  try {
    const bookings = await axios.get(`${BASE_URL}/bookings`, { headers });
    console.log("✅ List Bookings:", bookings.data.length, "found");
  } catch (error: any) {
    console.error("❌ List Bookings Failed:", error.response?.data || error.message);
  }

  // 6. Testimonials (Public)
  try {
    const testimonials = await axios.get(`${BASE_URL}/testimonials`);
    console.log("✅ List Testimonials:", testimonials.data.length, "found");
  } catch (error: any) {
    console.error("❌ List Testimonials Failed:", error.response?.data || error.message);
  }

  console.log("✨ All tests completed!");
}

runTests();
