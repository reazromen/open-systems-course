---
title: "Device Identity, Provisioning, and First Trust"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-122-device-identity-provisioning-and-first-trust.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Before an IoT device can publish telemetry or accept commands, the system must know which device it is and how that identity becomes trusted without turning one factory secret into a fleet-wide failure."
eyebrow: "Open Systems Course · Lesson 122 of 180"
---

A new IoT device comes out of a box.

It has no Wi-Fi credentials, no cloud session, and no reason for a server to trust it.

Yet within minutes it may become part of a production fleet.

That transition is provisioning.

Provisioning is not just “put the SSID in flash.” It is the process by which a physical device acquires identity, network configuration, credentials, policy, and an initial trust relationship.

## Identity must be stable enough to manage

A fleet needs a durable device identifier.

Possible sources include:

- factory-programmed serial number;
- hardware unique ID;
- cryptographic public key;
- certificate subject or SAN identity;
- secure-element key;
- manufacturer-assigned identifier.

A MAC address can be useful operational metadata, but it is not automatically a strong application identity. It can be changed, randomized in some contexts, exposed on the network, or duplicated by misconfiguration.

Identity and network address are different concepts.

## Shared fleet passwords are a dangerous shortcut

If every device uses one secret:

fleet_password = same_value_everywhere

then compromise of one device can compromise the fleet.

Per-device credentials reduce blast radius.

A stronger model is:

device private key → proves possession → server maps public identity to one device record.

The private key should ideally never leave the device after provisioning.

## First trust is the hard part

How does the server know that a public key belongs to a legitimate device?

Common approaches include:

- factory-installed certificate chain;
- one-time activation code;
- secure manufacturing database;
- QR code bound to device identity;
- local possession proof;
- hardware attestation in higher-assurance systems.

Every method moves trust somewhere.

A QR code trusts packaging and enrollment flow.

A factory certificate trusts manufacturing PKI.

A one-time code trusts secrecy of that code until enrollment.

There is no provisioning without a trust anchor.

## Network provisioning is separate from cloud identity

A phone can configure a device's Wi-Fi network while the cloud still does not trust the device.

Similarly, a device can have a valid cloud certificate but no local network access.

Keep the two state machines separate:

local connectivity provisioning;
service identity provisioning.

This makes failures easier to diagnose.

## Bluetooth, SoftAP, USB, and wired setup are transport choices

An unconfigured device needs some bootstrap path.

Popular options include:

- Bluetooth LE provisioning;
- temporary Wi-Fi SoftAP;
- USB serial;
- NFC;
- Ethernet;
- pre-provisioning at manufacture.

The transport does not define the security policy.

A SoftAP with no authentication can expose configuration to anyone nearby.

Bluetooth pairing can still be implemented badly.

The provisioning protocol must authenticate sensitive changes and protect credentials appropriate to the threat model.

## Credentials need lifecycle

Provisioning is not the end.

Certificates expire.

Keys can be compromised.

Devices are transferred, returned, decommissioned, or factory-reset.

A fleet needs operations for:

- rotate credential;
- revoke device;
- re-enroll;
- transfer ownership;
- wipe local secrets;
- mark device retired.

Identity without lifecycle becomes permanent technical debt.

## Secure storage changes the compromise model

If a private key is stored in ordinary flash, physical access may allow extraction depending on hardware protections.

Secure boot, flash encryption, secure elements, trusted execution environments, and eFuse-based key storage can strengthen the boundary.

These mechanisms have platform-specific limitations and sometimes irreversible configuration.

Security should be designed before mass manufacturing, not added after devices ship.

## Provisioning should be observable

For each device, record non-secret state such as:

- manufacturing identifier;
- enrolled public identity;
- provisioning timestamp;
- firmware version;
- owner or tenant;
- revocation status;
- last successful authentication.

Do not log private keys, passwords, or full bearer tokens.

The goal is to answer: what did this device become, and when?

## Practical exercise

Design a provisioning flow for a hypothetical sensor.

Write the exact transitions:

factory state → local pairing → network configured → server enrollment → credential stored → first authenticated telemetry → active fleet member.

For each transition, write who authenticates whom and what secret or key proves it.

Then add failure paths: phone disconnects, Wi-Fi password is wrong, server rejects enrollment, device resets mid-process.

If the state machine cannot resume safely, the provisioning design is incomplete.

## The lesson to carry forward

A device becomes manageable when identity, credentials, ownership, and lifecycle are explicit.

The next lesson moves from identity to reachability: how an IoT device joins Wi-Fi, obtains network configuration, resolves services, and maintains connectivity under failure.
