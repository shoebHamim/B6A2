import app from "./app";
import config from "./config";
const { port: serverPort } = config;

app.listen(serverPort, () => {
  console.log(`server running on ${serverPort}`);
});
