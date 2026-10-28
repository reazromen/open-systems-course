# Lesson 03 — Client, Server, Request, and Response

**Course:** System Design — From the Ground Up  
**Module 1 — System Design Fundamentals**

## Learning Objectives

By the end of this lesson, you should be able to:
- Distinguish a client, server, request, and response.
- Describe the parts of a typical request-response interaction.
- Explain why a successful connection does not guarantee a successful operation.

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

## Worked example: checking a student's result

A student opens a result page. The browser sends a request for a particular result. The server authenticates the student, checks that the student is allowed to view that result, retrieves the record, and returns either the result or an appropriate error. The browser then displays the response. Hiding another student's result in the UI is not enough; access must be checked on the server.

## Check Your Understanding

**1. A request reaches the server, but the response says 403. Did the network necessarily fail?**

<details>
<summary>Answer and explanation</summary>

No. The request reached an application that refused access. A 403 is an authorization outcome, not proof of a network failure.

</details>

**2. What should the server verify before returning an exam result?**

<details>
<summary>Answer and explanation</summary>

It should authenticate the requester and authorize access to that specific student's result, then return only permitted information.

</details>

## Common Pitfall

Do not confuse transport success with business success. A request can arrive correctly and still be rejected, fail validation, or encounter a server error.

## Key Takeaways

Identify the client, server, request, and response for each operation. Keep authoritative business rules on the server, and design meaningful responses for both success and failure.

## Practice Exercise

For a school portal, describe the request and response when a student checks their exam result. Which checks must happen on the server?

## Next Lesson

Lesson 04 — Internet, IP Addresses, DNS, and Ports
### Practice Hint and Self-Check

**Hint:** For a school portal, write 'Student A asks to view result B,' then list the checks required before data is returned.

**Self-check:** Your answer separates authentication from authorization and explains what the response communicates.

