import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.join(process.cwd(), ".env.local"),
});
const config = {
  port: process.env.PORT||3000,
};

export default config;
