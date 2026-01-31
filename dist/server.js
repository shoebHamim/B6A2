"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const bookingScheduler_1 = __importDefault(require("./services/bookingScheduler"));
const { port: serverPort } = config_1.default;
app_1.default.listen(serverPort, () => {
    console.log(`server running on ${serverPort}`);
    (0, bookingScheduler_1.default)();
});
