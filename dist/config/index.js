"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
dotenv_1.default.config({
    path: node_path_1.default.join(process.cwd(), ".env.local"),
});
const config = {
    port: process.env.PORT || 3000,
    postgresConnectionStr: process.env.CONNECTION_STR,
    saltRound: process.env.SALT_ROUND,
    json_secret: process.env.JSON_SECRET,
};
exports.default = config;
