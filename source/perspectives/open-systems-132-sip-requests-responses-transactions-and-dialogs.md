---
title: "SIP: Requests, Responses, Transactions, and Dialogs"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-132-sip-requests-responses-transactions-and-dialogs.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "SIP is a text-based signaling protocol with requests, responses, transactions, and dialogs. Understanding those layers prevents a Call-ID, transaction branch, and dialog from being treated as the same object."
eyebrow: "Open Systems Course · Lesson 132 of 180"
---

SIP looks familiar if you know HTTP.

It has requests, responses, headers, and message bodies.

But the state model is different.

A SIP call can involve multiple transactions inside one dialog, and one INVITE can fork toward multiple destinations.

## Requests express signaling actions

Common SIP methods include:

INVITE;
ACK;
BYE;
CANCEL;
REGISTER;
OPTIONS.

Each method has defined semantics.

INVITE creates or modifies a session.

BYE terminates an established dialog.

CANCEL attempts to stop a pending request before final completion.

ACK confirms receipt of a final response to INVITE under SIP rules.

Do not substitute one method because the names sound similar.

## Responses are grouped by class

SIP response classes resemble HTTP numerically:

1xx provisional;
2xx success;
3xx redirection;
4xx request failure;
5xx server failure;
6xx global failure.

Examples include:

100 Trying;
180 Ringing;
200 OK;
401 Unauthorized;
404 Not Found;
486 Busy Here;
503 Service Unavailable.

The code tells you how the SIP element classified the signaling result, not the entire business story.

## A transaction is request-response state

A SIP transaction groups one request with responses and retransmission behavior.

The Via branch parameter helps identify transactions.

For UDP transport, SIP transaction machinery handles retransmission because UDP itself does not.

For TCP or TLS, transport delivery is reliable, but SIP transaction state still matters.

## A dialog is longer lived

A dialog represents a peer-to-peer SIP relationship between user agents.

It is identified using:

Call-ID;
local tag;
remote tag.

A dialog can contain multiple transactions.

For example, one INVITE transaction establishes the dialog, a later re-INVITE modifies it, and a BYE transaction ends it.

Therefore:

transaction ≠ dialog;
Call-ID alone ≠ complete dialog identity.

## CSeq orders requests

CSeq contains a sequence number and method.

Within a dialog, it helps maintain ordering of requests.

Reusing or misordering CSeq can lead to rejected requests or confusing state.

## Route sets preserve signaling paths

Record-Route and Route headers let proxies remain in the signaling path for future in-dialog requests.

Without understanding route sets, an initial INVITE can traverse one proxy while a later BYE unexpectedly tries another path.

SIP routing state is part of the dialog.

## Authentication often uses challenge-response

A server can challenge a request with 401 or 407.

The client resends with authorization credentials calculated according to SIP digest authentication rules.

A challenge is not necessarily a failed call. It can be a normal authentication exchange.

Packet traces should therefore distinguish expected challenge-response from terminal authentication failure.

## Practical inspection

Capture one authorized SIP call on a system you operate.

For every message, record:

method/status;
Call-ID;
From tag;
To tag;
Via branch;
CSeq;
Contact;
Route/Record-Route.

Group the messages into transactions.

Then group the transactions into the dialog.

The exercise turns a long packet trace into a state machine.

## The lesson to carry forward

SIP has several overlapping identifiers because it tracks transport hops, transactions, dialogs, and logical identities separately.

The next lesson explains how an address-of-record becomes reachable through registration and location service state.

## Interactive companion exercise

Step through INVITE, provisional/final responses, ACK, and BYE in the [SIP call-flow explorer](../prototypes/interactive-system-design.html#sip-title). The model assumes a proxy Record-Route and omits transaction retransmission details.
