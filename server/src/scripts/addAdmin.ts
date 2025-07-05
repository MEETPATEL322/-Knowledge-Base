import mongoose from "mongoose";
import { config } from "../config/config";
import UserModel from "../models/UserModel";
import { UserRole } from "../enums";
import bcrypt from "bcrypt";

const MONGO_URI = config.mongoURI;
const ADMIN_EMAIL = config.admin_email || "admin@example.com";
const ADMIN_PASSWORD = config.admin_password || "admin123";

const SALT_ROUNDS = 10;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL })
      .lean()
      .exec();

    if (existingAdmin) {
      console.log("Admin user already exists:", ADMIN_EMAIL);
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

      const adminUser = new UserModel({
        name: "Admin User",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: UserRole.Admin,
      });

      await adminUser.save();
      console.log(`Admin user created with email: ${ADMIN_EMAIL}`);
    }
  } catch (error: unknown) {
    process.exit(1);
  }
};

createAdmin();
