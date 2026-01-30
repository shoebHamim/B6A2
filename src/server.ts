import app from "./app";
import config from "./config";
import startBookingScheduler from "./services/bookingScheduler";
const { port: serverPort } = config;

app.listen(serverPort, () => {
  console.log(`server running on ${serverPort}`);
  startBookingScheduler();
});
