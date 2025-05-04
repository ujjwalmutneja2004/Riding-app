const axios = require("axios");

axios.get("https://api.tomtom.com/")
  .then((res) => console.log("✅ Response:", res.status))
  .catch((err) => console.error("❌ ERROR:", err));