## package.json scripts

```json
"scripts": {
  "start": "echo \"Error: no test specified\" && exit 1", // Placeholder script that prints an error message.
  "start:consul": "consul agent -dev", // Start Consul agent in development mode.
  "start:apps": "forever start -f --killSignal=SIGINT app.js api-service && forever start -f --killSignal=SIGINT app.js api-service && forever start -f --killSignal=SIGINT app.js webapp-service", // Start three instances of the application using 'forever'.
  "start:loadBalancer": "forever start -f --killSignal=SIGINT loadBalancer.js", // Start the load balancer script using 'forever'.
  "stop": "forever stopall", // Stop all processes started with 'forever'.
  "benchmark": "autocannon -c 200 -d 10 http://localhost:8080" // Benchmark the application using 'autocannon'.
}
```