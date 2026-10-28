# Lesson 02 — How Does a Software System Work?

**Course:** System Design — From the Ground Up  
**Module 1:** System Design Fundamentals  
**Previous lesson:** What Is System Design?

## Learning Objectives

By the end of this lesson, you should be able to:
- Trace a request from a user-facing client through a server and back.
- Explain the roles of a server, database, and cache.
- Identify decisions that must be enforced by trusted server-side logic.

## Video Script

In the previous lesson, we learned that system design is about planning how the parts of a software system work together. In this lesson, we will follow the basic flow inside a typical software system.

Imagine opening an online store on your phone and searching for a book. You see a search box and a list of results, but several steps may be happening behind the scenes.

First, the **client**—your mobile app or web browser—collects your input. The client sends a request across the network to a server. The server interprets the request, applies the relevant rules, and may query a database for book information. It then prepares a response and sends it back. The client uses that response to display the results on your screen.

A simplified flow looks like this:

**User → Client → Network → Server → Database (if needed) → Server → Client → User**

This is a conceptual model. A real system may also use a load balancer, cache, API gateway, or multiple services. Not every application needs all of these components.

Let's define the core terms.

**Client:** The part that interacts with the user and sends requests to a server. A web browser and an Android app can both be clients.

**Server:** A computer or software process that receives requests and provides responses. The word *server* can refer to the machine itself or to the software running on it; context tells us which meaning is intended.

**Request:** A message sent by a client asking for an operation or resource. It may include data needed to complete the operation.

**Response:** The server's reply. It can contain requested information, a result, or an indication of whether the operation succeeded.

**Database:** A system for storing and retrieving organized data, such as book titles, authors, prices, and inventory levels.

One important principle is that the client should not be the final authority for critical decisions. A mobile app might display a book price of $5, but the server should verify the price using trusted data. Clients can be modified and requests can be malformed or manipulated. Payments, permissions, and important business rules therefore need server-side validation.

Not every request needs to reach the database. Frequently accessed information may be served from a cache. A time-consuming task may be placed on a queue and processed later. We will study these approaches in later modules.

When designing a system, do not ask only, “Which server should we use?” Ask a broader set of questions: Where does the request originate? Which component validates it? Where is the data stored? How does the response return to the user? What does the user experience if a step fails? If the same request arrives twice, could the system accidentally perform the operation twice?

## Worked example: searching for a book

The user enters a title in the app. The client sends a search request to the application server. The server validates the query and checks permissions; it may query a database or cache. The server returns a result list, and the client renders it. If the query is invalid or the database is unavailable, the server should return a meaningful failure rather than pretend the search succeeded.

## Check Your Understanding

**1. Why shouldn't the app decide the final price of an order?**

<details>
<summary>Answer and explanation</summary>

The client is under the user's control and can be modified. The server must calculate or verify the price using trusted data.

</details>

**2. Does every request have to query the database?**

<details>
<summary>Answer and explanation</summary>

No. A cache or another service may answer it, depending on freshness and correctness requirements. Know which component owns the authoritative data.

</details>

## Common Pitfall

A browser or mobile app is not a trusted authority just because it is part of the product. Treat client input as untrusted.

### Key Takeaways

In a typical software system, a client sends a request, a server processes it, the server may use a database or another service, and then a response returns to the client. Understanding this request-response flow is one of the foundations of system design.

### Practice Exercise

Imagine checking the weather for your city in a weather app. Describe how the client, application server, and database or external weather service might communicate.

### Practice Hint and Self-Check

**Hint:** For a weather app, identify where weather data originates: an internal database, an external weather API, or both.

**Self-check:** Your flow names the client, network, server, data source, and response path; it also identifies one server-side validation.

### Next Lesson

Lesson 03 — Client, Server, Request, and Response: The Core Concepts
