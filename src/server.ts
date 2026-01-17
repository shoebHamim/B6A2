import server from "./app";
import config from "./config";
const { port: serverPort } = config;

server.listen(serverPort, () => {
  console.log(`server running on ${serverPort}`);
});
