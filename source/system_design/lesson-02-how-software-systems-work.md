# Lesson 02 — How Does a Software System Work?

**Course:** System Design — From the Ground Up  
**Module 1:** System Design Fundamentals  
**Previous lesson:** What Is System Design?

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

### Key Takeaways

In a typical software system, a client sends a request, a server processes it, the server may use a database or another service, and then a response returns to the client. Understanding this request-response flow is one of the foundations of system design.

### Practice Exercise

Imagine checking the weather for your city in a weather app. Describe how the client, application server, and database or external weather service might communicate.

### Next Lesson

Lesson 03 — Client, Server, Request, and Response: The Core Concepts
