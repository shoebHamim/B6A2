"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingServices = void 0;
const db_1 = require("../../config/db");
const createBooking = (bookingParams, totalRent) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.pool.connect();
    try {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = bookingParams;
        yield client.query("BEGIN");
        const result = yield client.query(`
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
      `, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalRent]);
        yield client.query(`UPDATE vehicles 
       SET availability_status = 'booked' 
       WHERE id = $1`, [vehicle_id]);
        yield client.query("COMMIT");
        return result.rows[0];
    }
    catch (error) {
        yield client.query("ROLLBACK");
        throw new Error(error instanceof Error ? error.message : "Error creating booking on DB!");
    }
    finally {
        client.release();
    }
});
const getAllBookings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result;
        if (userId) {
            result = yield db_1.pool.query(`SELECT * FROM bookings where customer_id=$1`, [
                userId,
            ]);
        }
        else {
            result = yield db_1.pool.query(`SELECT * FROM bookings`);
        }
        return result.rowCount ? result.rows : null;
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Error fetching bookings from DB!");
    }
});
const updateBookingById = (bookingId, bookingStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.pool.connect();
    try {
        yield client.query("BEGIN");
        const result = yield client.query(`UPDATE bookings
      SET  status=COALESCE($1)
      WHERE id=$2
      RETURNING id,customer_id,vehicle_id,rent_start_date::TEXT,rent_end_date::TEXT,total_price,status
      `, [bookingStatus, bookingId]);
        if (!result.rowCount)
            return null;
        if (bookingStatus === "returned" || bookingStatus === "cancelled") {
            yield client.query(`UPDATE vehicles 
       SET availability_status = 'available' 
       WHERE id = $1`, [result.rows[0].vehicle_id]);
            result.rows[0]["vehicle"] = {
                availability_status: "available",
            };
        }
        yield client.query("COMMIT");
        return result.rows[0];
    }
    catch (error) {
        yield client.query("ROLLBACK");
        throw new Error(error instanceof Error
            ? error.message
            : "Error fetching bookings from DB!");
    }
    finally {
        client.release();
    }
});
const getActiveBookingsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activeBookings = yield db_1.pool.query(`SELECT * FROM bookings
      WHERE status= 'active'
      AND customer_id=$1
      `, [userId]);
        return activeBookings.rowCount ? activeBookings.rows[0] : null;
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Error fetching active bookings from DB!");
    }
});
const getBookingById = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`SELECT * FROM bookings
      WHERE id=$1
      `, [bookingId]);
        return result.rowCount ? result.rows[0] : null;
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Error fetching  booking from DB!");
    }
});
const calculateTotalRent = (rentStartDate, rentEndDate, dailyRent) => {
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
const getActiveBookingsByVehicleId = (vehicleId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1`, [vehicleId]);
    return result.rowCount ? result.rows : null;
});
exports.bookingServices = {
    createBooking,
    getAllBookings,
    updateBookingById,
    getActiveBookingsByUserId,
    calculateTotalRent,
    getBookingById,
    getActiveBookingsByVehicleId,
};
