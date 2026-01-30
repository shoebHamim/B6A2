import { pool } from "../../config/db";
import { bookingInterface } from "./booking.interfaces";

const createBooking = async (
  bookingParams: bookingInterface,
  dailyRent: number,
) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      bookingParams;
    // calculate total price
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    console.log({diffInDays});
    console.log({dailyRent});
    const totalPrice = diffInDays * dailyRent;
    const result = await pool.query(
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
      [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice],
    );
    console.log(result.rows);

    return result.rows[0];
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error creating booking on DB!",
    );
  }
};
const getAllBookings = async () => {
  try {
    const result = await pool.query(`SELECT * FROM bookings`);
    return result.rowCount ? result.rows : null;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching vehicles from DB!",
    );
  }
};
const updateBookingById = async (
  bookingId: string,
  bookingStatus:string,
) => {
  try {

    const result = await pool.query(
      `UPDATE bookings
      SET  status=COALESCE($1)
      WHERE id=$2
      RETURNING *
      `,
      [
        bookingStatus,
        bookingId
      ],
    );
    return result.rowCount ? result.rows[0] : null;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching vehicles from DB!",
    );
  }
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBookingById
};
