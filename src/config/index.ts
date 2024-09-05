import dotenv from "dotenv";

dotenv.config();

export default {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  PORT: process.env.PORT,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
};
