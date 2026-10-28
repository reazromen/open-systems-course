# Lesson 59: System Design Interview Method

System design interviews evaluate reasoning through open-ended problems. A strong answer is not the most complicated architecture; it is a clear sequence of decisions tied to requirements and trade-offs.

## Clarify scope

Ask about user actions, scale, read/write patterns, geography, latency, availability, privacy, and constraints. If unknown, state assumptions and proceed rather than designing every possible feature.

## Estimate what matters

Estimate users, requests per second, data size, and bandwidth when they affect architecture. Show arithmetic and distinguish average from peak; estimates should inform decisions.

## Draw the high-level design

Start with clients, APIs, core services, stores, and justified asynchronous components. Explain a critical request end to end before adding complexity.

## Deep-dive on the hardest part

Choose the riskiest component, such as feed fan-out, inventory correctness, delivery, or partitioning. Discuss data model, consistency, retries, and failure behavior rather than listing technologies.

## Discuss trade-offs and operations

Compare alternatives and explain when the decision would change. Cover security, monitoring, deployment, backups, and recovery at the right level, then summarize limitations.

## Key Takeaways

Follow a repeatable structure: requirements, estimates, high-level design, deep dive, failure modes, trade-offs, and summary.

## Practice Exercise

Practice a 35-minute URL-shortener design: five minutes requirements, five estimates, ten architecture, ten failures/scaling, five summary.
