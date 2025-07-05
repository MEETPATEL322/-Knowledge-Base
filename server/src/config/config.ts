import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/mydb",
  admin_email: process.env.ADMIN_EMAIL || "admin@yopmail.com",
  admin_password: process.env.ADMIN_PASSWORD || "admin@123",
  jwt_secrete: process.env.JWT_SECRET || "knowledgesecrete",
  jwt_exp_time: process.env.JWT_EXPIRES_IN || "1h",
  ai_key: process.env.GROK_KEY,
  ai_url: process.env.API_URL,
};
