# Lesson 19 — Application Servers and Reverse Proxies

**Course:** System Design — From the Ground Up  
**Module 4 — Core Architecture Components**

## Lesson Overview

An application server runs application logic. A reverse proxy sits in front of backend services and receives requests on their behalf, often handling routing, TLS, and other cross-cutting tasks.

## Application Server Responsibilities

An application server executes business logic, validates requests, accesses data stores, and constructs responses. Depending on the framework, it may include an HTTP server or run behind a separate web server. It needs resource limits, health checks, configuration, and a safe deployment process.

## What a Reverse Proxy Does

A reverse proxy accepts client traffic and forwards it to one or more backend services. It may terminate TLS, route by hostname or path, compress responses, apply request limits, or serve static assets. Examples include Caddy, Nginx, and Envoy; the right configuration depends on the deployment.

## A Common Request Path

A browser connects to a public hostname, DNS resolves the destination, and a reverse proxy accepts HTTPS traffic. The proxy routes the request to an application instance, which may query a database before returning a response through the proxy. The proxy does not replace application authorization or data validation.

## Operational Considerations

Configure forwarding headers carefully and trust them only from known proxies. Set sensible body-size and timeout limits, protect internal services from direct public access where appropriate, and monitor upstream errors. A proxy can become a bottleneck or single point of failure if it lacks capacity or redundancy.

## Learning Objectives

- Distinguish application-server responsibilities from reverse-proxy responsibilities.
- Trace a request through TLS termination, routing, and application logic.

## Worked Example

A browser sends HTTPS to a reverse proxy. The proxy terminates TLS and forwards the request to an application server, which authenticates the user, runs business logic, and queries the database. The proxy may also apply routing and request-size limits.

## Check Your Understanding

1. **Does a reverse proxy usually implement the core business rules?**

   No. It routes and manages traffic; application logic belongs in the application layer.

2. **Why put a reverse proxy in front of an application server?**

   For TLS termination, routing, buffering, access controls, and a stable public entry point.

## Common Pitfall

Assuming a reverse proxy replaces application-server logic or makes an insecure backend safe by itself.

## Key Takeaways

Application servers execute application logic; reverse proxies manage incoming traffic and forwarding. Secure proxy boundaries, timeouts, health checks, and backend access.

## Practice Exercise

Draw the path from a user's browser through HTTPS proxy to two application instances and a database. Mark where TLS terminates and where authorization should be enforced.


### Practice Hint

Follow one request hop by hop and write down which component owns each action.

### Self-Check

Can you explain what changes when a request moves from the proxy to the application?
## Next Lesson

Lesson 20 — Load Balancers
