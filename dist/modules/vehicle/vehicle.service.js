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
exports.vehicleService = void 0;
const db_1 = require("../../config/db");
const getAllVehicles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`SELECT * FROM vehicles`);
        return result.rowCount ? result.rows : null;
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Error fetching vehicles from DB!");
    }
});
const getVehicleById = (vehicleId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`SELECT * FROM vehicles where id=$1`, [
            vehicleId,
        ]);
        return result.rowCount ? result.rows[0] : null;
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Error fetching vehicles from DB!");
    }
});
const createNewVehicle = (vehicleParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status, } = vehicleParams;
        const result = yield db_1.pool.query(`
      INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *
      `, [
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status,
        ]);
        return result.rows[0];
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Error fetching vehicles from DB!");
    }
});
const updateVehicleById = (vehicleId, vehicleParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status, } = vehicleParams;
        const result = yield db_1.pool.query(`
      UPDATE vehicles
      SET vehicle_name =COALESCE($1,vehicle_name),
      type= COALESCE($2,type),
      registration_number =COALESCE($3, registration_number),
      daily_rent_price =COALESCE($4, daily_rent_price),
      availability_status= COALESCE($5,availability_status)
      WHERE id=$6
      RETURNING *
      `, [
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status,
            vehicleId,
        ]);
        return result.rowCount ? result.rows[0] : null;
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Error fetching vehicles from DB!");
    }
});
const deleteVehicleById = (vehicleId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`DELETE FROM vehicles WHERE id=$1`, [
            vehicleId,
        ]);
        console.log(result);
        return result.rowCount ? true : null;
    }
    catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : "Error fetching vehicles from DB!");
    }
});
const validateVehicleAvailability = (vehicleStatus) => {
    if (!vehicleStatus) {
        throw new Error("No Vehicle found to book!");
    }
    if (vehicleStatus !== "available") {
        throw new Error("Vehicle is not available to book!");
    }
};
exports.vehicleService = {
    getAllVehicles,
    createNewVehicle,
    getVehicleById,
    updateVehicleById,
    deleteVehicleById,
    validateVehicleAvailability,
};
