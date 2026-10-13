---
title: "OTA Updates: Images, Signatures, Rollback, and Fleet Safety"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-128-ota-updates-images-signatures-rollback-and-fleet-safety.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "An OTA update is a distributed deployment to machines you may never physically reach. Safe updates require image identity, authenticated manifests, atomic slot switching, rollback, staged rollout, and observability."
eyebrow: "Open Systems Course · Lesson 128 of 180"
---

Firmware update is one of the most powerful features in an IoT product.

It is also one of the easiest ways to brick an entire fleet remotely.

OTA should be treated like a distributed transaction with an adversarial network and unreliable power.

## The artifact needs identity

A firmware image should have stable metadata:

product/hardware target;
version;
build identifier;
image length;
cryptographic hash;
compatibility requirements.

Do not trust a filename such as latest.bin.

The device should know exactly which artifact it is being asked to install.

## Integrity and authenticity are different

A hash detects whether bytes changed.

A digital signature can prove that an authorized signer approved a manifest or image when key management is correct.

If an attacker can replace both image and unsigned hash, the hash does not protect authenticity.

Secure update systems need an authenticated trust root.

IETF SUIT specifications describe a manifest architecture for firmware updates on constrained devices.

## Download and activation should be separate

A safer flow is:

discover update;
download inactive image;
verify metadata/hash/signature;
check hardware compatibility;
mark candidate;
reboot into candidate;
run health checks;
confirm image;
otherwise rollback.

The old working image remains available until the new one proves viable.

This is the firmware equivalent of blue/green deployment.

## Power loss must be survivable

Power can fail while downloading or writing flash.

The active image should not be destroyed before a complete replacement is verified.

Partitioned A/B layouts are common because they isolate the running image from the candidate image.

Metadata updates that switch boot slots must themselves be crash-safe.

## Rollback is a policy, not a reboot

A device can boot the new image and still be broken:

Wi-Fi driver crashes after three minutes;
sensor no longer initializes;
memory leak exhausts RAM after an hour.

A useful rollback design needs a health window.

The device confirms the new image only after critical functions operate successfully.

If watchdog resets or boot failures occur repeatedly before confirmation, bootloader policy can return to the previous slot.

## Data compatibility can block rollback

Firmware version N+1 may migrate persistent data into a format version N cannot read.

Then binary rollback succeeds but application state is incompatible.

OTA planning therefore includes persistent-schema compatibility.

Possible strategies:

backward-compatible migrations;
dual readers;
versioned configuration;
migration only after image confirmation.

Firmware and data evolve together.

## Staged rollout limits blast radius

Do not deploy new firmware to 100 percent of the fleet first.

A rollout can progress:

internal devices;
small canary group;
1 percent;
10 percent;
regional/production cohorts;
full fleet.

At each stage, compare:

boot success;
crash/reset rate;
connectivity;
power behavior;
telemetry quality;
application-specific health.

Pause automatically when health regresses.

## Version policy prevents unintended downgrade

A signed old image can still contain known vulnerabilities.

Anti-rollback policy can prevent devices from installing versions below a security threshold.

This must be designed carefully because emergency recovery may need controlled downgrade.

Security version and product version are not always the same concept.

## Update transport is not the trust model

The image can be downloaded over HTTPS.

That protects the transport session.

Image signing protects the artifact even if it is mirrored, cached, or stored elsewhere.

Using both gives layered protection.

Do not make “downloaded over TLS” the only proof that firmware is authentic.

## Delta updates trade bandwidth for complexity

A delta update sends the difference between versions rather than a full image.

That can reduce data cost.

It requires the device to have exactly the expected base version and enough safe temporary space to reconstruct/verify the result.

For small firmware images, full-image A/B updates may be simpler and safer.

Optimize after measuring fleet bandwidth.

## OTA must be observable

For every device, record states such as:

eligible;
offered;
downloading;
verified;
pending reboot;
booted candidate;
confirmed;
rolled back;
failed with reason.

“Version 2.4 rollout 70 percent” is not enough.

You need to know where the remaining 30 percent stopped.

## Practical design exercise

Create an OTA state machine for an ESP32-class device with two application slots.

Include failures:

download interrupted;
hash mismatch;
signature invalid;
flash write error;
power loss;
first boot crash;
network unavailable after update;
persistent schema incompatible.

For every failure, specify which image boots next and what evidence is reported.

Do not change secure-boot/eFuse settings on hardware merely for the exercise.

## The lesson to carry forward

OTA is remote deployment under harsh failure assumptions.

The next lesson steps back from one device and looks at the fleet as a whole: inventory, versions, health, cohorts, metrics, and remote diagnosis.
