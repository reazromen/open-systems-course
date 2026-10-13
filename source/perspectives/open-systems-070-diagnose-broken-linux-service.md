---
title: "Diagnose a Broken Linux Service"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-070-diagnose-broken-linux-service.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "A reproducible Linux troubleshooting sequence moves from service manager to process, logs, identity, files, sockets, network dependencies, and end-to-end request evidence."
eyebrow: "Open Systems Course · Lesson 70 of 180"
---

A web service should answer on port 8080.

It does not.

Do not begin by reinstalling Linux.

Do not begin by changing firewall rules randomly.

Do not reboot and call the problem solved.

Build an evidence chain.

## Step 1: define the failure

Bad:

    service broken

Better:

    HTTP request to localhost:8080 returns connection refused

or:

    process starts, but HTTP request returns 500

Those are different failures.

Define the exact observed boundary first.

## Step 2: ask the service manager

On systemd:

    systemctl status my.service

Questions:

- active?
- failed?
- restarting?
- exit code?
- main PID?

If unit never started, socket diagnosis comes later.

If unit is active, continue.

Manager state is one layer.

## Step 3: inspect logs around the event

    journalctl -u my.service

Look around the startup timestamp.

Search for:

- permission denied;
- missing file;
- address already in use;
- connection timeout;
- invalid configuration.

Do not grep only for ERROR.

Important clues may be ordinary informational state transitions.

## Step 4: inspect the process

If PID exists:

    ps
    /proc/PID/status
    /proc/PID/fd

Questions:

- correct user?
- correct executable?
- expected working state?
- file descriptor leak?
- process alive but blocked?

A manager can report active while application is stuck.

## Step 5: inspect the listening socket

    ss -ltnp

Expected:

    address:8080

Maybe service bound only to:

    127.0.0.1

while remote clients need:

    0.0.0.0 or specific interface address

Maybe another process owns the port.

Maybe nothing is listening.

This one observation can eliminate many hypotheses.

## Step 6: test locally

    curl http://127.0.0.1:8080/

If local request fails, external routing is not the first problem.

If local succeeds but remote fails, move outward:

- bind address;
- host firewall;
- routing;
- reverse proxy;
- tunnel;
- DNS.

Debug from inside out.

## Step 7: inspect dependencies

Application may listen but return 500 because database is unavailable.

Test the dependency from the same environment and identity where possible.

Questions:

- DNS resolves?
- route exists?
- credential valid?
- TLS certificate trusted?
- dependency listening?

A healthy frontend process can depend on unhealthy backend state.

## Step 8: inspect files and permissions

Configuration path exists?

Correct owner?

Directory traversal permissions?

Secret readable by service user?

Remember that service manager environment differs from your shell.

Do not test only as your interactive account.

Identity is part of reproducibility.

## Step 9: reproduce one request with timestamps

Record:

    T0 service state
    T1 request sent
    T2 application log
    T3 dependency log
    T4 response

Now you can align evidence across components.

An incident becomes a timeline instead of a pile of screenshots.

## Step 10: change one thing

After forming a hypothesis, make one controlled change.

Restart.

Retest.

If you change five settings at once, you may restore service without learning the cause.

That creates fragile operations.

## A worked example

Symptom:

    connection refused on port 8080

systemctl:

    service failed

journal:

    permission denied opening /etc/myapp/config.yml

Inspect:

    service runs as myapp user
    config readable only by root

Root cause candidate:

service identity cannot read required configuration.

Fix the intended permission or ownership policy.

Restart.

Verify:

    service active
    socket listening
    curl returns expected response

Now the explanation connects evidence across layers.

## The lesson to carry forward

Linux troubleshooting is not command collection.

It is an ordered investigation:

    symptom
      -> manager
      -> process
      -> logs
      -> files
      -> socket
      -> local request
      -> dependency
      -> network
      -> end-to-end verification

Every step narrows the system.

Module 8 now opens the networking layers behind those sockets and requests.
