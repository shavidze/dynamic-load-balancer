import { createServer } from "http";
import httpProxy from "http-proxy";
import Consul from "consul";

// ① Define the load balancer routes
const routing = [
  {
    path: "/api",
    service: "api-service",
    index: 0,
  },
  {
    path: "/",
    service: "webapp-service",
    index: 0,
  },
];

// ② Instantiate a Consul client to access the service registry
const consulClient = new Consul();

// Instantiate an http-proxy server to forward requests
const proxy = httpProxy.createProxyServer();

const server = createServer(async (req, res) => {
  // ③ Match the incoming request URL against the routing table
  const route = routing.find((route) => req.url.startsWith(route.path));
  // ④ Retrieve the list of servers implementing the required service from Consul
  try {
    const serviseList = await consulClient.agent.service.list();
    const instances = Object.values(serviseList).filter((service) =>
      service.Tags.includes(route.service)
    );
    if (!instances.length) {
      res.writeHead(502);
      return res.end("Bad gateway");
    }
    // ⑤ Route the request to its destination using a round-robin approach: 1, 0, 1, 0, 1, 0...
    route.index = (route.index + 1) % instances.length;
    const instance = instances[route.index];
    const target = `http://${instance.Address}:${instance.Port}`;
    proxy.web(req, res, { target });
  } catch (error) {
    // If there's an error or no servers are found, return a "Bad gateway" error
    console.error("Error fetching services", error);
    res.writeHead(502);
    return res.end("Bad gateway");
  }
});

// Start the load balancer on port 8080
server.listen(8080, () => console.log("Load balancer started on port 8080"));
