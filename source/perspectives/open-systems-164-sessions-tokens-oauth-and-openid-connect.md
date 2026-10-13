---
title: "Sessions, Tokens, OAuth, and OpenID Connect"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-164-sessions-tokens-oauth-and-openid-connect.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "Sessions and tokens carry security context across requests. OAuth delegates API authorization, OpenID Connect adds identity claims, and bearer tokens must be protected because possession can be enough to use them."
eyebrow: "Open Systems Course · Lesson 164 of 180"
---

Modern systems use many words:

session;
access token;
refresh token;
JWT;
OAuth;
OIDC.

They are related but not interchangeable.

## A session is server-recognized continuity

A web session can use an opaque cookie value.

Server maps it to:

user;
authentication time;
permissions/context;
expiry.

The browser sends the cookie on matching requests.

The server can revoke the session by deleting or disabling the record.

## Bearer tokens grant by possession

A bearer access token can be used by whoever possesses it.

That makes token leakage dangerous.

Protect bearer tokens from:

logs;
URLs;
analytics;
browser storage exposure;
source code;
chat/tickets.

Use TLS in transit.

Keep lifetimes appropriate to risk.

## JWT is a token format, not an authorization system

A JSON Web Token contains claims and is signed or otherwise protected according to JOSE mechanisms.

A JWT can carry:

issuer;
subject;
audience;
expiry;
custom claims.

The receiver still needs policy:

which issuer is trusted?
which algorithms/keys?
is audience correct?
is token expired?
what does this claim authorize?

“JWT valid” is not the same as “request authorized.”

## OAuth 2.0 delegates authorization

OAuth defines flows where a client obtains an access token to call a resource server with delegated authorization.

Roles include:

resource owner;
client;
authorization server;
resource server.

OAuth does not inherently mean “login.”

It is an authorization framework.

## OpenID Connect adds authentication identity

OpenID Connect builds an identity layer on OAuth 2.0.

It defines ID Tokens and user-information semantics so clients can authenticate users through an identity provider.

Use OIDC when the goal includes user identity/login semantics.

## Authorization Code with PKCE is the modern browser/mobile pattern

Public clients cannot safely hold a permanent client secret.

PKCE binds the authorization request to a verifier created by the client, reducing authorization-code interception risk.

Current OAuth security guidance recommends stronger modern flows and discourages legacy patterns.

## Refresh tokens extend sessions carefully

Access tokens can be short-lived.

A refresh token can obtain new access tokens without forcing interactive login every few minutes.

That makes the refresh token highly sensitive.

Rotation and reuse detection can reduce damage from theft.

Logout/revocation policy should consider both access and refresh artifacts.

## Audience limits token reuse

A token intended for API A should not automatically be accepted by API B.

The aud claim or equivalent audience restriction constrains where the token is valid.

Services should validate audience, not just signature.

This limits confused-deputy and token replay across services.

## Practical exercise

Draw one OIDC login flow for a web application:

browser;
client;
authorization server;
API.

Label:

authorization code;
PKCE verifier/challenge;
ID Token;
access token;
refresh token.

For each artifact write:

who creates it;
who may read it;
where it is stored;
how long it lives;
what it proves.

If two artifacts have the same answer, check whether you are conflating them.

## The lesson to carry forward

Sessions and tokens carry security context after authentication.

The next lesson goes deeper into the most sensitive operational data in the system: secrets and keys.
