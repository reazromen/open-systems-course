# Lesson 07 — TCP and UDP

**Course:** System Design — From the Ground Up  
**Module 2 — Networking and Communication**

## Lesson Overview

Network communication is not just about sending bytes. The transport protocol affects delivery guarantees, ordering, latency, and how an application responds to loss.

## TCP: A Reliable Byte Stream

TCP establishes a connection and provides an ordered byte stream. It retransmits lost data and prevents the application from seeing bytes out of order. This is useful for web pages, APIs, database connections, and file transfers where missing or reordered bytes would break the message. TCP does not preserve application message boundaries; the application protocol defines them.

## UDP: Datagrams

UDP sends independent datagrams without establishing a transport connection or guaranteeing delivery, ordering, or duplicate protection. Its lower protocol overhead can suit real-time media, gaming, DNS, and other applications that can tolerate or manage loss. UDP is not automatically faster in every situation; network conditions and application design matter.

## Choose for the Workload

A file download usually needs complete, ordered data, so TCP is a natural fit. A live voice call may prefer timely audio over retransmitting audio that arrives too late to play. Applications using UDP may implement their own congestion control, reliability, sequencing, or recovery when needed.

## Transport Is Only One Layer

Using TCP does not guarantee that an operation completed: a connection can break after the server commits a purchase but before the client receives the response. The client may not know whether retrying is safe. Application-level timeouts, idempotency, and explicit operation status are still important.

## Key Takeaways

TCP provides a reliable ordered byte stream; UDP provides datagrams with fewer delivery guarantees. Choose based on the application’s correctness and timing requirements.

## Practice Exercise

Choose TCP or UDP for a file download, a live voice stream, and a payment API. Explain what each application needs from its transport.

## Next Lesson

Lesson 08 — HTTP Methods, Status Codes, and Headers
