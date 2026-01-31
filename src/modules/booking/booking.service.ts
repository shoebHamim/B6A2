import { pool } from "../../config/db";
import { bookingInterface } from "./booking.interfaces";

const createBooking = async (
  bookingParams: bookingInterface,
  totalRent: number,
) => {
  const client = await pool.connect();
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      bookingParams;
    await client.query("BEGIN");
    const result = await client.query(
      `
      INSERT INTO bookings( 
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status)
      VALUES($1,$2,$3,$4,$5,'active')
        RETURNING id, customer_id, vehicle_id, 
           rent_start_date::text, 
           rent_end_date::text, 
           total_price, status
      `,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, totalRent],
    );

    await client.query(
      `UPDATE vehicles 
       SET availability_status = 'booked' 
       WHERE id = $1`,
      [vehicle_id],
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(
      error instanceof Error ? error.message : "Error creating booking on DB!",
    );
  } finally {
    client.release();
  }
};
const getAllBookings = async (userId?: string) => {
  try {
    let result;
    if (userId) {
      result = await pool.query(`SELECT * FROM bookings where customer_id=$1`, [
        userId,
      ]);
    } else {
      result = await pool.query(`SELECT * FROM bookings`);
    }
    return result.rowCount ? result.rows : null;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching bookings from DB!",
    );
  }
};
const updateBookingById = async (bookingId: string, bookingStatus: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE bookings
      SET  status=COALESCE($1)
      WHERE id=$2
      RETURNING id,customer_id,vehicle_id,rent_start_date::TEXT,rent_end_date::TEXT,total_price,status
      `,
      [bookingStatus, bookingId],
    );
    if (!result.rowCount) return {result:null,message:null};
    // update vehicle status in case of returned/cancelled status
    if (bookingStatus === "returned" || bookingStatus === "cancelled") {
      await client.query(
        `UPDATE vehicles 
       SET availability_status = 'available' 
       WHERE id = $1`,
        [result.rows[0].vehicle_id],
      );
    }
    await client.query("COMMIT");

    let message;
    if (bookingStatus === "returned") {
      message = "Booking marked as returned. Vehicle is now available";
      result.rows[0]["vehicle"] = {
        availability_status: "available",
      };
    } else if (bookingStatus === "cancelled") {
      message = "Booking cancelled successfully";
    }

    return { result: result.rows[0], message };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching bookings from DB!",
    );
  } finally {
    client.release();
  }
};
const getActiveBookingsByUserId = async (userId: string) => {
  try {
    const activeBookings = await pool.query(
      `SELECT * FROM bookings
      WHERE status= 'active'
      AND customer_id=$1
      `,
      [userId],
    );
    return activeBookings.rowCount ? activeBookings.rows[0] : null;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching active bookings from DB!",
    );
  }
};
const getBookingById = async (bookingId: string) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings
      WHERE id=$1
      `,
      [bookingId],
    );
    return result.rowCount ? result.rows[0] : null;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching  booking from DB!",
    );
  }
};

const calculateTotalRent = (
  rentStartDate: string,
  rentEndDate: string,
  dailyRent: number,
) => {
  const rentStartDateObj = new Date(rentStartDate);
  const rentEndDateObj = new Date(rentEndDate);
  if (rentStartDateObj > rentEndDateObj) {
    throw new Error("Rent start date must be before rent end date");
  }
  const diffInMs = rentEndDateObj.getTime() - rentStartDateObj.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  const totalPrice = diffInDays * dailyRent;
  return totalPrice;
};

const getActiveBookingsByVehicleId = async (vehicleId: string) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1`,
    [vehicleId],
  );
  return result.rowCount ? result.rows : null;
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBookingById,
  getActiveBookingsByUserId,
  calculateTotalRent,
  getBookingById,
  getActiveBookingsByVehicleId,
};
