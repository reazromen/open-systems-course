# Interactive component catalog (initial library)

The reusable foundation and fourteen tested behavior modules live in:

- `assets/interactive-course.js` — mount/reset/destroy lifecycle and accessible status support.
- `assets/interactive-course.css` — scoped interaction styles, focus-visible, reduced motion.
- `assets/interactive-simulations.js` — pure deterministic state transitions; no DOM dependency.
- `assets/interactive-prototypes.js` — DOM adapters and semantic controls.
- `assets/interactive-prototypes.css` — responsive standalone prototype layout.
- `prototypes/interactive-system-design.html` — example host page.

## Load balancer — `load-balancer`

- **Learning objective:** compare Round Robin with Least Connections while health and in-flight work change.
- **Inputs:** strategy; request limit (currently 12); per-server health; step/complete/replay/reset.
- **Outputs:** per-server requests and active connections; deterministic event log.
- **Invariants:** unhealthy servers receive no new requests; Least Connections ties use A → B → C; active connections decrement only when a pending request completes; no-healthy-server dispatch fails explicitly.
- **Accessibility/fallback:** native select and checkboxes/buttons, status region, event log; explanatory prose is always present.
- **Tests:** deterministic distribution, tie-breaking, health filtering, no-server failure, limit/reset.

## Cache — `cache-simulator`

- **Learning objective:** understand cache-aside misses, TTL boundaries, stale reads, and invalidation.
- **Inputs:** read; virtual-clock advance; database update; invalidation; TTL for future fills; reset.
- **Outputs:** cached/database values, expiry deadline, hits, misses, database calls, stale indicator, event log.
- **Invariants:** a hit requires `now < expiresAt`; expiry occurs at `now >= expiresAt`; database updates do not implicitly invalidate; only misses call the database in this model.
- **Accessibility/fallback:** native controls, status and textual stale-state explanation.
- **Tests:** hit/miss counters, exact expiry boundary, stale value after DB update, invalidation, TTL bounds, reset.

## Queue/worker — `queue-simulator`

- **Learning objective:** distinguish queued work from in-flight work and see how worker capacity creates backpressure.
- **Inputs:** add one job, add a burst of three, advance virtual time, reset.
- **Outputs:** queue depth/capacity, worker assignment and remaining ticks, completed jobs, rejected jobs, event log.
- **Invariants:** waiting queue capacity is six; two workers each take two ticks per job; only waiting jobs count against queue capacity; overflow rejects jobs explicitly.
- **Accessibility/fallback:** native buttons, metrics, waiting-queue list, status and event log.
- **Tests:** worker capacity, service ticks, backpressure, queue draining, reset, snapshot isolation.

## Retry/backoff/idempotency — `retry-simulator`

- **Learning objective:** see exponential backoff and why retries after a lost response can duplicate a committed side effect without idempotency.
- **Inputs:** send/retry, advance to next retry time, choose stable-key reuse before the first attempt, reset.
- **Outputs:** virtual clock, attempt count, next retry time, terminal status, committed side effects, event log.
- **Invariants:** scripted response sequence is timeout-after-commit, timeout-after-commit, success; delays are 1s then 2s; same idempotency key deduplicates to one side effect; distinct keys can commit three effects.
- **Accessibility/fallback:** native checkbox/buttons, textual event log and live status; policy cannot change mid-flight.
- **Tests:** backoff timing, early retry rejection, deduplication, duplicate-effect risk, terminal behavior, reset.

## SIP call flow — `sip-flow-explorer`

- **Learning objective:** follow a simplified call from INVITE/SDP offer through 180 Ringing, 200 OK/SDP answer, ACK, RTP media, and BYE.
- **Inputs:** previous/next step, toggle direct RTP vs SBC/media relay, reset.
- **Outputs:** current message, source/destination, signaling vs media plane, step sequence, event log.
- **Invariants:** 13 deterministic steps; registration is assumed complete; proxy Record-Route is assumed for dialog signaling; changing the relay changes only the media path.
- **Accessibility/fallback:** native checkbox/buttons, current-step text, sequence list, live status; no animated-only state.
- **Tests:** sequence bounds, media plane step, direct vs relayed media, reset and snapshot isolation.

## Data-structure operation costs — `data-structure-explorer`

- **Learning objective:** compare arrays, linked lists, hash tables, stacks, and queues under selected operations.
- **Inputs:** select structure and operation; apply operation; reset.
- **Outputs:** logical contents, size/capacity, simplified primitive-step count, complexity label, outcome and event log.
- **Invariants:** dynamic-array growth doubles capacity; this resize costs O(n) while append is O(1) amortized; linked-list pointer operations assume a head/tail pointer; hash-table costs are expected O(1) with worst-case O(n); queue costs assume head/tail or circular-buffer implementation.
- **Accessibility/fallback:** native selects/buttons and text-only contents/costs; no color-only state.
- **Tests:** resize and amortized append, linked-list traversal, hash collision caveat, stack LIFO, queue FIFO, invalid operation and reset.

## Graph/tree traversal — `graph-traversal-explorer`

- **Learning objective:** compare BFS queue behavior with DFS stack behavior on a fixed five-node topology.
- **Inputs:** choose graph vs tree, choose BFS vs DFS, visit next node, reset.
- **Outputs:** SVG graph with current/visited/frontier states, traversal order, frontier list, event log.
- **Invariants:** neighbor order is stable; discovered nodes are not enqueued twice; tree topology is acyclic and hides the graph-only cross-edge.
- **Accessibility/fallback:** SVG title/description plus equivalent textual visited order/frontier and native controls.
- **Tests:** deterministic BFS/DFS order, topology reset, acyclic tree adjacency, snapshot isolation.

## OS, file-I/O, and boot timelines — `os-timeline-explorer`

- **Learning objective:** trace a user/kernel system-call boundary, open/read/close file-descriptor lifecycle, or simplified Linux boot milestones.
- **Inputs:** select scenario, step backward/forward, reset.
- **Outputs:** current actor boundary, message/operation, explanatory text, full sequence and event log.
- **Invariants:** each scenario is deterministic; file descriptors are described as process-local integers; boot path is explicitly platform-dependent.
- **Accessibility/fallback:** native select/buttons and a text sequence; no animation required.
- **Tests:** scenario selection, sequence bounds, file-I/O transitions, boot milestones, snapshot isolation.

## CPU scheduler — `scheduler-explorer`

- **Learning objective:** compare FCFS with Round Robin under a fixed arrival/burst workload.
- **Inputs:** choose policy, advance one CPU tick, reset.
- **Outputs:** virtual time, running process, ready queue, process states/remaining burst/completion times, context switches, event log.
- **Invariants:** fixed workload P1=(arrival 0, burst 4), P2=(0,3), P3=(1,2); RR quantum is two ticks; later arrivals enter the ready queue at their arrival time.
- **Accessibility/fallback:** semantic table with row headers and textual ready queue/status.
- **Tests:** deterministic FCFS completion, RR quantum preemption, later arrival, reset.

## Virtual-memory translation — `virtual-memory-explorer`

- **Learning objective:** split a virtual address into page and offset, resolve a page-table frame, and detect a missing mapping.
- **Inputs:** virtual address 0–15 and translate/reset.
- **Outputs:** virtual page, offset, frame, physical address or page fault, fixed page table.
- **Invariants:** page size is four bytes; page 2 is absent; physical address is frame × page size + offset.
- **Accessibility/fallback:** numeric input, explicit textual formula/result, page-table list.
- **Tests:** valid translation, absent page, negative/non-integer/out-of-range addresses.

## Race-condition/lock interleaving — `race-condition-explorer`

- **Learning objective:** show a lost update when two increments read the same shared value and compare it with a serialized lock schedule.
- **Inputs:** choose unsynchronized vs locked schedule, advance one operation, reset.
- **Outputs:** shared counter, per-process local values, lock owner, next operation and event log.
- **Invariants:** unsynchronized schedule finishes at 1; serialized schedule finishes at 2; the schedule is fixed and illustrative.
- **Accessibility/fallback:** native controls and textual state/event log.
- **Tests:** lost update, locked increments, reset, defensive snapshots.

## Network packet path — `network-path-explorer`

- **Learning objective:** trace encapsulation and next-hop behavior on a same-subnet path versus a routed path, with TCP/UDP and MTU choices.
- **Inputs:** local/routed destination, TCP/UDP, payload size (500/1200/2000 bytes), MTU (900/1500 bytes), previous/next/reset.
- **Outputs:** current layer/hop, message and explanation, full sequence, path/transport/MTU labels and event log.
- **Invariants:** routed paths resolve the gateway MAC, decrement TTL 64→63, change link-layer addresses at the router, and preserve IP endpoints; MTU guidance distinguishes TCP segmentation from UDP fragmentation/PMTUD caveats.
- **Accessibility/fallback:** native selects/buttons and text sequence; no packet animation required.
- **Tests:** local vs routed path length, TTL and endpoint invariants, TCP/UDP guarantees, MTU diagnostic, invalid controls and reset.

## Protocol timelines — `protocol-timeline-explorer`

- **Learning objective:** inspect deterministic DNS, DHCP, NAT, TLS/certificate, routing, proxy/CDN, and layered-connection sequences.
- **Inputs:** select scenario, previous/next step, reset.
- **Outputs:** current actor/message/detail, full sequence, event log.
- **Invariants:** DNS distinguishes recursive caching/referrals/authoritative data; DHCP uses DORA; NAT uses an explicit reversible tuple; TLS identity validation precedes encrypted application data; routing separates control-plane route population from per-packet forwarding.
- **Accessibility/fallback:** native select/buttons, semantic sequence list and status region.
- **Tests:** DNS referrals/TTL, DHCP DORA order, NAT mapping/reverse translation, TLS validation order, routing/proxy distinctions, layered failure domains.

## CAP/quorum — `cap-explorer`

- **Learning objective:** see how partition reachability changes quorum progress and how availability-first operations can diverge.
- **Inputs:** consistency-first or availability-first policy; partition toggle; client side A vs B/C; read/write/reset.
- **Outputs:** replica values/versions, accepted/rejected operations, quorum status, event log.
- **Invariants:** majority quorum is 2 of 3; consistency-first operations fail on a one-replica minority; availability-first writes only to reachable replicas and may create divergent versions.
- **Accessibility/fallback:** native selects/buttons, status and event log; prose explicitly states simplifications and the partition-specific nature of CAP.
- **Tests:** minority failure, majority success, divergent partition writes, consistency-first read unavailability, healed network read.

## Shared contract

Every registered component returns `reset()` and `destroy()`; event listeners are registered through the lifecycle context. Animation is not used to advance state. CSS/SVG and textual state are sufficient; Anime.js is not justified by these prototypes and was not added.

## Coverage boundary

This is the initial reusable library, not the final component catalog for all 180 lessons. Request-flow, failure/recovery, capacity calculators, quizzes, and embedded-system timelines remain future components. Sixty-five lessons now link to these external companion exercises; the simulators are not yet embedded inline in lesson prose.
