---
title: "HTTP Is a Message Protocol, Not the Web"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-091-http-is-a-message-protocol-not-the-web.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "HTTP defines request and response semantics between components. The web is a much larger system containing browsers, URLs, DNS, TLS, caches, scripts, servers, storage, and application state."
eyebrow: "Open Systems Course · Lesson 91 of 180"
---

A browser opens a page and we casually say, "HTTP loaded the website."

That sentence compresses too much.

HTTP is one protocol family inside a larger web system. It defines semantics for requests and responses: methods, status codes, fields, representations, caching rules, and related behavior. It does not define DNS, routing, TLS certificates, HTML rendering, JavaScript execution, database queries, or user sessions by itself.

The first useful correction for this module is:

**HTTP is not the web. HTTP is one set of contracts used by web systems.**

## Put HTTP above the network path

The previous module ended with a working Internet path.

A common HTTPS path can be modeled as:

```text
browser or API client
        ↓
HTTP semantics
        ↓
HTTP message framing
        ↓
TLS, usually for HTTPS
        ↓
TCP or QUIC
        ↓
IP
```

That stack already reveals an important detail.

The HTTP semantics can stay mostly the same while the message transport changes.

RFC 9110 defines HTTP semantics independently from one specific version's framing.

HTTP/1.1 messaging is defined by RFC 9112.

HTTP/2 uses binary framing and multiplexing while preserving HTTP semantics.

HTTP/3 maps HTTP semantics onto QUIC rather than TCP.

So:

```text
GET /status
```

can mean the same kind of operation across HTTP/1.1, HTTP/2, and HTTP/3 even though the bytes on the wire are not encoded the same way.

## HTTP is request-response

At the semantic level, a client sends a request.

A server sends a response.

A request has concepts such as:

- method;
- target resource;
- fields;
- optional content.

A response has:

- status code;
- fields;
- optional content.

A simplified HTTP/1.1 example looks like:

```http
GET /status HTTP/1.1
Host: example.com
Accept: application/json

```

Response:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 15

{"status":"ok"}
```

This textual form is useful because HTTP/1.1 exposes the structure directly.

Do not copy the visual form onto HTTP/2 or HTTP/3 and assume those protocols transmit identical text lines. Their framing is different.

The semantics are the transferable mental model.

## A resource is not necessarily a file

The request target:

```text
/users/42
```

does not prove that a file named `42` exists on disk.

A server can map that target to:

- a static file;
- a database record;
- generated HTML;
- an API handler;
- a proxy upstream;
- a cached representation;
- a function;
- an object in another service.

HTTP deals with resources and representations at the protocol level, while the server decides how those resources are implemented.

That distinction matters because many beginner mental models assume:

```text
URL path = filesystem path
```

Sometimes that is true.

Often it is not.

## HTTP does not require a browser

A browser is one HTTP user agent.

Other clients include:

- `curl`;
- package managers;
- mobile applications;
- service-to-service clients;
- monitoring probes;
- embedded devices;
- command-line SDKs.

If you make this request:

```bash
curl -i https://example.com/
```

you are using HTTP without a browser UI.

This is important for debugging.

If the browser fails but `curl` succeeds, the difference may involve browser policy, cookies, JavaScript, CORS, service workers, extensions, or rendering rather than basic HTTP reachability.

## HTTP is not automatically stateless in the whole-system sense

HTTP request semantics do not require a server to remember every previous request in a connection-specific application session.

But real web applications often maintain state through mechanisms such as:

- cookies;
- bearer tokens;
- database session records;
- server-side caches;
- browser storage;
- application state.

So the phrase "HTTP is stateless" should be handled carefully.

A more precise statement is:

**HTTP messages can be interpreted independently at the protocol level, but web applications frequently build stateful behavior above them.**

We will study sessions in Lesson 96.

## The connection and the request are not the same object

In HTTP/1.1, several HTTP exchanges can use one persistent TCP connection.

In HTTP/2, many request-response streams can be multiplexed concurrently over one connection.

In HTTP/3, HTTP streams are carried over QUIC.

Therefore:

```text
one request
≠
one TCP connection
```

and:

```text
one connection
≠
one request
```

That distinction becomes important when measuring latency, connection reuse, failures, and load.

A server can keep a connection open after sending a response.

A client can reuse it for later requests.

## HTTP defines meaning, not the business rule

Suppose a server responds:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"payment":"rejected"}
```

HTTP says the request received a successful 2xx response at the protocol/application-interface level.

The business operation represented in the body can still be rejected.

Likewise, an HTTP 500 indicates server-side failure for the request, but it does not tell you whether the root cause was:

- application code;
- database failure;
- dependency timeout;
- configuration;
- exhausted resource;
- another backend.

Status codes are evidence, not full incident reports.

## HTTP can cross intermediaries

The client might believe it is communicating with `api.example.com`.

The actual path can be:

```text
client
  ↓
CDN edge
  ↓
reverse proxy
  ↓
application server
  ↓
backend dependency
```

HTTP allows intermediaries such as proxies and gateways.

That means headers, caching, connection state, and errors can be produced at different boundaries.

The machine that sends the final response to the client may not be the machine that stores the business data.

This is why server-side troubleshooting needs request identity and logs across boundaries.

## HTTP does not make content safe

Receiving:

```text
Content-Type: text/html
```

does not mean the content is trustworthy.

A browser still applies security policies and parsing rules.

JavaScript still executes under a browser security model.

The server still needs authorization.

The user still needs protection from untrusted content.

HTTP transports metadata and representations. It does not replace the security model of the software using them.

## Observe HTTP directly

Use a service you own or a public site you are normally allowed to access.

Start with:

```bash
curl -i https://example.com/
```

Then add verbosity:

```bash
curl -v https://example.com/
```

Separate what you observe:

```text
DNS resolution
TCP or QUIC connection behavior
TLS
HTTP request
HTTP response
```

Depending on the build, `curl` may negotiate HTTP/2.

You can inspect the reported version rather than assuming it.

If your curl supports it, compare explicit versions against a test service you control:

```bash
curl --http1.1 -I https://example.com/
curl --http2   -I https://example.com/
```

The response semantics should still be recognizable even though the transport framing changes.

## Build a tiny local HTTP service

On a local machine:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Then:

```bash
curl -i http://127.0.0.1:8080/
```

Observe:

- method;
- target;
- response status;
- response fields;
- body.

Now request a missing path:

```bash
curl -i http://127.0.0.1:8080/does-not-exist
```

The network connection can succeed while the HTTP result changes from a success response to a not-found response.

That is the protocol boundary made visible.

## The lesson to carry forward

The web is a system of systems.

HTTP contributes a request-response contract that can run over several protocol versions and transports.

A request has semantics.

A response has semantics.

Connections, caches, browsers, proxies, servers, databases, and sessions add more state around those messages.

The next lesson opens the HTTP message itself and examines request targets, fields, content, response status, and how message framing differs from semantics.
