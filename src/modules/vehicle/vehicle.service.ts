import { pool } from "../../config/db";
import { vehicleInterface } from "./vehicle.interfaces";

const getAllVehicles = async () => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result.rowCount ? result.rows : null;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching vehicles from DB!",
    );
  }
};
const getVehicleById = async (vehicleId: string) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles where id=$1`, [
      vehicleId,
    ]);
    return result.rowCount ? result.rows[0] : null;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching vehicles from DB!",
    );
  }
};

const createNewVehicle = async (vehicleParams: vehicleInterface) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = vehicleParams;
    const result = await pool.query(
      `
      INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ],
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching vehicles from DB!",
    );
  }
};

const updateVehicleById = async (
  vehicleId: string,
  vehicleParams: Partial<vehicleInterface>,
) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = vehicleParams;

    const result = await pool.query(
      `
      UPDATE vehicles
      SET vehicle_name =COALESCE($1,vehicle_name),
      type= COALESCE($2,type),
      registration_number =COALESCE($3, registration_number),
      daily_rent_price =COALESCE($4, daily_rent_price),
      availability_status= COALESCE($5,availability_status)
      WHERE id=$6
      RETURNING *
      `,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        vehicleId,
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

const deleteVehicleById = async (vehicleId: string) => {
  try {
    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [
      vehicleId,
    ]);
    console.log(result);
    return result.rowCount ? true : null;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error fetching vehicles from DB!",
    );
  }
};

export const vehicleService = {
  getAllVehicles,
  createNewVehicle,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
