import { Pool } from "pg";
import config from "./index";
import userTablesCreateQuery from "../models/user";
import vehicleTablesCreateQuery from "../models/vehicle";
import bookingsTableCreateQuery from "../models/booking";

export const pool = new Pool({
  connectionString: config.postgresConnectionStr,
});

const initDB = async () => {
  await pool.query(userTablesCreateQuery);
  await pool.query(vehicleTablesCreateQuery);
  await pool.query(bookingsTableCreateQuery);
};

export default initDB;
