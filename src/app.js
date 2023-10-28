import { createServer } from "http";
import Consul from "consul";
import portfinder from "portfinder";
import { nanoid } from "nanoid";

const serviceType = process.argv[2];
const { pid } = process;

async function main() {
  const consulClient = new Consul();

  // ① Discover a free port in the system and generate a unique service ID
  const port = await portfinder.getPortPromise();
  const address = process.env.ADDRESS || "localhost";
  const serviceId = nanoid();

  // ② Register a new service in the Consul registry
  function registerService() {
    consulClient.agent.service.register(
      {
        id: serviceId,
        name: serviceType,
        address,
        port,
        tags: [serviceType],
      },
      () => {
        console.log(`${serviceType} registered successfully`);
      }
    );
  }

  // ③ Define a function to unregister the service from Consul
  function unregisterService(err) {
    err && console.error(err);
    console.log(`deregistering ${serviceId}`);
    consulClient.agent.service.deregister(serviceId, () => {
      process.exit(err ? 1 : 0);
    });
  }

  // ④ Attach the unregisterService function to various process events for cleanup
  process.on("exit", unregisterService);
  process.on("uncaughtException", unregisterService);
  process.on("SIGINT", unregisterService);

  // ⑤ Start the HTTP server and handle incoming requests
  const server = createServer((req, res) => {
    let i = 1e7;
    while (i > 0) {
      i--;
    }
    console.log(`Handling request from ${pid}`);
    res.end(`${serviceType} response from ${pid}\n`);
  });

  server.listen(port, address, () => {
    registerService();
    console.log(`Started ${serviceType} at ${pid} on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
