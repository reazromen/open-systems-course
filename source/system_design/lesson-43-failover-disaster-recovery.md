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

## Learning Objectives

- Define recovery time objective (RTO) and recovery point objective (RPO).

- Explain why backups and replicas solve different problems.

- Plan and test a disaster-recovery path.

## Worked Example

A service must return within 60 minutes and can tolerate at most 5 minutes of lost data.

**Reasoning:** Set RTO to 60 minutes and RPO to 5 minutes. Validate backup frequency, restore time, credentials, infrastructure dependencies, and integrity checks in a timed recovery exercise.

## Check Your Understanding

Which metric describes the maximum tolerable amount of lost recent data?

- A. RTO

- B. RPO

- C. MTTR only

**Answer and explanation:** B — RPO is the acceptable data-loss window; RTO is the target time to restore service.

## Common Pitfall

A replica can copy accidental deletion or corruption quickly. Replication is not a substitute for versioned, recoverable backups.

## Practice Hint

Write down the business tolerance first, then test whether the actual restore process meets both targets.

## Self-Check

Can you define RTO and RPO in plain language and describe a test that measures each?

## Key Takeaways

Define RTO and RPO, isolate backups from production failures, document dependencies, and rehearse restoration. A backup that has never been restored is an unverified assumption.

## Practice Exercise

A business can tolerate losing at most five minutes of data and needs to restore service within one hour. State its RPO and RTO, then list two controls you would validate in a recovery test.

## Next Lesson

Lesson 44 — Authentication and Authorization
