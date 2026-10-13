---
title: "Authorization, Least Privilege, and Policy"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-163-authorization-least-privilege-and-policy.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Authentication tells a system who is calling; authorization decides whether that identity may perform one operation on one resource in one context. Least privilege minimizes the damage of compromise."
eyebrow: "Open Systems Course · Lesson 163 of 180"
---

A user logs in successfully.

That proves identity.

It does not prove the user may delete another tenant's data.

Authorization is a separate decision.

## Authorization has a subject, action, and resource

A useful policy question is:

Can subject S perform action A on resource R under context C?

Example:

Can user 42 update device abc123 for tenant 7 from this session?

This is much clearer than:

is user authenticated?

## Role-based access control groups permissions

RBAC assigns permissions to roles:

viewer;
operator;
admin.

Users or services receive roles.

This is easy to understand and audit.

It can become coarse when thousands of exceptional role combinations appear.

A role named super_admin that bypasses every check should be treated as high-risk infrastructure.

## Attribute-based policy uses context

ABAC can consider:

tenant;
resource owner;
device class;
network;
time;
risk;
environment.

Example:

operator may reboot devices only in their assigned tenant.

This expresses policy more precisely.

It can also make debugging harder if policy is scattered across many attributes.

Centralized decision logic and audit help.

## Object-level authorization prevents tenant leaks

A common application failure is checking that a user is logged in but not checking ownership of the specific object.

Request:

GET /invoices/9842.

The server must verify that the caller is allowed to access invoice 9842.

Sequential IDs should never be treated as authorization secrets.

## Least privilege reduces blast radius

A reporting service that only reads analytics tables should not have permission to drop the production database.

An IoT device should publish only to its own telemetry namespace.

A CI job that builds artifacts should not automatically have production database credentials.

Permissions should match required operations.

## Deny by default

When new resources or actions appear, permissive defaults create accidental exposure.

A deny-by-default policy requires explicit grants.

This is safer when systems evolve.

It also requires good developer tooling so legitimate access is not bypassed through ad-hoc credentials.

## Authorization should occur at every relevant boundary

A gateway can reject broad categories.

The application still needs domain authorization because it understands the resource.

The database can enforce tenant constraints or row policies in some architectures.

Defense in depth is useful when layers have independent information.

Avoid duplicating inconsistent policy everywhere.

## Policy changes need audit

Record:

who changed role/policy;
what changed;
when;
old value;
new value;
approval if required.

Privilege escalation through configuration is as real as privilege escalation through code.

## Time-limited privilege is safer for administration

High-risk access can be granted just in time:

request approval;
temporary role;
automatic expiry.

This reduces permanent standing privilege.

Emergency access should be auditable and reviewed after use.

## Practical exercise

Take one API endpoint.

Write an authorization matrix:

anonymous;
normal user;
tenant operator;
administrator;
service account.

For each identity, list read/create/update/delete permissions.

Then test object ownership boundaries with two tenants.

A test that only checks “401 when logged out” is incomplete.

## The lesson to carry forward

Authorization is policy applied to a specific subject, action, and resource.

The next lesson examines the artifacts that carry authentication state across systems: sessions, bearer tokens, OAuth, and OpenID Connect.
