# Lesson 30 — Capacity Estimation

**Course:** System Design — From the Ground Up  
**Module 5 — Scalability and Performance**

## Learning Objectives
- Convert user activity into rough request and storage estimates.
- Use peak traffic rather than averages alone.
- State assumptions and validate them with measurements.

## Core Concept
Capacity estimation is a way to reason about scale before building or buying infrastructure. Start with explicit assumptions: active users, actions per user, payload sizes, peak-to-average ratio, retention, and replication overhead. Estimates are approximations, not guarantees.

## Worked Example
Suppose 100,000 daily active users each make 20 API requests per day. That is 2,000,000 requests/day, or about 23 requests/second on average (2,000,000 ÷ 86,400). If peak traffic is five times average, plan to test around 115 requests/second, then measure real behavior under load.

## Common Pitfall
Treating average traffic as the peak requirement, or forgetting retries, background jobs, indexes, replicas, and data retention.

## Knowledge Check
1. What is 2 million requests per day divided by 86,400 seconds?
   - **Answer:** Approximately 23 requests per second on average.
2. Why add a peak factor?
   - **Answer:** Traffic is uneven; bursts can exceed the daily average substantially.

## Practice Hint
Estimate daily writes, average request rate, peak request rate, and annual raw storage for a service you use.

## Self-Check
Can someone else reproduce your estimate from the assumptions and arithmetic you wrote down?

## Next Lesson

Lesson 31
