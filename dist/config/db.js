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
exports.pool = void 0;
const pg_1 = require("pg");
const index_1 = __importDefault(require("./index"));
const user_1 = __importDefault(require("../models/user"));
const vehicle_1 = __importDefault(require("../models/vehicle"));
const booking_1 = __importDefault(require("../models/booking"));
exports.pool = new pg_1.Pool({
    connectionString: index_1.default.postgresConnectionStr,
    options: "-c timezone=Asia/Dhaka",
});
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.pool.query(user_1.default);
    yield exports.pool.query(vehicle_1.default);
    yield exports.pool.query(booking_1.default);
});
exports.default = initDB;
