require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();

// CRITICAL FOR VERCEL: Export the app instance
module.exports = app;

// Keep your local port listener active for local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
