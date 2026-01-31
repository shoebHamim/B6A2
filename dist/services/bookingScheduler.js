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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../config/db");
const startBookingScheduler = () => __awaiter(void 0, void 0, void 0, function* () {
    // cronjob will run every hour on 0 minute
    node_cron_1.default.schedule("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield db_1.pool.connect();
        try {
            yield client.query("BEGIN");
            const result = yield client.query(`
        UPDATE bookings
        SET status = 'returned'
        WHERE status = 'active' 
          AND rent_end_date < CURRENT_DATE
        RETURNING vehicle_id
      `);
            if (result.rowCount && result.rows.length > 0) {
                const vehicleIds = result.rows.map((row) => row.vehicle_id);
                yield client.query(`
          UPDATE vehicles
          SET availability_status = 'available'
          WHERE id = ANY($1)
        `, [vehicleIds]);
                console.log(`Auto-returned ${result.rowCount} expired bookings`);
            }
            else {
                console.log(`No expired bookings to return`);
            }
            yield client.query("COMMIT");
        }
        catch (error) {
            yield client.query("ROLLBACK");
            console.error("Booking scheduler error:", error);
        }
        finally {
            client.release();
        }
    }), {
        timezone: "Asia/Dhaka",
    });
});
exports.default = startBookingScheduler;
