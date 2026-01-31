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
exports.userServices = void 0;
const db_1 = require("../../config/db");
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`SELECT id,name,email,phone,role  FROM  users`);
        if (result.rowCount !== 0) {
            return result.rows;
        }
        return null;
    }
    catch (error) {
        return error instanceof Error
            ? error.message
            : new Error("Failed to retrieve users from DB!");
    }
});
const updateUser = (userParams, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, role } = userParams;
        const result = yield db_1.pool.query(`UPDATE users
    SET name = COALESCE($1,name),
    email = COALESCE($2,email),
    phone = COALESCE($3,phone),
    role = COALESCE($4,role)
    WHERE id=$5
    RETURNING name,email,phone,role
    `, [name, email, phone, role, userId]);
        if (result.rowCount !== 0) {
            return result.rows[0];
        }
        return null;
    }
    catch (error) {
        return error instanceof Error
            ? error.message
            : new Error("Failed to update user on DB!");
    }
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`DELETE FROM  users WHERE id=$1`, [userId]);
        if (result.rowCount !== 0) {
            return true;
        }
        return null;
    }
    catch (error) {
        return error instanceof Error
            ? error.message
            : new Error("Failed to delete user in DB!");
    }
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`SELECT id,name,email,phone,role  FROM  users WHERE id=$1`, [id]);
        if (result.rowCount !== 0) {
            return result.rows[0];
        }
        return null;
    }
    catch (error) {
        return error instanceof Error
            ? error.message
            : new Error("Failed to delete user in DB!");
    }
});
exports.userServices = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUserById,
};
