# Lesson 44 — Authentication and Authorization

**Course:** System Design — From the Ground Up  
**Module 8 — Reliability, Security, and Observability**

## Lesson Overview

Authentication establishes who or what is making a request. Authorization decides which actions that identity is permitted to perform. A secure design needs both, with least privilege enforced at the appropriate boundaries.

## Identity and Credentials

Authentication may use passwords, passkeys, certificates, or identity-provider tokens. Credentials must be transported securely, stored safely, rotated where appropriate, and never written to ordinary logs. Services should verify token signatures, issuer, audience, expiry, and relevant claims according to the protocol.

## Authorization Models

Role-based access control assigns permissions through roles; attribute-based approaches evaluate attributes such as resource ownership, tenant, or request context. A role like 'user' is often too broad by itself: the system must still verify whether the user can access this particular account or object.

## Least Privilege and Defense in Depth

Give users and services only the permissions needed for their work. Enforce access checks server-side; hiding a button in the interface is not authorization. Protect service-to-service calls, separate production and development credentials, and audit sensitive actions.

## Sessions, Tokens, and Revocation

Sessions and bearer tokens have different lifecycle and revocation trade-offs. Short-lived access tokens reduce the exposure window but require refresh and expiry handling. Do not put secrets or unnecessary personal data into token claims, and plan what happens when credentials are stolen or an account is disabled.

## Key Takeaways

Authentication verifies identity; authorization enforces permissions. Use least privilege, server-side object-level checks, secure credential handling, and explicit expiry and revocation behavior.

## Practice Exercise

A user changes `/accounts/123` to `/accounts/124` in a request URL. What authorization check must the server perform even if the user is already authenticated?

## Next Lesson

Lesson 45 — Rate Limiting and Abuse Protection
