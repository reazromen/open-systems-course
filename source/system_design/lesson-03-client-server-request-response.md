# Lesson 03 — Client, Server, Request, and Response

**Course:** System Design — From the Ground Up  
**Module 1 — System Design Fundamentals**

## Lesson Overview

Every interaction in a software system can be understood by identifying who initiates it, who handles it, what message is sent, and what comes back.

## The Client

A client is the component that asks for something or initiates an operation. A browser requesting a page, a mobile app loading a profile, and a command-line program calling an API are all clients. The client usually presents information and gathers user input, but it should not be trusted to enforce important rules by itself.

## The Server

A server receives requests and performs work on behalf of clients. It may validate input, check permissions, apply business rules, read or write data, and return a result. A server can be software running on a physical machine, a virtual machine, a container, or a managed platform.

## Request and Response

A request communicates an intended operation. It often contains a destination, an operation name, headers, and sometimes a body. A response communicates the outcome and may contain data, metadata, or an error. A response is not necessarily successful just because a network connection worked; the application must interpret its status and content.

## A Store Example

When a customer opens a product page, the browser requests product information. The server checks the requested product identifier, retrieves current details, and returns a response. When the customer buys the product, the server must independently check price, stock, identity, and payment status instead of trusting values displayed by the browser.

## Key Takeaways

Identify the client, server, request, and response for each operation. Keep authoritative business rules on the server, and design meaningful responses for both success and failure.

## Practice Exercise

For a school portal, describe the request and response when a student checks their exam result. Which checks must happen on the server?

## Next Lesson

Lesson 04 — Internet, IP Addresses, DNS, and Ports
