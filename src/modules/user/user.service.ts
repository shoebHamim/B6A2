import { pool } from "../../config/db";
import { userInterface } from "../auth/auth.interfaces";

const getAllUsers = async () => {
  try {
    const result = await pool.query(`SELECT *  FROM  users`);
    if (result.rowCount !== 0) {
      return result.rows;
    }
    return null;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : new Error("Failed to retrieve users from DB!");
  }
};
const updateUser = async (userParams: Partial<userInterface>, id: string) => {
  try {
    const { name, email, phone, role } = userParams;
    const result = await pool.query(
      `UPDATE users
    SET name = COALESCE($1,name),
    email = COALESCE($2,email),
    phone = COALESCE($3,phone),
    role = COALESCE($4,role)
    WHERE id=$5
    RETURNING name,email,phone,role
    `,
      [name, email, phone, role, id],
    );
    if (result.rowCount !== 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : new Error("Failed to update user on DB!");
  }
};
const deleteUser = async (id:string) => {
  try {
    const result = await pool.query(`DELETE FROM  users WHERE id=$1`,[id]);
    if (result.rowCount!==0) {
      return true;
    }
    return null;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : new Error("Failed to delete user in DB!");
  }
};
const getUserById = async (id:string) => {
  try {
    const result = await pool.query(`SELECT id,name,email,phone,role  FROM  users WHERE id=$1`,[id]);
    if (result.rowCount !== 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : new Error("Failed to delete user in DB!");
  }
};
export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById
};
