'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createLoadBalancer,createCache,createQueue,createRetry,createSipFlow,createDataStructure,createGraphTraversal,createTimeline,createScheduler,createVirtualMemory,createRaceSimulator,createNetworkPath,createProtocolTimeline,createCap}=require('../assets/interactive-simulations.js');

test('round robin distributes requests deterministically and tracks active work',()=>{
 const s=createLoadBalancer({count:6});
 assert.deepEqual(Array.from({length:6},()=>s.step().server),['A','B','C','A','B','C']);
 const x=s.snapshot();assert.deepEqual(x.servers.map(v=>v.requests),[2,2,2]);assert.deepEqual(x.servers.map(v=>v.active),[2,2,2]);
 assert.equal(s.complete().request.id,1);assert.deepEqual(s.snapshot().servers.map(v=>v.active),[1,2,2]);
});
test('least connections chooses lowest active count and stable A/B/C tie-break',()=>{
 const s=createLoadBalancer({strategy:'least-connections',count:5});
 assert.deepEqual(Array.from({length:3},()=>s.step().server),['A','B','C']);
 s.complete();assert.equal(s.step().server,'A');
 assert.deepEqual(s.snapshot().servers.map(v=>v.active),[1,1,1]);
});
test('unhealthy servers get no new requests and no-server condition fails explicitly',()=>{
 const s=createLoadBalancer({count:8});s.setHealthy('B',false);
 assert.deepEqual(Array.from({length:4},()=>s.step().server),['A','C','A','C']);
 s.setHealthy('A',false);s.setHealthy('C',false);
 assert.deepEqual(s.step(),{ok:false,reason:'unavailable'});
 assert.equal(s.snapshot().nextId,5);
});
test('request limit is stable and reset restores initial state',()=>{
 const s=createLoadBalancer({count:1});assert.equal(s.step().ok,true);assert.equal(s.step().reason,'limit');s.reset();assert.equal(s.snapshot().nextId,1);
});
test('cache miss fills cache; subsequent reads hit without database calls',()=>{
 const s=createCache({ttl:3});assert.deepEqual(s.read(),{hit:false,value:1});assert.deepEqual(s.read(),{hit:true,value:1});
 assert.deepEqual([s.snapshot().hits,s.snapshot().misses,s.snapshot().databaseCalls],[1,1,1]);
});
test('cache entry expires at TTL boundary and next read reloads database',()=>{
 const s=createCache({ttl:2});s.read();s.advance(2);assert.deepEqual(s.read(),{hit:false,value:1});assert.equal(s.snapshot().databaseCalls,2);
});
test('database updates can leave stale cache until invalidation or expiry',()=>{
 const s=createCache({ttl:5});s.read();s.updateDatabase();assert.deepEqual(s.read(),{hit:true,value:1});assert.equal(s.snapshot().dbValue,2);
 s.invalidate();assert.deepEqual(s.read(),{hit:false,value:2});
});
test('TTL validation rejects invalid values and reset clears counters',()=>{
 const s=createCache();assert.throws(()=>s.setTtl(0),/1–60/);assert.throws(()=>s.setTtl(61),/1–60/);
 s.read();s.reset();assert.deepEqual([s.snapshot().hits,s.snapshot().misses,s.snapshot().databaseCalls],[0,0,0]);
});
test('SIP flow follows the documented signaling sequence and step bounds',()=>{
 const s=createSipFlow();assert.equal(s.snapshot().current.message,'INVITE + SDP offer');assert.equal(s.snapshot().total,13);
 assert.equal(s.previous(),false);assert.equal(s.next(),true);assert.equal(s.snapshot().index,1);
 for(let i=0;i<20;i++)s.next();assert.equal(s.snapshot().index,12);assert.equal(s.next(),false);
 assert.equal(s.snapshot().current.message,'200 OK (BYE)');s.reset();assert.equal(s.snapshot().index,0);
});
test('SIP media relay changes the media path but not signaling steps',()=>{
 const s=createSipFlow();for(let i=0;i<8;i++)s.next();
 let x=s.snapshot();assert.equal(x.current.plane,'Media');assert.equal(x.current.to,'UA-B');
 s.setRelay(true);x=s.snapshot();assert.equal(x.current.to,'SBC / media relay → UA-B');assert.match(x.current.detail,/signaling and media are separate/);
 s.previous();assert.equal(s.snapshot().current.message,'ACK');s.next();assert.equal(s.snapshot().current.plane,'Media');
});
test('SIP flow snapshot is defensive and can be reset',()=>{
 const s=createSipFlow();const x=s.snapshot();x.sequence[0].message='corrupted';assert.equal(s.snapshot().sequence[0].message,'INVITE + SDP offer');
 s.next();s.reset();assert.equal(s.snapshot().index,0);assert.equal(s.snapshot().relay,false);
});
test('CAP consistency-first rejects writes from a minority partition and accepts majority',()=>{
 const s=createCap();s.setPartition(true);s.setSide('A');assert.deepEqual(s.write(),{ok:false,reason:'no-quorum'});
 s.setSide('BC');const w=s.write();assert.equal(w.ok,true);assert.deepEqual(w.nodes,['B','C']);
 assert.deepEqual(s.snapshot().replicas.map(r=>r.version),[1,2,2]);
});
test('CAP availability-first accepts writes on either partition and permits divergence',()=>{
 const s=createCap();s.setPolicy('availability');s.setPartition(true);s.setSide('A');assert.equal(s.write().ok,true);
 s.setSide('BC');assert.equal(s.write().ok,true);assert.deepEqual(s.snapshot().replicas.map(r=>r.version),[2,3,3]);
 s.setSide('A');assert.deepEqual(s.read(),{ok:true,value:2,replica:'A'});
});
test('CAP consistency-first reads require quorum; healed network exposes newest value',()=>{
 const s=createCap();s.setPartition(true);s.setSide('A');assert.deepEqual(s.read(),{ok:false,reason:'no-quorum'});
 s.setSide('BC');assert.equal(s.write().ok,true);s.setPartition(false);assert.deepEqual(s.read(),{ok:true,value:2,replica:'B'});
});
test('queue processes jobs with deterministic worker capacity and service ticks',()=>{
 const s=createQueue();s.burst(3);assert.equal(s.snapshot().queue.length,3);
 s.step();let x=s.snapshot();assert.deepEqual(x.workers.map(w=>w.job.id),[1,2]);assert.equal(x.queue.length,1);
 s.step();assert.equal(s.snapshot().completed.length,0);s.step();x=s.snapshot();assert.deepEqual(x.completed.map(j=>j.id),[1,2]);assert.deepEqual(x.workers.map(w=>w.job&&w.job.id),[3,null]);assert.equal(x.queue.length,0);
});
test('queue applies backpressure to waiting jobs and reset clears counters',()=>{
 const s=createQueue();assert.deepEqual(s.burst(7),{accepted:6,rejected:1});assert.equal(s.snapshot().rejected,1);
 s.step();assert.equal(s.snapshot().queue.length,4);s.reset();assert.equal(s.snapshot().now,0);assert.equal(s.snapshot().rejected,0);
});
test('queue snapshots are isolated from internal state',()=>{
 const s=createQueue();s.enqueue();const x=s.snapshot();x.queue[0].id=99;assert.equal(s.snapshot().queue[0].id,1);
});
test('retry model enforces exponential backoff and deduplicates with a stable key',()=>{
 const s=createRetry();const first=s.send();assert.deepEqual([first.delay,first.deduplicated,s.snapshot().sideEffects],[1,false,1]);
 assert.deepEqual(s.send(),{ok:false,reason:'backoff'});s.advanceToRetry();const second=s.send();assert.deepEqual([second.delay,second.deduplicated,s.snapshot().sideEffects],[2,true,1]);
 s.advanceToRetry();const third=s.send();assert.deepEqual([third.outcome,third.deduplicated,s.snapshot().sideEffects],['success',true,1]);
 assert.deepEqual(s.send(),{ok:false,reason:'terminal'});
});
test('retry model without idempotency-key reuse can commit duplicate effects',()=>{
 const s=createRetry();s.setIdempotency(false);s.send();s.advanceToRetry();s.send();s.advanceToRetry();s.send();assert.equal(s.snapshot().sideEffects,3);
});
test('idempotency policy cannot be changed mid-flight and reset restores it',()=>{
 const s=createRetry();s.send();assert.equal(s.setIdempotency(false),false);assert.equal(s.snapshot().reuseKey,true);s.reset();assert.equal(s.snapshot().attempt,0);assert.equal(s.setIdempotency(false),true);
});

test('data structure explorer reports array resize and amortized append costs',()=>{
 const s=createDataStructure();assert.deepEqual(s.perform('read-index').complexity,'O(1)');
 const first=s.perform('append');assert.equal(first.steps,5);assert.match(first.complexity,/O\(n\).*amortized/);assert.equal(s.snapshot().states.array.capacity,8);
 const second=s.perform('append');assert.equal(second.complexity,'O(1) amortized');
});
test('linked list operations distinguish pointer rewiring from traversal',()=>{
 const s=createDataStructure();s.setStructure('linked-list');
 assert.equal(s.perform('insert-front').complexity,'O(1)');assert.equal(s.perform('read-index').complexity,'O(n)');assert.equal(s.snapshot().states['linked-list'].items[0],'X');
});
test('hash table explains expected versus worst-case complexity',()=>{
 const s=createDataStructure();s.setStructure('hash-table');const r=s.perform('lookup-key');
 assert.equal(r.complexity,'Expected O(1); worst-case O(n)');assert.match(r.note,/collisions/);
});
test('stack is LIFO and queue is FIFO under their stated implementations',()=>{
 const s=createDataStructure();s.setStructure('stack');assert.match(s.perform('pop').outcome,/Popped D/);
 s.setStructure('queue');assert.match(s.perform('dequeue').outcome,/Dequeued A/);assert.match(s.snapshot().lastResult.note,/head pointer/);
});
test('data structure operation compatibility and reset are enforced',()=>{
 const s=createDataStructure();assert.throws(()=>s.perform('pop'),/Unsupported operation/);s.setStructure('queue');s.perform('enqueue');s.reset();assert.equal(s.snapshot().structure,'array');assert.equal(s.snapshot().states.queue.items.length,4);
});
test('BFS uses a queue and visits nodes in deterministic breadth-first order',()=>{
 const s=createGraphTraversal();while(s.step()){}assert.deepEqual(s.snapshot().order,['A','B','C','D','E']);assert.equal(s.snapshot().frontier.length,0);assert.equal(s.step(),false);
});
test('DFS uses a stack and produces a different deterministic traversal',()=>{
 const s=createGraphTraversal();s.setAlgorithm('dfs');while(s.step()){}assert.deepEqual(s.snapshot().order,['A','B','D','C','E']);
});
test('graph traversal algorithm change resets state and snapshots are isolated',()=>{
 const s=createGraphTraversal();s.step();s.setAlgorithm('dfs');assert.deepEqual(s.snapshot().order,[]);assert.equal(s.snapshot().algorithm,'dfs');
 const x=s.snapshot();x.adjacency.A.push('Z');assert.equal(s.snapshot().adjacency.A.includes('Z'),false);
});
test('tree topology is acyclic and retains the chosen traversal algorithm',()=>{
 const s=createGraphTraversal();s.setAlgorithm('dfs');s.setTopology('tree');assert.equal(s.snapshot().algorithm,'dfs');assert.equal(s.snapshot().topology,'tree');
 while(s.step()){}assert.deepEqual(s.snapshot().order,['A','B','D','C','E']);assert.deepEqual(s.snapshot().adjacency.C,['A','E']);
});
test('OS timeline changes scenarios and preserves bounded step navigation',()=>{
 const s=createTimeline();assert.equal(s.snapshot().current.message,'Program requests a privileged operation');
 for(let i=0;i<20;i++)s.next();assert.equal(s.snapshot().index,4);assert.equal(s.next(),false);
 s.setScenario('fileio');assert.equal(s.snapshot().total,6);assert.equal(s.snapshot().current.message,'open(path, flags)');
 s.next();assert.equal(s.snapshot().current.message,'Resolve path and permissions');s.reset();assert.equal(s.snapshot().index,0);
});
test('OS timeline covers boot milestones and returns a defensive snapshot',()=>{
 const s=createTimeline();s.setScenario('boot');assert.equal(s.snapshot().total,6);
 const x=s.snapshot();x.sequence[0].message='changed';assert.equal(s.snapshot().sequence[0].message,'Initialize platform');
});
test('FCFS scheduler runs jobs to completion in arrival order',()=>{
 const s=createScheduler();s.setAlgorithm('fcfs');while(!s.done())s.step();
 const x=s.snapshot();assert.deepEqual(x.processes.map(p=>p.completion),[4,7,9]);assert.ok(x.processes.every(p=>p.remaining===0));assert.equal(s.done(),true);
});
test('Round Robin scheduler preempts at quantum boundaries and admits later arrivals',()=>{
 const s=createScheduler();while(!s.done())s.step();const x=s.snapshot();
 assert.deepEqual(x.processes.map(p=>p.completion),[8,9,6]);assert.ok(x.contextSwitches>1);assert.ok(x.events.some(e=>e.includes('quantum')));
});
test('scheduler reset and policy changes restart all process state',()=>{
 const s=createScheduler();s.step();s.setAlgorithm('fcfs');assert.equal(s.snapshot().time,0);assert.ok(s.snapshot().processes.every(p=>p.remaining===p.burst));
});
test('virtual-memory translation computes frame and offset correctly',()=>{
 const s=createVirtualMemory();assert.deepEqual(s.translate(6),{address:6,page:1,offset:2,frame:0,physicalAddress:2,pageFault:false,explanation:'Physical address = frame 0 × page size 4 + offset 2.'});
 assert.deepEqual(s.translate(15),{address:15,page:3,offset:3,frame:5,physicalAddress:23,pageFault:false,explanation:'Physical address = frame 5 × page size 4 + offset 3.'});
});
test('virtual-memory translation reports page faults and rejects invalid addresses',()=>{
 const s=createVirtualMemory();assert.equal(s.translate(8).pageFault,true);assert.equal(s.translate(8).physicalAddress,null);
 assert.throws(()=>s.translate(16),/0 to 15/);assert.throws(()=>s.translate(-1),/0 to 15/);assert.throws(()=>s.translate(2.5),/0 to 15/);
});
test('unsynchronized increment loses an update while lock schedule serializes increments',()=>{
 const s=createRaceSimulator();while(s.step()){}assert.equal(s.snapshot().counter,1);
 s.setMode('lock');while(s.step()){}assert.equal(s.snapshot().counter,2);assert.equal(s.snapshot().lockOwner,null);
});
test('race simulator reset preserves mode and snapshots are defensive',()=>{
 const s=createRaceSimulator();s.setMode('lock');s.step();const x=s.snapshot();x.events.push('bad');assert.equal(s.snapshot().events.includes('bad'),false);s.reset();assert.equal(s.snapshot().mode,'lock');assert.equal(s.snapshot().counter,0);
});
test('network path distinguishes same-subnet frames from routed hops',()=>{
 const s=createNetworkPath();let x=s.snapshot();assert.equal(x.current.message,'Create application payload');assert.equal(x.total,9);
 s.setScenario('routed');x=s.snapshot();assert.equal(x.total,11);for(let i=0;i<6;i++)s.next();x=s.snapshot();assert.equal(x.current.message,'Strip L2 header and route IP packet');assert.match(x.current.detail,/TTL 64 → 63/);assert.match(x.current.detail,/192\.0\.2\.10 → 198\.51\.100\.20/);
});
test('network path distinguishes TCP and UDP guarantees',()=>{
 const s=createNetworkPath();s.setTransport('udp');let x=s.snapshot();assert.equal(x.current.message,'Create application payload');for(let i=0;i<7;i++)s.next();x=s.snapshot();assert.equal(x.current.message,'Deliver UDP datagram');assert.match(x.current.detail,/does not acknowledge or retransmit/);
 s.setTransport('tcp');while(s.next()){}assert.equal(s.snapshot().current.message,'Application receives data');
});
test('network path reports TCP segmentation and UDP MTU/fragmentation caveats',()=>{
 const s=createNetworkPath();s.setPayload(2000);s.setMtu(900);for(let i=0;i<3;i++)s.next();assert.match(s.snapshot().current.detail,/TCP should segment/);
 s.setTransport('udp');for(let i=0;i<3;i++)s.next();assert.match(s.snapshot().current.detail,/IPv4 fragmentation may occur/);
});
test('network path control validation, navigation, and reset are deterministic',()=>{
 const s=createNetworkPath();assert.equal(s.previous(),false);assert.throws(()=>s.setPayload(123),/Payload must be/);assert.throws(()=>s.setMtu(1200),/MTU must be/);
 s.next();s.reset();assert.equal(s.snapshot().index,0);assert.equal(s.snapshot().transport,'tcp');
});
test('DNS timeline separates recursive cache, referrals, and authoritative answer',()=>{
 const s=createProtocolTimeline();assert.equal(s.snapshot().total,6);assert.match(s.snapshot().sequence[0].detail,/name is not itself an IP/);
 s.next();assert.equal(s.snapshot().current.message,'Check resolver cache');for(let i=0;i<3;i++)s.next();assert.equal(s.snapshot().current.message,'Ask for the final record');
 s.next();assert.match(s.snapshot().current.detail,/TTL/);
});
test('DHCP timeline presents the DORA message order',()=>{
 const s=createProtocolTimeline();s.setScenario('dhcp');assert.deepEqual(s.snapshot().sequence.map(x=>x.message),['DHCPDISCOVER','DHCPOFFER','DHCPREQUEST','DHCPACK']);
 while(s.next()){}assert.equal(s.snapshot().current.message,'DHCPACK');
});
test('NAT timeline keeps an explicit reversible address/port mapping',()=>{
 const s=createProtocolTimeline();s.setScenario('nat');s.next();assert.match(s.snapshot().current.detail,/10[.]0[.]0[.]10:51514 ↔ 203[.]0[.]113[.]5:62001/);
 for(let i=0;i<3;i++)s.next();assert.equal(s.snapshot().current.message,'Reverse translation');assert.match(s.snapshot().current.detail,/10[.]0[.]0[.]10:51514/);
});
test('TLS timeline validates identity before encrypted application data',()=>{
 const s=createProtocolTimeline();s.setScenario('tls');assert.equal(s.snapshot().sequence[0].message,'ClientHello (SNI / ALPN)');
 s.next();s.next();assert.equal(s.snapshot().current.message,'Validate certificate identity and chain');s.next();s.next();assert.equal(s.snapshot().current.message,'Encrypted application data');
});
test('routing and proxy timelines distinguish forwarding from application-layer routing',()=>{
 const s=createProtocolTimeline();s.setScenario('routing');s.next();assert.equal(s.snapshot().current.message,'Longest-prefix route lookup');assert.match(s.snapshot().current.detail,/not run anew for each packet/);
 s.setScenario('proxy');s.next();assert.equal(s.snapshot().current.message,'Check cache policy and key');s.next();assert.equal(s.snapshot().current.message,'Forward on cache miss');
});
test('layered connection timeline keeps DNS, TCP, TLS, and HTTP failure domains separate',()=>{
 const s=createProtocolTimeline();s.setScenario('connection');assert.deepEqual(s.snapshot().sequence.map(x=>x.message),['Resolve service name','Establish TCP connection','Negotiate and validate TLS','Send application request']);
 assert.match(s.snapshot().sequence[0].detail,/TCP and TLS have not started/);assert.match(s.snapshot().sequence[2].detail,/certificate identity/);
});
test('HTTP message timeline separates request line, headers, status, and body',()=>{
 const s=createProtocolTimeline();s.setScenario('http');assert.equal(s.snapshot().sequence[0].message,'Request line: GET /items/7 HTTP/1.1');
 s.next();assert.match(s.snapshot().current.detail,/Accept/);s.next();assert.equal(s.snapshot().current.message,'Response status and headers');s.next();assert.equal(s.snapshot().current.message,'Response body');
});
test('HTTP method timeline explains safe and idempotent semantics without conflating them',()=>{
 const s=createProtocolTimeline();s.setScenario('methods');const x=s.snapshot().sequence;
 assert.match(x[0].detail,/safe and idempotent/);assert.match(x[1].detail,/idempotent/);assert.match(x[3].detail,/not inherently idempotent/);assert.match(x[4].detail,/final-state semantics/);
});
test('browser timeline proceeds from URL parsing through subresources and paint',()=>{
 const s=createProtocolTimeline();s.setScenario('browser');assert.equal(s.snapshot().total,6);s.next();assert.equal(s.snapshot().current.message,'Resolve host and connect');
 for(let i=0;i<4;i++)s.next();assert.equal(s.snapshot().current.message,'Build layout and paint');
});
test('session timeline includes Set-Cookie, later Cookie, and server-side logout',()=>{
 const s=createProtocolTimeline();s.setScenario('sessions');const all=s.snapshot().sequence.map(x=>x.message);
 assert.ok(all.includes('Create session and return Set-Cookie'));assert.ok(all.includes('Send Cookie on a matching request'));assert.ok(all.includes('Logout: invalidate session and clear cookie'));
});
test('CORS timeline distinguishes preflight permission from browser response access',()=>{
 const s=createProtocolTimeline();s.setScenario('cors');assert.equal(s.snapshot().sequence[1].message,'Preflight OPTIONS (when required)');
 s.next();s.next();s.next();assert.equal(s.snapshot().current.message,'Send actual request if preflight passes');s.next();assert.match(s.snapshot().current.detail,/not a firewall/);
});
test('header negotiation and API validation timelines expose response contracts',()=>{
 const s=createProtocolTimeline();s.setScenario('headers');assert.match(s.snapshot().sequence[0].message,/Accept/);s.next();assert.match(s.snapshot().current.detail,/Vary/);
 s.setScenario('api');s.next();assert.equal(s.snapshot().current.message,'Validate required fields and types');s.next();assert.match(s.snapshot().current.detail,/stack traces/);
});
test('all simulation snapshots are copies and cannot mutate internal state',()=>{
 const s=createLoadBalancer();const snap=s.snapshot();snap.servers[0].requests=999;assert.equal(s.snapshot().servers[0].requests,0);
});
