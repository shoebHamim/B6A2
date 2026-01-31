import cron from "node-cron";
import { pool } from "../config/db";

const startBookingScheduler = async () => {
  // cronjob will at everyday at midnight
  cron.schedule(
    "0 0 * * *",
    async () => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query(`
        UPDATE bookings
        SET status = 'returned'
        WHERE status = 'active' 
          AND rent_end_date < CURRENT_DATE
        RETURNING vehicle_id
      `);
        if (result.rowCount && result.rows.length > 0) {
          const vehicleIds = result.rows.map((row) => row.vehicle_id);
          await client.query(
            `
          UPDATE vehicles
          SET availability_status = 'available'
          WHERE id = ANY($1)
        `,
            [vehicleIds],
          );
          console.log(`Auto-returned ${result.rowCount} expired bookings`);
        } else {
          console.log(`No expired bookings to return`);
        }
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Booking scheduler error:", error);
      } finally {
        client.release();
      }
    },
    {
      timezone: "Asia/Dhaka",
    },
  );
};
export default startBookingScheduler;
