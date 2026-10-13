---
title: "Ports and Sockets"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-078-ports-and-sockets.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "IP identifies network endpoints; transport ports distinguish applications; sockets are operating-system objects representing communication endpoints and their state."
eyebrow: "Open Systems Course · Lesson 78 of 180"
---

Your server has one IP address:

    203.0.113.10

It runs:

- SSH;
- web;
- database;
- voice service.

How does incoming traffic reach the right application?

Transport ports provide part of the answer.

Sockets are the operating-system abstraction applications use to participate.

## Port is not a physical connector

TCP port 443 is a number in a transport header.

It is not a hardware slot.

A listening server binds a socket to an address/port combination according to operating-system rules.

Incoming traffic matching that endpoint can be delivered to the application.

## The same port can exist on different IPs

Server:

    127.0.0.1:8080

is different from:

    192.168.1.10:8080

A service bound only to loopback is not reachable from another machine even though it "uses port 8080."

This explains many deployment problems.

Always inspect:

    address + port + protocol

not just port number.

## TCP connections use endpoint tuples

A TCP flow is identified by endpoint information including:

    source IP
    source port
    destination IP
    destination port

plus protocol context.

A web server can therefore serve thousands of clients all connecting to destination port 443 because each connection has a distinct remote endpoint tuple.

"One port means one connection" is wrong.

## Client ports are usually ephemeral

A browser connecting to remote 443 usually receives a temporary local source port from the OS.

Example:

    192.168.1.20:53122
        ->
    93.184.216.34:443

Another connection can use 53123.

The destination service port is stable.

Client source ports help distinguish concurrent flows.

## A socket is an OS object

The application calls socket-related APIs.

The kernel creates communication state.

For TCP server:

    socket
    bind
    listen
    accept

accept returns a new connected socket while the listening socket remains available for new connections.

This is why a server can have one listening endpoint and many active connections.

## UDP sockets have different state

UDP does not require a TCP handshake.

An application can bind a UDP socket and send/receive datagrams.

Some UDP sockets can be "connected" at the API level to fix a default peer and filter traffic, but that does not create a TCP-style reliable connection.

The word connected depends on the layer.

## Ports can conflict

Two ordinary processes try to bind the same local address and port under incompatible socket options.

One usually fails with address-in-use.

This is an ownership conflict over a transport endpoint.

Running process A does not prove process A owns the expected socket.

Use:

    ss -ltnp
    ss -lunp

to inspect listeners where permissions permit.

## Firewalls operate around sockets, not inside them

A service can be listening.

Firewall blocks inbound traffic.

Local curl works.

Remote connection fails.

The socket state is healthy.

The path to it is not.

This is why local and remote tests belong at different layers.

## Exercise: bind addresses matter

Run a local test server bound to:

    127.0.0.1

Inspect with ss.

Then bind to an interface address or all interfaces in a safe environment.

Compare.

You will see that a port number without bind address is incomplete information.

## The lesson to carry forward

Ports distinguish transport endpoints.

Sockets are the operating-system communication objects applications use.

For troubleshooting, always identify:

- protocol;
- local address;
- local port;
- remote address;
- remote port;
- socket state.

"Port 443 is open" is shorthand, not a full network model.
