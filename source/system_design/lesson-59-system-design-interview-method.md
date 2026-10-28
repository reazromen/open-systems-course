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

## Learning Objectives

- Use a repeatable structure for system design interviews.

- Prioritize requirements, rough estimates, and critical data flows.

- Communicate trade-offs, failure handling, and operational concerns clearly.

## Worked Example

In a 35-minute URL-shortener interview, spending 25 minutes listing technologies leaves little time to reason about the core design.

**Reasoning:** Clarify requirements first, estimate read/write load, sketch the API and data path, deep-dive into code generation or hot reads, then cover failures, security, and trade-offs before summarizing.

## Check Your Understanding

What should you do before selecting a database or cache?

- A. Clarify requirements and estimate the workload.

- B. Choose the most popular database.

- C. Draw every possible component.

**Answer and explanation:** A — requirements and workload drive the architecture; technology choices should follow the problem rather than lead it.

## Common Pitfall

Rushing to a polished diagram without explaining assumptions, constraints, or why the design fits.

## Practice Hint

Use time boxes and narrate assumptions. State what you are optimizing for and what you are deliberately not solving.

## Self-Check

Can you present a system design with requirements, estimates, architecture, one deep dive, failure modes, and trade-offs?

## Key Takeaways

Follow a repeatable structure: requirements, estimates, high-level design, deep dive, failure modes, trade-offs, and summary.

## Practice Exercise

Practice a 35-minute URL-shortener design: five minutes requirements, five estimates, ten architecture, ten failures/scaling, five summary.
