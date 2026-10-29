---
title: "Cookies and Sessions: How Web Apps Remember You"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-096-cookies-sessions-how-web-apps-remember-you.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "HTTP requests are separate messages, but web applications still need continuity. Cookies and session state connect one request to another without making the transport connection itself the user identity."
eyebrow: "Open Systems Course · Lesson 96 of 180"
---

A user signs in, opens another page, and the application still knows who they are.

That continuity does not come from the TCP connection.

It does not come from TLS alone.

It does not come from HTTP remembering every previous request.

A web application builds continuity by carrying state across otherwise separate requests.

One of the most common mechanisms is:

```text
browser cookie
      ↓
session identifier or token
      ↓
server-side or cryptographically protected application state
```

The important lesson is not simply "cookies store sessions."

It is that **identity continuity is an application protocol layered on top of HTTP**.

## A cookie is browser-managed state

A server can ask a browser to store a cookie using a response field such as:

```http
Set-Cookie: session_id=abc123; Secure; HttpOnly
```

On later requests that match the cookie's scope and policy, the browser can send:

```http
Cookie: session_id=abc123
```

RFC 6265 defines the HTTP state-management mechanism for cookies.

The value might be:

- an opaque random session identifier;
- a signed token;
- a preference;
- another application-defined value.

The cookie mechanism does not define what the value means.

That meaning belongs to the application.

## A session identifier is not the session itself

Suppose the browser stores:

```text
session_id = abc123
```

The server might maintain:

```text
abc123
  ↓
user_id = 42
created_at = ...
last_seen = ...
permissions_snapshot = ...
csrf_state = ...
```

in a database or cache.

In that design, the cookie contains a handle.

The actual session state lives on the server.

A different design can place more state inside a signed or encrypted token sent by the client.

Those designs have different trade-offs around revocation, storage, size, synchronization, and failure.

Do not confuse "cookie-based session" with "all session state is inside the cookie."

## Cookie scope matters

Cookies have attributes that control when browsers send them.

Important concepts include:

- Domain;
- Path;
- Secure;
- HttpOnly;
- expiration or lifetime;
- SameSite behavior in modern browsers.

`Secure` restricts cookie transmission to secure contexts according to browser rules.

`HttpOnly` prevents ordinary client-side script access to the cookie through document cookie APIs, which helps reduce one class of exposure if script execution is compromised.

Domain and Path influence which requests receive the cookie.

These are scope controls, not complete authorization policy.

A cookie reaching a server does not prove the request is allowed to perform an operation.

## Session state crosses requests

Consider:

```text
POST /login
  ↓
credentials verified
  ↓
server creates session
  ↓
Set-Cookie returned
  ↓
browser stores cookie
  ↓
GET /account
  ↓
Cookie sent
  ↓
server loads session
  ↓
account response
```

The second request can arrive over another connection.

It can be processed by another application instance.

The continuity comes from the session mechanism, not from connection affinity unless the architecture deliberately adds that dependency.

This is why distributed web applications need shared or otherwise coordinated session state if requests can land on different servers.


## Authentication and session management are different steps

During login, the application authenticates a credential.

After login, the session mechanism represents continuity of that authenticated state.

Those are different contracts.

If an attacker steals a valid session identifier, they may not need the original password for every request. That is why session identifiers must be treated as security-sensitive secrets.

Good systems also rotate or replace session identifiers at important privilege transitions such as successful authentication.

The session should not be a permanent identity artifact.

It should have a lifetime, revocation behavior, and policy.

## Expiration is more than one timestamp

Applications often use several kinds of session lifetime:

```text
absolute lifetime
idle timeout
cookie expiration
server-side record expiration
token expiration
```

These can disagree.

For example:

```text
browser still has cookie
        ↓
server session expired
        ↓
request arrives
        ↓
application rejects session
```

The browser retaining a cookie does not guarantee the server still considers the session valid.

Likewise, deleting a browser cookie does not necessarily destroy server-side state unless the logout path also revokes or expires that state.

Client state and server state must be reasoned about separately.

## Logout is a state transition

A robust logout operation can involve:

- invalidating server-side session state;
- expiring the browser cookie;
- revoking refresh or access artifacts when the design uses them;
- preventing stale session identifiers from becoming valid again.

Merely redirecting the user to a login page is not logout.

The useful question is:

**What server-side state changed so the old session can no longer authorize requests?**

That turns a UI event into an inspectable system transition.

## Sessions and CSRF are related but not identical

Browsers automatically attach matching cookies to requests.

That convenience creates a security problem: a malicious site can sometimes cause a browser to issue a request to another site while the browser's cookies are still attached.

SameSite cookie behavior can reduce some cross-site request scenarios, but applications must still understand cross-site request forgery protection for state-changing actions.

Session authentication proves which session the request carries.

It does not by itself prove that the user intentionally initiated the request from an authorized application context.

We will connect this to the same-origin policy and CORS in the next lesson.

## Inspect session behavior safely

Use a local application or one you administer.

Open the browser's storage or application panel and identify the authentication-related cookie.

Record:

- cookie name;
- domain;
- path;
- Secure state;
- HttpOnly state;
- expiration;
- SameSite behavior when shown.

Then sign out.

Observe whether the cookie disappears or changes.

If you control the server-side session store, verify that the corresponding session record is also invalidated.

Do not copy live session values into notes, screenshots, tickets, or chat. Treat them like credentials.

## Build a small session experiment

Create a local application with an in-memory session map:

```text
random session id → username
```

On login:

1. generate a high-entropy random session identifier;
2. store it server-side;
3. set it as a Secure/HttpOnly cookie when using HTTPS;
4. require it for a protected endpoint;
5. invalidate it on logout.

Then restart the application.

If the session map is only in memory, every session disappears.

That failure teaches an architectural dependency:

```text
session persistence
depends on
session storage
```

Move the session store to a shared database or cache and the behavior changes again.

## The lesson to carry forward

Cookies let a browser carry small pieces of state across requests.

Sessions give applications continuity across those requests.

The transport connection is not the user.

The cookie value is not automatically the user.

The session record is not automatically authorization.

Each layer needs its own validation and lifetime.

The next lesson explains the browser boundary that makes many web security rules necessary: origins, same-origin policy, and CORS.

## Interactive companion exercise

Trace session creation, Set-Cookie, later Cookie transmission, server-side session lookup, and logout invalidation in the [cookie/session timeline](../prototypes/interactive-system-design.html#protocol-title).
