# Phase 2 — Interactive system-design prototypes

**Status:** Fifteen isolated prototypes implemented and browser-smoke-tested. Seventy-three existing lesson source/output pairs link to the standalone companion lab; simulations are not yet embedded inline in lesson prose.

## Entry point

Open `prototypes/interactive-system-design.html` locally or serve the repository root and navigate to `/prototypes/interactive-system-design.html`. The page loads the dependency-free interaction framework, simulation models, and DOM adapters. Existing lesson pages link to this companion page but do not load the simulation scripts.

## Load balancing

- Two policies: Round Robin and Least Connections.
- Fixed 12-request scenario; step, replay, reset, and complete-oldest-request controls.
- Three independently tracked servers with health toggles, request counts, and active connection counts.
- Round Robin skips unhealthy servers. Least Connections picks the smallest active count and breaks ties deterministically A → B → C.
- Failed dispatch with no healthy servers is explicit; requests remain active until completed so the two algorithms have a meaningful connection count to compare.

## Caching

- Explicit virtual clock, configurable TTL (1–60 seconds in the model), cache entry expiry, hit/miss counters, and database-call count.
- Database updates do not silently invalidate the cache; the stale value is visible until invalidation or expiry.
- Expiry uses `now >= expiresAt`; TTL is applied to future fills.
- Counters describe this deterministic simulation only, not measured production performance.

## Queue and worker flow

- Two workers process jobs in deterministic two-tick intervals.
- Waiting-queue capacity is six jobs; jobs already assigned to workers do not consume waiting capacity.
- Add-one, add-burst, advance-tick, and reset controls expose queue depth, worker state, completions, and rejected work.
- The model demonstrates backpressure without pretending to measure real throughput or latency.

## Retry, exponential backoff, and idempotency

- Scripted outcomes: two timeouts after a side effect commits, then success.
- Retry delays grow from one to two virtual seconds.
- Reusing a stable idempotency key deduplicates the side effect; distinct keys demonstrate the duplicate-effect risk.
- The scenario is intentionally deterministic and does not simulate full SIP timer rules, random packet loss, or a production retry policy.

## DNS, DHCP, NAT, TLS, routing, and proxy timelines

- Seven selectable scenarios show DNS recursive lookup, DHCP DORA, stateful NAT mapping, TLS/certificate validation, route lookup, reverse proxy/CDN cache flow, and DNS→TCP→TLS→HTTP diagnosis.
- Each sequence is deterministic and includes a short explanation per step; the models are not packet captures or complete protocol state machines.
- The TLS scenario emphasizes hostname/chain/validity checks before trusting encrypted application data; the routing scenario separates precomputed control-plane routes from forwarding.

## Network packet path

- Compare a same-subnet Ethernet path with a remote destination reached through a router.
- Step through transport, IP addressing, ARP next-hop resolution, Ethernet framing, router TTL decrement, new L2 header, and transport demultiplexing.
- Switch TCP/UDP, payload size, and path MTU to compare reliable byte-stream semantics with UDP delivery and see MTU guidance. The model does not generate real packets or calculate actual fragment sequences.

## Operating-system, file-I/O, and boot timelines

- Select the user/kernel syscall boundary, file open/read/close sequence, or a simplified Linux boot path.
- The text sequence describes actor boundaries and key operations; no timeline animation is required.
- The boot scenario is intentionally generic because real firmware and service startup differ by platform/configuration.

## CPU scheduling

- Fixed process arrivals and CPU bursts let learners compare FCFS and Round Robin with a two-tick quantum.
- Each tick updates ready/running/completed states, remaining burst, completion time, and context-switch count.
- This is not a model of Linux CFS or real-time scheduling.

## Virtual-memory page-table translation

- A four-byte page size and small fixed page table make page number, offset, frame, physical address, and page fault visible.
- The model omits TLBs, multi-level tables, permissions, and actual hardware timing.

## Race conditions and locks

- A fixed unsynchronized interleaving demonstrates a lost update; a serialized lock schedule produces the expected two increments.
- The model illustrates an interleaving, not a full memory model or lock implementation.

## Data-structure operation costs

- Select dynamic array, linked list, hash table, stack, or queue and apply a compatible operation.
- Dynamic array starts full to demonstrate a resize; capacity doubles and the one resize costs O(n), while append is O(1) amortized.
- Linked-list operations state their head/tail assumptions; hash-table expected/worst-case costs and collision limitations are explicit.
- The model counts illustrative primitive steps and never presents them as elapsed time or benchmark results.

## Graph and tree traversal

- Switch between a five-node cyclic graph and an acyclic tree, then step through BFS or DFS.
- BFS uses a queue; DFS uses a stack; stable neighbor order makes the traversal repeatable.
- SVG node state is mirrored by textual visited order and frontier lists. The graph-only cross-edge is hidden in tree mode.

## SIP call flow

- Thirteen deterministic steps show INVITE/SDP offer, 180 Ringing, 200 OK/SDP answer, ACK, RTP media, and BYE.
- Assumptions: registration is complete, the proxy Record-Routes the dialog, and no authentication/forking/retransmission state machine is modeled.
- Toggle direct endpoint media versus a configured SBC/media relay; the SIP signaling sequence remains unchanged.
- The model explicitly distinguishes the signaling plane from RTP media and makes no claims about jitter, codec behavior, NAT traversal, or SIP timer accuracy.

## CAP

- Three replicas, stable versions, a two-of-three majority quorum, explicit network partition, and client-side selector (A vs B/C).
- Consistency-first rejects reads/writes without a majority; the majority side can make progress.
- Availability-first accepts operations on reachable replicas and can diverge across partitions.
- The prose describes the partition-specific consistency/availability trade-off, not a permanent universal “choose two” rule.
- This is an instructional quorum model, not a complete consensus protocol or a claim that every system's guarantees reduce to this simplified policy.

## Accessibility and resilience

- Native buttons, checkboxes, selects, labels, status regions, and event logs.
- Every state change has a textual outcome; color is not the sole signal.
- Reduced-motion media query and visible focus indicator.
- The models are pure deterministic state-transition functions in `assets/interactive-simulations.js`, separated from DOM adapters in `assets/interactive-prototypes.js`.

## Verification

Run:

~~~sh
node --test tests/interactive-course.test.cjs tests/interactive-simulations.test.cjs
node --check assets/interactive-course.js
node --check assets/interactive-simulations.js
node --check assets/interactive-prototypes.js
python3 -m unittest tests/test_render_course.py -v
python3 tools/render_course.py --check --lesson 107 --lesson 108 --lesson 113 --lesson 139 --lesson 143 --lesson 145 --lesson 146 --lesson 147 --lesson 149 --lesson 152
git diff --check
~~~

Verified in Firefox 157.0.1 with all twelve interactions mounted and no initialization errors or browser console events. At 390×844 CSS pixels, the prototype page body width was 362 px and document width 378 px (no horizontal overflow). Reduced-motion emulation was active, and keyboard focus received a visible 3 px outline. The committed smoke script is `tests/interactive-course-browser-smoke.cjs`; rerun before any deployment.

## Phase 2 exit decision

Fifteen representative behavior models are implemented and the deterministic unit tests pass. Seventy-three source/output lesson pairs link to the companion lab: Lessons 041–060, 071–110 (with the existing 107–108 links retained), 113, 131, 132, 134, 135, 139, 140, 143, 145, 146, 147, 149, and 152. These links are not yet inline embeds. The pinned body-only renderer is now reproducible for reviewed, selected Open Systems lessons. The canonical 180-lesson source/output gate now passes; further rollout remains gated on the separate companion-track provenance and additional reviewed batches.
