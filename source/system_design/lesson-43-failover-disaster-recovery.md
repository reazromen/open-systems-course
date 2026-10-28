# Lesson 43 — Failover and Disaster Recovery

**Course:** System Design — From the Ground Up  
**Module 8 — Reliability, Security, and Observability**

## Lesson Overview

Failover moves work away from a failed component; disaster recovery restores service after a major disruption such as regional loss, data corruption, or destructive operator error. Recovery needs defined targets, protected data, and rehearsed procedures.

## RTO and RPO

Recovery Time Objective (RTO) is the target time to restore service after a disruption. Recovery Point Objective (RPO) is the maximum targeted amount of data loss measured in time. A low RPO generally requires more frequent or continuous data protection; a low RTO requires ready capacity and practiced recovery steps.

## Backups and Replicas Solve Different Problems

Replicas can reduce downtime when a node fails, but may copy accidental deletion or corruption. Backups provide recoverable historical states if protected and retained appropriately. Store backup copies with access controls and failure isolation so a compromised production account cannot automatically destroy every recovery copy.

## Plan the Recovery Path

Document who declares a disaster, how infrastructure is provisioned, how data is restored, how traffic is redirected, and how consistency is validated. Dependencies such as DNS, identity, secrets, certificates, and network configuration are part of recovery too.

## Test, Measure, Improve

A backup is not proven until restoration has been tested. Conduct recovery exercises, measure actual RTO and RPO, record gaps, and update the runbook. Test partial failures as well as full-region scenarios, and ensure responders can access procedures when the primary systems are unavailable.

## Key Takeaways

Define RTO and RPO, isolate backups from production failures, document dependencies, and rehearse restoration. A backup that has never been restored is an unverified assumption.

## Practice Exercise

A business can tolerate losing at most five minutes of data and needs to restore service within one hour. State its RPO and RTO, then list two controls you would validate in a recovery test.

## Next Lesson

Lesson 44 — Authentication and Authorization
