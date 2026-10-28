# Lesson 04 — Internet, IP Addresses, DNS, and Ports

**Course:** System Design — From the Ground Up  
**Module 1 — System Design Fundamentals**

## Lesson Overview

Before two software components can exchange application messages, they need a route to one another. IP addresses, DNS, and ports solve different parts of that problem.

## The Internet and IP

The Internet is a network of interconnected networks that forward packets between endpoints. An IP address identifies a network interface for routing traffic. IPv4 addresses are commonly written as four decimal numbers, while IPv6 uses a longer hexadecimal notation. An address helps packets reach a destination, but it does not by itself identify the application that should receive them.

## DNS: Names to Addresses

People prefer names such as example.com to numeric addresses. The Domain Name System (DNS) lets a client discover records associated with a name, commonly including IP addresses. DNS answers can be cached for a period controlled by record TTLs, so a change may not be visible everywhere immediately.

## Ports Identify Services

A port number helps the operating system deliver transport-layer traffic to the appropriate process or service. For example, a web server commonly accepts HTTPS traffic on TCP port 443. The IP address identifies the network endpoint; the port helps identify the destination service on that endpoint. A port is not a physical connector.

## Putting It Together

A browser looks up a domain through DNS, receives an address, establishes the required transport connection, and sends an application request to the service's port. Firewalls, routing rules, proxies, TLS, and load balancers may affect the path. If a site fails, distinguish name resolution, routing, connection, TLS, and application errors rather than treating them as one problem.

## Key Takeaways

DNS maps names to records, IP supports packet routing, and ports direct transport traffic to services. They are related but not interchangeable.

## Practice Exercise

A domain resolves to an IP address, but the website is unreachable. List three different checks you would perform before blaming the application.

## Next Lesson

Lesson 05 — HTTP, HTTPS, and APIs
