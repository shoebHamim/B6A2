import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.join(process.cwd(), ".env.local"),
});
const config = {
  port: process.env.PORT || 3000,
  postgresConnectionStr: process.env.CONNECTION_STR,
  saltRound: process.env.SALT_ROUND,
  json_secret: process.env.JSON_SECRET,
};

export default config;
