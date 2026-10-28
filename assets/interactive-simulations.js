/* Deterministic, side-effect-free state transitions for course simulations. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CourseSimulations = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function createLoadBalancer(options) {
    const opts = Object.assign({ strategy: 'round-robin', count: 12 }, options || {});
    const initial = () => ({ strategy: opts.strategy, count: opts.count, nextId: 1, rr: 0,
      servers: [{id:'A',healthy:true,requests:0,active:0},{id:'B',healthy:true,requests:0,active:0},{id:'C',healthy:true,requests:0,active:0}],
      pending: [], events: [] });
    let state = initial();
    function log(message) { state.events.unshift(message); state.events = state.events.slice(0, 12); }
    function setStrategy(strategy) { if (!['round-robin','least-connections'].includes(strategy)) throw new TypeError('Unknown strategy'); state.strategy = strategy; }
    function setHealthy(id, healthy) { const s=state.servers.find(x=>x.id===id); if(!s) throw new TypeError('Unknown server'); s.healthy=!!healthy; log('Server '+id+' '+(healthy?'marked healthy':'marked unhealthy')+'.'); }
    function step() {
      if (state.nextId > state.count) { log('Configured request limit reached.'); return {ok:false,reason:'limit'}; }
      const live=state.servers.filter(s=>s.healthy);
      if (!live.length) { log('Request '+state.nextId+' failed: no healthy server is available.'); return {ok:false,reason:'unavailable'}; }
      let target;
      if (state.strategy==='round-robin') {
        for(let i=0;i<state.servers.length;i++){const candidate=state.servers[(state.rr+i)%state.servers.length];if(candidate.healthy){target=candidate;state.rr=(state.rr+i+1)%state.servers.length;break;}}
      } else {
        target=live.reduce((best,s)=>!best||s.active<best.active? s:best,null); // stable A/B/C tie-break
      }
      const request={id:state.nextId++,server:target.id};
      target.requests++;target.active++;state.pending.push(request);
      log('Request '+request.id+' assigned to '+target.id+' ('+(state.strategy==='round-robin'?'Round Robin':'Least Connections')+').');
      return {ok:true,request,server:target.id};
    }
    function complete() {
      const request=state.pending.shift();
      if(!request){log('No active request to complete.');return {ok:false};}
      const server=state.servers.find(s=>s.id===request.server);server.active=Math.max(0,server.active-1);
      log('Request '+request.id+' completed on '+server.id+'.');
      return {ok:true,request};
    }
    function reset(){state=initial();}
    function snapshot(){return JSON.parse(JSON.stringify(state));}
    return {step,complete,reset,setStrategy,setHealthy,snapshot};
  }

  function createCache(options) {
    const opts=Object.assign({ttl:5},options||{});
    const initial=()=>({now:0,ttl:Math.max(1,Number(opts.ttl)||5),dbValue:1,cache:null,hits:0,misses:0,databaseCalls:0,events:['Cache empty; database holds value v1.']});
    let state=initial();
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,10);}
    function read(){
      if(state.cache && state.now < state.cache.expiresAt){state.hits++;log('HIT: returned cached v'+state.cache.value+'.');return {hit:true,value:state.cache.value};}
      if(state.cache){log('EXPIRED: cached value passed its TTL.');state.cache=null;}
      state.misses++;state.databaseCalls++;state.cache={value:state.dbValue,expiresAt:state.now+state.ttl};
      log('MISS: database call fetched v'+state.dbValue+'; expires at t='+state.cache.expiresAt+'.');
      return {hit:false,value:state.dbValue};
    }
    function advance(seconds){const n=Math.max(0,Number(seconds)||0);state.now+=n;log('Clock advanced '+n+'s to t='+state.now+'.');}
    function updateDatabase(){state.dbValue++;log('Database updated to v'+state.dbValue+'; cached copy was not invalidated.');}
    function invalidate(){state.cache=null;log('Cache invalidated explicitly.');}
    function setTtl(ttl){const n=Number(ttl);if(!Number.isFinite(n)||n<1||n>60)throw new RangeError('TTL must be 1–60 seconds');state.ttl=n;log('TTL set to '+n+' seconds for future fills.');}
    function reset(){state=initial();}
    function snapshot(){return JSON.parse(JSON.stringify(state));}
    return {read,advance,updateDatabase,invalidate,setTtl,reset,snapshot};
  }

  function createQueue(options) {
    const opts=Object.assign({capacity:6,serviceTicks:2,workers:2},options||{});
    const initial=()=>({now:0,nextId:1,capacity:opts.capacity,serviceTicks:opts.serviceTicks,queue:[],workers:Array.from({length:opts.workers},(_,i)=>({id:'W'+(i+1),job:null,remaining:0})),completed:[],rejected:0,events:['Queue empty; two workers are idle.']});
    let state=initial();
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,12);}
    function enqueue(){
      if(state.queue.length>=state.capacity){state.rejected++;log('BACKPRESSURE: queue is full; new job rejected.');return {ok:false,reason:'full'};}
      const job={id:state.nextId++};state.queue.push(job);log('Job '+job.id+' enqueued.');return {ok:true,job};
    }
    function burst(count){let accepted=0;for(let i=0;i<count;i++)if(enqueue().ok)accepted++;return {accepted,rejected:count-accepted};}
    function step(){
      state.now++;
      state.workers.forEach(w=>{if(w.job){w.remaining--;if(w.remaining<=0){state.completed.push(w.job);log('Worker '+w.id+' completed job '+w.job.id+'.');w.job=null;w.remaining=0;}}});
      state.workers.forEach(w=>{if(!w.job&&state.queue.length){w.job=state.queue.shift();w.remaining=state.serviceTicks;log('Worker '+w.id+' started job '+w.job.id+' ('+w.remaining+' ticks).');}});
      return snapshot();
    }
    function reset(){state=initial();}
    function snapshot(){return JSON.parse(JSON.stringify(state));}
    return {enqueue,burst,step,reset,snapshot};
  }

  function createRetry() {
    const initial=()=>({now:0,attempt:0,maxAttempts:3,baseDelay:1,nextRetryAt:null,status:'ready',reuseKey:true,processedKeys:[],sideEffects:0,events:['Scripted outcome: timeout after commit, timeout after commit, then success.']});
    let state=initial();
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,12);}
    function setIdempotency(v){if(state.attempt>0){log('Reset before changing idempotency-key policy.');return false;}state.reuseKey=!!v;log('Idempotency-key reuse '+(state.reuseKey?'enabled':'disabled')+'.');return true;}
    function send(){
      if(state.status==='succeeded'||state.status==='failed'){log('Request is terminal; reset to try again.');return {ok:false,reason:'terminal'};}
      if(state.status==='waiting'&&state.now<state.nextRetryAt){log('Retry blocked by backoff until t='+state.nextRetryAt+'.');return {ok:false,reason:'backoff'};}
      state.attempt++;
      const key=state.reuseKey?'order-42':'order-42-attempt-'+state.attempt;
      let deduplicated=state.processedKeys.includes(key);
      if(!deduplicated){state.processedKeys.push(key);state.sideEffects++;}
      if(state.attempt<state.maxAttempts){
        const delay=state.baseDelay*Math.pow(2,state.attempt-1);
        state.status='waiting';state.nextRetryAt=state.now+delay;
        log('Attempt '+state.attempt+': response timed out after commit; '+(deduplicated?'same idempotency key deduplicated the effect':'server committed an effect')+'. Retry in '+delay+'s at t='+state.nextRetryAt+'.');
        return {ok:true,attempt:state.attempt,outcome:'timeout-after-commit',delay,deduplicated,key};
      }
      state.status='succeeded';state.nextRetryAt=null;
      log('Attempt '+state.attempt+': success returned; '+(deduplicated?'effect was deduplicated':'a new effect was committed')+'.');
      return {ok:true,attempt:state.attempt,outcome:'success',deduplicated,key};
    }
    function advanceToRetry(){if(state.status!=='waiting'||state.nextRetryAt==null){log('No scheduled retry to advance to.');return false;}state.now=state.nextRetryAt;state.status='ready';log('Virtual clock advanced to t='+state.now+'.');return true;}
    function reset(){state=initial();}
    function snapshot(){return JSON.parse(JSON.stringify(state));}
    return {send,setIdempotency,advanceToRetry,reset,snapshot};
  }

  function createSipFlow(options) {
    const initial=()=>({index:0,relay:!!(options&&options.relay),events:['Registration is assumed complete; a proxy Record-Route keeps dialog signaling on the proxy path.']});
    let state=initial();
    const sequence=()=>[
      {from:'UA-A',to:'Proxy',message:'INVITE + SDP offer',plane:'Signaling',detail:'Caller proposes media addresses, codecs, and session parameters.'},
      {from:'Proxy',to:'UA-B',message:'INVITE + SDP offer',plane:'Signaling',detail:'Proxy resolves the called party and forwards the request.'},
      {from:'UA-B',to:'Proxy',message:'180 Ringing',plane:'Signaling',detail:'Provisional response: the destination is alerting.'},
      {from:'Proxy',to:'UA-A',message:'180 Ringing',plane:'Signaling',detail:'The proxy forwards the provisional response to the caller.'},
      {from:'UA-B',to:'Proxy',message:'200 OK + SDP answer',plane:'Signaling',detail:'The destination accepts and answers the media offer.'},
      {from:'Proxy',to:'UA-A',message:'200 OK + SDP answer',plane:'Signaling',detail:'Caller receives the accepted session and negotiated answer.'},
      {from:'UA-A',to:'Proxy',message:'ACK',plane:'Signaling',detail:'Caller acknowledges the successful INVITE response.'},
      {from:'Proxy',to:'UA-B',message:'ACK',plane:'Signaling',detail:'Proxy forwards the ACK under the assumed dialog route set.'},
      {from:'UA-A',to:state.relay?'SBC / media relay → UA-B':'UA-B',message:'RTP media',plane:'Media',detail:state.relay?'Media packets traverse a configured relay/SBC; signaling and media are separate flows.':'Media packets flow directly between the endpoints in this simplified topology.'},
      {from:'UA-A',to:'Proxy',message:'BYE',plane:'Signaling',detail:'Caller ends the established dialog.'},
      {from:'Proxy',to:'UA-B',message:'BYE',plane:'Signaling',detail:'Proxy forwards the in-dialog request.'},
      {from:'UA-B',to:'Proxy',message:'200 OK (BYE)',plane:'Signaling',detail:'Destination confirms dialog termination.'},
      {from:'Proxy',to:'UA-A',message:'200 OK (BYE)',plane:'Signaling',detail:'Caller receives confirmation that the dialog has ended.'}
    ];
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,8);}
    function next(){if(state.index<sequence().length-1){state.index++;log('Advanced to step '+(state.index+1)+': '+sequence()[state.index].message+'.');return true;}return false;}
    function previous(){if(state.index>0){state.index--;log('Returned to step '+(state.index+1)+': '+sequence()[state.index].message+'.');return true;}return false;}
    function setRelay(v){state.relay=!!v;log('Media path set to '+(state.relay?'relay/SBC':'direct endpoint-to-endpoint')+'.');}
    function reset(){state=initial();}
    function snapshot(){return JSON.parse(JSON.stringify({...state,sequence:sequence(),total:sequence().length,current:sequence()[state.index]}));}
    return {next,previous,setRelay,reset,snapshot};
  }

  function createDataStructure() {
    const initial=()=>({structure:'array',states:{
      array:{items:['A','B','C','D'],capacity:4},
      'linked-list':{items:['A','B','C','D'],hasTail:true},
      'hash-table':{keys:['A','B','C','D']},
      stack:{items:['A','B','C','D']},
      queue:{items:['A','B','C','D']}
    },lastResult:null,events:['Initial contents: A, B, C, D. Operation costs are teaching estimates, not benchmarks.']});
    const actions={
      array:[['read-index','Read index 2'],['append','Append X'],['insert-front','Insert X at front'],['remove-front','Remove front item'],['search','Search for D']],
      'linked-list':[['read-index','Read index 2'],['append','Append X (tail pointer)'],['insert-front','Insert X at front'],['remove-front','Remove front item'],['search','Search for D']],
      'hash-table':[['lookup-key','Look up key D'],['insert-key','Insert key X'],['delete-key','Delete key A']],
      stack:[['push','Push X'],['pop','Pop top'],['peek','Peek at top']],
      queue:[['enqueue','Enqueue X'],['dequeue','Dequeue front'],['peek','Peek at front']]
    };
    let state=initial();
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,10);}
    function setStructure(name){if(!actions[name])throw new TypeError('Unknown data structure');state.structure=name;state.lastResult=null;log('Selected '+name+'.');}
    function perform(action){
      if(!actions[state.structure].some(x=>x[0]===action))throw new TypeError('Unsupported operation for '+state.structure);
      const d=state.states[state.structure],items=d.items||d.keys||[],n=items.length;
      let result={action,label:actions[state.structure].find(x=>x[0]===action)[1],complexity:'O(1)',steps:1,outcome:'No state change.',note:''};
      const linearSearch=(list,key)=>{const i=list.indexOf(key);return {index:i,steps:i<0?list.length: i+1};};
      if(state.structure==='array'){
        if(action==='read-index'){result.outcome=n>2?'Read index 2 → '+items[2]:'Index 2 is out of range.';result.steps=1;result.complexity='O(1)';}
        else if(action==='append'){if(n>=d.capacity){const old=d.capacity;d.capacity*=2;d.items.push('X');result.steps=n+1;result.complexity='O(n) for this resize; O(1) amortized';result.outcome='Resized capacity '+old+' → '+d.capacity+' and appended X.';}else{d.items.push('X');result.outcome='Appended X without resizing.';result.complexity='O(1) amortized';}}
        else if(action==='insert-front'){d.items.unshift('X');result.steps=n+1;result.complexity='O(n)';result.outcome='Inserted X; existing '+n+' elements shifted.';}
        else if(action==='remove-front'){if(n)d.items.shift();result.steps=Math.max(1,n);result.complexity='O(n)';result.outcome=n?'Removed front item; remaining elements shift.':'Array was empty.';}
        else if(action==='search'){const q=linearSearch(d.items,'D');result.steps=q.steps;result.complexity='O(n)';result.outcome=q.index<0?'D not found after scanning '+q.steps+' element(s).':'Found D at index '+q.index+' after '+q.steps+' comparison(s).';}
      } else if(state.structure==='linked-list'){
        if(action==='read-index'){result.steps=Math.min(n,3);result.complexity='O(n)';result.outcome=n>2?'Traversed nodes to read index 2 → '+items[2]:'Index 2 is out of range.';}
        else if(action==='append'){d.items.push('X');result.outcome='Added X using the tail pointer.';result.note='Assumes the list maintains a tail pointer.';}
        else if(action==='insert-front'){d.items.unshift('X');result.outcome='Repointed the head to X.';result.note='Pointer rewiring is constant work; existing nodes are not shifted.';}
        else if(action==='remove-front'){if(n)d.items.shift();result.outcome=n?'Moved the head pointer to the next node.':'List was empty.';result.note='Pointer rewiring is constant work.';}
        else if(action==='search'){const q=linearSearch(d.items,'D');result.steps=q.steps;result.complexity='O(n)';result.outcome=q.index<0?'D not found after '+q.steps+' node(s).':'Found D after visiting '+q.steps+' node(s).';}
      } else if(state.structure==='hash-table'){
        if(action==='lookup-key'){const found=d.keys.includes('D');result.outcome=found?'Found key D.':'Key D not found.';result.complexity='Expected O(1); worst-case O(n)';result.note='Assumes a well-distributed hash and does not simulate collisions.';}
        else if(action==='insert-key'){const had=d.keys.includes('X');if(!had)d.keys.push('X');result.outcome=had?'Key X already exists.':'Inserted key X.';result.complexity='Expected O(1); worst-case O(n)';result.note='Assumes a well-distributed hash and no resize event.';}
        else if(action==='delete-key'){const i=d.keys.indexOf('A');if(i>=0)d.keys.splice(i,1);result.outcome=i>=0?'Deleted key A.':'Key A was absent.';result.complexity='Expected O(1); worst-case O(n)';result.note='Assumes a well-distributed hash and does not simulate collisions.';}
      } else if(state.structure==='stack'){
        if(action==='push'){d.items.push('X');result.outcome='Pushed X onto the top.';}
        else if(action==='pop'){result.outcome=n?'Popped '+d.items.pop()+' from the top.':'Stack was empty.';}
        else if(action==='peek'){result.outcome=n?'Top is '+d.items[n-1]+'.':'Stack was empty.';}
      } else if(state.structure==='queue'){
        if(action==='enqueue'){d.items.push('X');result.outcome='Enqueued X at the tail.';result.note='Assumes a circular buffer or head/tail queue implementation.';}
        else if(action==='dequeue'){result.outcome=n?'Dequeued '+d.items.shift()+' from the front.':'Queue was empty.';result.note='Conceptual O(1) with a head pointer/circular buffer; not JavaScript Array.shift() cost.';}
        else if(action==='peek'){result.outcome=n?'Front is '+d.items[0]+'.':'Queue was empty.';result.note='Assumes a queue with a head pointer.';}
      }
      result.sizeAfter=(d.items||d.keys||[]).length;state.lastResult=result;log(result.label+': '+result.outcome+' Complexity: '+result.complexity+'.');return JSON.parse(JSON.stringify(result));
    }
    function reset(){state=initial();}
    function snapshot(){return JSON.parse(JSON.stringify(state));}
    function actionsFor(name){return (actions[name]||[]).map(x=>({value:x[0],label:x[1]}));}
    return {setStructure,perform,reset,snapshot,actionsFor};
  }

  function createGraphTraversal() {
    const topologies={graph:{A:['B','C'],B:['A','D'],C:['A','D','E'],D:['B','C'],E:['C']},tree:{A:['B','C'],B:['A','D'],C:['A','E'],D:['B'],E:['C']}};
    const initial=(algorithm,topology)=>({algorithm:algorithm||'bfs',topology:topology||'graph',frontier:['A'],discovered:['A'],visited:[],current:null,order:[],events:['Start at node A. Neighbors are processed in stable order.']});
    let state=initial('bfs','graph');
    function adjacency(){return topologies[state.topology];}
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,10);}
    function setAlgorithm(algorithm){if(!['bfs','dfs'].includes(algorithm))throw new TypeError('Unknown traversal');state=initial(algorithm,state.topology);log('Traversal reset to '+algorithm.toUpperCase()+'.');}
    function setTopology(topology){if(!Object.prototype.hasOwnProperty.call(topologies,topology))throw new TypeError('Unknown topology');state=initial(state.algorithm,topology);log('Topology changed to '+topology+'.');}
    function step(){
      if(!state.frontier.length){log('Traversal complete; no nodes remain in the frontier.');return false;}
      const node=state.algorithm==='bfs'?state.frontier.shift():state.frontier.pop();
      state.current=node;state.visited.push(node);state.order.push(node);
      const neighbors=adjacency()[node].slice();
      if(state.algorithm==='dfs')neighbors.reverse();
      neighbors.forEach(next=>{if(!state.discovered.includes(next)){state.discovered.push(next);state.frontier.push(next);}});
      log(state.algorithm.toUpperCase()+' visited '+node+'; frontier is '+(state.frontier.join(', ')||'empty')+'.');
      return true;
    }
    function reset(){state=initial(state.algorithm,state.topology);}
    function snapshot(){return JSON.parse(JSON.stringify({...state,adjacency:adjacency()}));}
    return {setAlgorithm,setTopology,step,reset,snapshot};
  }

  function createTimeline() {
    const scenarios={
      syscall:[
        {from:'User mode',to:'CPU / architecture',message:'Program requests a privileged operation',detail:'The application calls a system-call wrapper with arguments.'},
        {from:'CPU / architecture',to:'Kernel mode',message:'Trap / syscall entry',detail:'The CPU transfers control to a configured kernel entry point and changes privilege level.'},
        {from:'Kernel',to:'Kernel',message:'Validate and perform operation',detail:'The kernel checks arguments and permissions before touching protected resources.'},
        {from:'Kernel mode',to:'CPU / architecture',message:'Return from syscall',detail:'The kernel places a result or error code in the calling convention.'},
        {from:'CPU / architecture',to:'User mode',message:'Application resumes',detail:'The process continues in user mode and handles the result.'}
      ],
      boot:[
        {from:'Power on',to:'Firmware / UEFI',message:'Initialize platform',detail:'Firmware performs early hardware initialization and chooses a boot target.'},
        {from:'Firmware / UEFI',to:'Bootloader',message:'Load bootloader',detail:'Firmware transfers control to the configured bootloader.'},
        {from:'Bootloader',to:'Linux kernel',message:'Load kernel and initramfs',detail:'The bootloader passes boot parameters and the initial RAM filesystem.'},
        {from:'Linux kernel',to:'PID 1 / systemd',message:'Initialize kernel and start PID 1',detail:'The kernel initializes core subsystems and starts the first userspace process.'},
        {from:'PID 1 / systemd',to:'System services',message:'Start configured units',detail:'Dependencies and service ordering determine which units are started.'},
        {from:'System services',to:'Login / application',message:'System becomes usable',detail:'The target is reached when required services are ready; exact milestones vary by system.'}
      ],
      fileio:[
        {from:'Process',to:'Kernel',message:'open(path, flags)',detail:'The process asks the kernel to open a named file.'},
        {from:'Kernel VFS',to:'Filesystem / storage',message:'Resolve path and permissions',detail:'The kernel resolves directory entries and checks access permissions.'},
        {from:'Kernel',to:'Process',message:'Return file descriptor',detail:'A small process-local integer refers to the open file description.'},
        {from:'Process',to:'Kernel',message:'read(fd, buffer, length)',detail:'The process uses the descriptor, not the original path, for the read.'},
        {from:'Kernel / page cache',to:'Process',message:'Return bytes or error',detail:'The kernel supplies available data or reports an error; storage I/O may be involved.'},
        {from:'Process',to:'Kernel',message:'close(fd)',detail:'The process releases its descriptor reference.'}
      ]
    };
    const initial=(scenario)=>({scenario:scenario||'syscall',index:0,events:['Choose a scenario and step through its conceptual boundaries.']});
    let state=initial('syscall');
    function sequence(){return scenarios[state.scenario];}
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,8);}
    function setScenario(s){if(!scenarios[s])throw new TypeError('Unknown timeline scenario');state=initial(s);log('Scenario changed to '+s+'.');}
    function next(){if(state.index<sequence().length-1){state.index++;log('Advanced to '+sequence()[state.index].message+'.');return true;}return false;}
    function previous(){if(state.index>0){state.index--;log('Returned to '+sequence()[state.index].message+'.');return true;}return false;}
    function reset(){state=initial(state.scenario);}
    function snapshot(){return JSON.parse(JSON.stringify({...state,sequence:sequence(),total:sequence().length,current:sequence()[state.index],scenarios:Object.keys(scenarios)}));}
    return {setScenario,next,previous,reset,snapshot};
  }

  function createScheduler() {
    const specs=[{id:'P1',arrival:0,burst:4},{id:'P2',arrival:0,burst:3},{id:'P3',arrival:1,burst:2}];
    const initial=(algorithm)=>({algorithm:algorithm||'rr',quantum:2,time:0,processes:specs.map(p=>({...p,remaining:p.burst,state:'new',completion:null})),ready:[],running:null,slice:0,contextSwitches:0,lastRunning:null,events:['Processes: P1 arrives at t0 (4 ticks), P2 at t0 (3 ticks), P3 at t1 (2 ticks).']});
    let state=initial('rr');
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,12);}
    function admit(){state.processes.filter(p=>p.state==='new'&&p.arrival<=state.time).forEach(p=>{p.state='ready';state.ready.push(p.id);log(p.id+' arrived and entered the ready queue.');});}
    function setAlgorithm(a){if(!['fcfs','rr'].includes(a))throw new TypeError('Unknown scheduling policy');state=initial(a);log('Policy set to '+a.toUpperCase()+'.');}
    function step(){
      admit();
      if(!state.running&&state.ready.length){state.running=state.algorithm==='fcfs'?state.ready.shift():state.ready.shift();state.slice=state.quantum;const p=state.processes.find(x=>x.id===state.running);p.state='running';if(state.lastRunning!==state.running)state.contextSwitches++;state.lastRunning=state.running;log(state.running+' dispatched to CPU.');}
      if(!state.running){log('No runnable process; scheduler is idle.');state.time++;admit();return snapshot();}
      const p=state.processes.find(x=>x.id===state.running);p.remaining--;state.time++;if(state.algorithm==='rr')state.slice--;
      if(p.remaining<=0){p.state='complete';p.completion=state.time;log(p.id+' completed at t='+state.time+'.');state.running=null;state.slice=0;}
      else if(state.algorithm==='rr'&&state.slice<=0){p.state='ready';state.ready.push(p.id);log(p.id+' exhausted its '+state.quantum+'-tick quantum and returned to the ready queue.');state.running=null;}
      admit();return snapshot();
    }
    function reset(){state=initial(state.algorithm);}
    function snapshot(){return JSON.parse(JSON.stringify(state));}
    function done(){return state.processes.every(p=>p.state==='complete');}
    return {setAlgorithm,step,reset,snapshot,done};
  }

  function createVirtualMemory() {
    const pageSize=4,table={0:2,1:0,2:null,3:5};
    function translate(address){
      const n=Number(address);
      if(!Number.isInteger(n)||n<0||n>=pageSize*Object.keys(table).length)throw new RangeError('Virtual address must be an integer from 0 to 15');
      const page=Math.floor(n/pageSize),offset=n%pageSize,frame=table[page];
      if(frame===null)return {address:n,page,offset,frame:null,physicalAddress:null,pageFault:true,explanation:'Virtual page '+page+' is not present in this page table; translation raises a page fault.'};
      return {address:n,page,offset,frame,physicalAddress:frame*pageSize+offset,pageFault:false,explanation:'Physical address = frame '+frame+' × page size '+pageSize+' + offset '+offset+'.'};
    }
    function snapshot(){return {pageSize,table:Object.entries(table).map(([page,frame])=>({page:Number(page),frame,present:frame!==null}))};}
    return {translate,snapshot};
  }

  function createRaceSimulator() {
    const initial=(mode)=>({mode:mode||'race',index:0,counter:0,locals:{A:null,B:null},lockOwner:null,events:['Shared counter starts at 0. Each process intends to increment it once.']});
    let state=initial('race');
    const schedules={
      race:[['A','read'],['B','read'],['A','write'],['B','write']],
      lock:[['A','lock'],['A','read'],['A','write'],['A','unlock'],['B','lock'],['B','read'],['B','write'],['B','unlock']]
    };
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,10);}
    function setMode(m){if(!schedules[m])throw new TypeError('Unknown concurrency mode');state=initial(m);log('Mode set to '+m+'.');}
    function step(){
      const action=schedules[state.mode][state.index];if(!action){log('Schedule complete.');return false;}
      const [process,op]=action;
      if(op==='lock'){state.lockOwner=process;log(process+' acquired the lock.');}
      else if(op==='unlock'){state.lockOwner=null;log(process+' released the lock.');}
      else if(op==='read'){state.locals[process]=state.counter;log(process+' read shared counter '+state.counter+'.');}
      else if(op==='write'){state.counter=state.locals[process]+1;log(process+' wrote '+state.counter+' using its local copy.');}
      state.index++;return true;
    }
    function reset(){state=initial(state.mode);}
    function snapshot(){return JSON.parse(JSON.stringify({...state,total:schedules[state.mode].length,complete:state.index>=schedules[state.mode].length,next:schedules[state.mode][state.index]||null}));}
    return {setMode,step,reset,snapshot};
  }

  function createNetworkPath() {
    const initial=(scenario,transport,payloadBytes,mtu)=>({scenario:scenario||'lan',transport:transport||'tcp',payloadBytes:payloadBytes||1200,mtu:mtu||1500,index:0,events:['Uses documentation-only addresses and a simplified IPv4/Ethernet path.']});
    let state=initial('lan','tcp',1200,1500);
    function sequence(){
      const remote=state.scenario==='routed',tcp=state.transport==='tcp',src='192.0.2.10',dst=remote?'198.51.100.20':'192.0.2.20';
      const bytes=state.payloadBytes+(tcp?40:28),mtuDetail=bytes<=state.mtu?'Estimated packet size '+bytes+' bytes fits the selected '+state.mtu+'-byte MTU.':tcp?'Estimated packet size '+bytes+' bytes exceeds MTU '+state.mtu+'; TCP should segment data to fit the path MSS. This model does not calculate each segment.':'Estimated datagram size '+bytes+' bytes exceeds MTU '+state.mtu+'; IPv4 fragmentation may occur if allowed, or the packet may be dropped and require PMTUD. This model does not create fragments.';
      const steps=[
        {from:'Application',to:'Transport',message:'Create application payload',detail:'The application supplies '+state.payloadBytes+' bytes for '+dst+'.'},
        {from:'Transport',to:'IP',message:tcp?'TCP segment':'UDP datagram',detail:tcp?'TCP adds source/destination ports and sequence state; reliability is provided by TCP, not IP.':'UDP adds ports and length but does not guarantee delivery, ordering, or retransmission.'},
        {from:'IP',to:'Host network stack',message:'Add IP source and destination',detail:'Source '+src+'; destination '+dst+'. IP addresses identify the end hosts, not the next Ethernet hop.'},
        {from:'Network stack',to:'Path MTU check',message:'Check packet size against MTU',detail:mtuDetail},
        {from:'Host',to:remote?'Default gateway':'Destination host',message:'Resolve next-hop MAC with ARP',detail:remote?'The destination is remote, so ARP resolves the default gateway MAC on the local link.':'The destination is on the same subnet, so ARP resolves the destination host MAC.'},
        {from:'Host NIC',to:remote?'Router ingress':'Destination NIC',message:'Transmit Ethernet frame',detail:remote?'Frame destination MAC is the gateway MAC; the IP destination remains '+dst+'.':'Switching forwards the frame within the LAN using its destination MAC.'}
      ];
      if(remote)steps.push(
        {from:'Router ingress',to:'Router IP forwarding',message:'Strip L2 header and route IP packet',detail:'The router removes the incoming Ethernet header, decrements TTL 64 → 63, and performs a route lookup. IP source/destination remain '+src+' → '+dst+'.'},
        {from:'Router egress',to:'Next-hop NIC',message:'Wrap packet in a new Ethernet frame',detail:'The outgoing frame uses new link-layer addresses. MAC addresses change per link; IP endpoints remain the same.'}
      );
      steps.push(
        {from:'Destination IP',to:'Transport demultiplexer',message:'Deliver IP payload to transport',detail:'Destination host validates the IP packet and uses the protocol and destination port to select the socket.'},
        {from:'Transport',to:'Application socket',message:tcp?'Reassemble ordered TCP byte stream':'Deliver UDP datagram',detail:tcp?'TCP handles sequencing, acknowledgements, and retransmission as needed; the application sees a byte stream.':'UDP delivers a datagram if it arrives; the transport layer does not acknowledge or retransmit it.'},
        {from:'Socket',to:'Application',message:'Application receives data',detail:'The application consumes the received bytes. This simplified path omits checksum failures, routing policy, VLANs, tunnels, and real retransmission timers.'}
      );
      return steps;
    }
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,8);}
    function setScenario(v){if(!['lan','routed'].includes(v))throw new TypeError('Unknown network path');state.scenario=v;state.index=0;log('Path changed to '+v+'.');}
    function setTransport(v){if(!['tcp','udp'].includes(v))throw new TypeError('Unknown transport');state.transport=v;state.index=0;log('Transport changed to '+v.toUpperCase()+'.');}
    function setPayload(v){const n=Number(v);if(![500,1200,2000].includes(n))throw new RangeError('Payload must be 500, 1200, or 2000 bytes');state.payloadBytes=n;state.index=0;log('Payload set to '+n+' bytes.');}
    function setMtu(v){const n=Number(v);if(![900,1500].includes(n))throw new RangeError('MTU must be 900 or 1500 bytes');state.mtu=n;state.index=0;log('Path MTU set to '+n+' bytes.');}
    function next(){if(state.index<sequence().length-1){state.index++;log('Advanced to '+sequence()[state.index].message+'.');return true;}return false;}
    function previous(){if(state.index>0){state.index--;log('Returned to '+sequence()[state.index].message+'.');return true;}return false;}
    function reset(){state.index=0;state.events=['Network path reset; scenario settings retained.'];}
    function snapshot(){return JSON.parse(JSON.stringify({...state,sequence:sequence(),total:sequence().length,current:sequence()[state.index]}));}
    return {setScenario,setTransport,setPayload,setMtu,next,previous,reset,snapshot};
  }

  function createProtocolTimeline() {
    const scenarios={
      dns:[
        {from:'Application / stub',to:'Recursive resolver',message:'Query name and record type',detail:'The stub asks for an address record for example.test; the name is not itself an IP address.'},
        {from:'Recursive resolver',to:'Cache',message:'Check resolver cache',detail:'A valid cached answer can avoid upstream queries until its TTL expires.'},
        {from:'Recursive resolver',to:'Root server',message:'Ask where the TLD is served',detail:'On a cache miss, the root referral points toward the relevant top-level-domain servers; the root usually does not return the final host address.'},
        {from:'Recursive resolver',to:'TLD server',message:'Follow TLD referral',detail:'The TLD referral identifies authoritative name servers for the requested zone.'},
        {from:'Recursive resolver',to:'Authoritative server',message:'Ask for the final record',detail:'The authoritative server returns the zone data or an appropriate negative answer.'},
        {from:'Recursive resolver',to:'Stub / application',message:'Return and cache answer',detail:'The answer is cached according to its TTL; the application can then connect to the returned address.'}
      ],
      dhcp:[
        {from:'New host',to:'Local network',message:'DHCPDISCOVER',detail:'The host broadcasts to discover available DHCP servers before it has a usable lease.'},
        {from:'DHCP server',to:'Host',message:'DHCPOFFER',detail:'A server offers configuration such as an address, lease duration, gateway, and DNS resolvers.'},
        {from:'Host',to:'Local network',message:'DHCPREQUEST',detail:'The host requests one offer; this also lets other servers know which offer was selected.'},
        {from:'DHCP server',to:'Host',message:'DHCPACK',detail:'The server acknowledges the lease and configuration; the host can configure the interface.'}
      ],
      nat:[
        {from:'Private host',to:'NAT gateway',message:'Outbound flow: 10.0.0.10:51514',detail:'A private source address/port and remote destination identify the outgoing flow.'},
        {from:'NAT gateway',to:'NAT state table',message:'Create translated mapping',detail:'Example mapping: 10.0.0.10:51514 ↔ 203.0.113.5:62001. The public tuple is illustrative.'},
        {from:'NAT gateway',to:'Remote server',message:'Forward translated packet',detail:'The packet leaves with the translated public source tuple; NAT is stateful address/port translation, not encryption.'},
        {from:'Remote server',to:'NAT public tuple',message:'Return packet',detail:'The response is addressed to 203.0.113.5:62001.'},
        {from:'NAT state table',to:'Private host',message:'Reverse translation',detail:'The gateway matches the existing mapping and forwards the response to 10.0.0.10:51514.'}
      ],
      tls:[
        {from:'Client',to:'Server',message:'ClientHello (SNI / ALPN)',detail:'The client offers protocol parameters and may indicate the intended server name and application protocol.'},
        {from:'Server',to:'Client',message:'ServerHello and certificate flight',detail:'The server negotiates parameters and presents its certificate chain and handshake proof.'},
        {from:'Client',to:'Trust validation',message:'Validate certificate identity and chain',detail:'The client checks the requested hostname, trust chain, validity period, and other policy requirements. Encryption alone does not prove the intended identity.'},
        {from:'Client and server',to:'Handshake completion',message:'Derive keys and verify Finished messages',detail:'Both peers confirm the handshake transcript and establish traffic keys. Details vary by TLS version and configuration.'},
        {from:'Client',to:'Server',message:'Encrypted application data',detail:'Application bytes are protected in transit; TLS does not by itself guarantee the application is safe or the endpoint is trustworthy beyond validation.'}
      ],
      routing:[
        {from:'Host',to:'Routing table',message:'Choose next hop',detail:'The host compares the destination with its local subnet and normally sends remote traffic to a configured gateway.'},
        {from:'Router',to:'Forwarding table',message:'Longest-prefix route lookup',detail:'The router chooses a forwarding entry and next hop. BGP and other routing protocols populate control-plane routes; they are not run anew for each packet.'},
        {from:'Router ingress',to:'Router egress',message:'Forward packet to next hop',detail:'The router decrements TTL/hop limit and rebuilds the link-layer header for the outgoing link.'},
        {from:'Transit networks',to:'Destination network',message:'Repeat hop-by-hop forwarding',detail:'The path is a sequence of local next-hop decisions; the route can change with policy and topology.'},
        {from:'Destination network',to:'Destination host',message:'Deliver to destination subnet',detail:'The final router resolves the destination host on its local link and forwards the packet.'}
      ],
      proxy:[
        {from:'Client',to:'CDN / reverse proxy',message:'Send HTTP request',detail:'The client connects to the edge or reverse proxy rather than directly to the origin application.'},
        {from:'Proxy',to:'Cache',message:'Check cache policy and key',detail:'A valid cache hit may be served at the edge; authorization and cache-control rules determine whether reuse is safe.'},
        {from:'Proxy',to:'Origin server',message:'Forward on cache miss',detail:'The proxy can route, apply policy, terminate TLS, and forward a request to an origin.'},
        {from:'Origin server',to:'Proxy',message:'Return response',detail:'The proxy may apply response policy and caching rules before sending the response to the client.'},
        {from:'Proxy / CDN',to:'Client',message:'Return HTTP response',detail:'The client sees the proxy response; logs and tracing help distinguish client, edge, and origin failures.'}
      ],
      http:[
        {from:'HTTP client',to:'HTTP server',message:'Request line: GET /items/7 HTTP/1.1',detail:'The method, target, and protocol version define the request line.'},
        {from:'HTTP client',to:'HTTP server',message:'Request headers',detail:'Host identifies the authority; Accept describes preferred representations; Authorization may carry credentials.'},
        {from:'HTTP server',to:'HTTP client',message:'Response status and headers',detail:'The status line reports the result; Content-Type identifies the representation and Cache-Control guides caching.'},
        {from:'HTTP server',to:'HTTP client',message:'Response body',detail:'The body contains the selected representation when the response semantics include one. HTTP is a message protocol, not a browser rendering engine.'}
      ],
      methods:[
        {from:'Client',to:'Resource',message:'GET: read current representation',detail:'GET is safe and idempotent by intended semantics: repeating it should not request a state change.'},
        {from:'Client',to:'Resource',message:'PUT: replace resource with value X',detail:'PUT is idempotent by intended semantics: repeating the same replacement has the same final resource state.'},
        {from:'Client',to:'Resource',message:'Repeat the same PUT',detail:'The response code may differ, but the intended final resource state remains X.'},
        {from:'Client',to:'Resource',message:'POST: create a new order',detail:'POST is not inherently idempotent; repeating it can create multiple resources unless the application adds an idempotency mechanism.'},
        {from:'Client',to:'Resource',message:'DELETE: make resource absent',detail:'DELETE is idempotent in intended final-state semantics, although response codes and side effects may differ between attempts.'}
      ],
      browser:[
        {from:'Address bar',to:'URL parser',message:'Parse scheme, host, port, and path',detail:'The browser determines the origin and requested resource from the URL.'},
        {from:'Browser network stack',to:'DNS / transport',message:'Resolve host and connect',detail:'DNS resolution and TCP/TLS connection setup occur before the HTTP exchange as required by the scheme.'},
        {from:'Browser',to:'Web server / proxy',message:'Send HTTP request',detail:'The request can pass through a CDN or reverse proxy before reaching an application origin.'},
        {from:'Server',to:'Browser',message:'Return HTML response',detail:'The browser receives a representation; it has not yet finished loading all referenced subresources.'},
        {from:'HTML parser',to:'Resource loader',message:'Discover CSS, scripts, images, and fonts',detail:'The document can trigger additional requests; cache policy and dependencies affect the load.'},
        {from:'Rendering engine',to:'Viewport',message:'Build layout and paint',detail:'The browser computes styles/layout and paints pixels; script execution and asynchronous resources can change the page later.'}
      ],
      sessions:[
        {from:'Browser',to:'Application',message:'First request without a session cookie',detail:'The application has no existing session identifier from this browser request.'},
        {from:'Application',to:'Browser',message:'Create session and return Set-Cookie',detail:'The server creates session state and sends a cookie instruction with attributes such as Secure, HttpOnly, and SameSite as appropriate.'},
        {from:'Browser cookie store',to:'Browser network stack',message:'Store cookie under its scope rules',detail:'Domain, path, expiry, Secure, and SameSite rules affect whether the cookie is sent later.'},
        {from:'Browser',to:'Application',message:'Send Cookie on a matching request',detail:'The browser sends the session cookie when its scope and security rules permit it.'},
        {from:'Application',to:'Session store',message:'Resolve session and authorize action',detail:'The server must still validate the session and authorize the requested action; possession of a cookie is not authorization by itself.'},
        {from:'Application',to:'Browser',message:'Logout: invalidate session and clear cookie',detail:'A robust logout invalidates server-side session state and sends an appropriate cookie-expiration instruction.'}
      ],
      cors:[
        {from:'Web page origin A',to:'API origin B',message:'JavaScript attempts cross-origin request',detail:'The same-origin policy controls whether browser scripts may read cross-origin responses.'},
        {from:'Browser',to:'API origin B',message:'Preflight OPTIONS (when required)',detail:'Non-simple requests trigger a preflight asking whether the origin, method, and headers are permitted.'},
        {from:'API origin B',to:'Browser',message:'Return CORS permission headers',detail:'The server responds with Access-Control-Allow-Origin and, where applicable, allowed methods/headers and credential policy.'},
        {from:'Browser',to:'API origin B',message:'Send actual request if preflight passes',detail:'The browser sends the requested operation only after a successful preflight when one is required.'},
        {from:'Browser security checks',to:'JavaScript',message:'Expose or block response access',detail:'CORS is enforced by the browser for script access; it is not a firewall for server-to-server requests.'}
      ],
      headers:[
        {from:'Client',to:'HTTP server',message:'Send Accept and Accept-Language',detail:'The client communicates preferred media types and languages; these are preferences, not guarantees.'},
        {from:'Server',to:'Representation selector',message:'Choose an acceptable representation',detail:'The server applies negotiation rules and may use Vary to identify request headers that affect the response.'},
        {from:'Server',to:'Client',message:'Return Content-Type and Vary',detail:'Content-Type describes the chosen representation; Vary informs caches which request headers influence the response.'},
        {from:'Server',to:'Client cache',message:'Return Cache-Control policy',detail:'Cache directives govern freshness and reuse; they do not replace authorization or application correctness.'}
      ],
      api:[
        {from:'API client',to:'Endpoint',message:'Send request with version and payload',detail:'The client sends the method, route, version choice, headers, and request representation.'},
        {from:'Endpoint',to:'Schema validator',message:'Validate required fields and types',detail:'The server checks shape and constraints before applying business logic.'},
        {from:'Validator',to:'API client',message:'Return structured 400/422 validation error',detail:'The error response should identify invalid input without exposing secrets or internal stack traces.'},
        {from:'Endpoint',to:'API client',message:'Return documented response schema',detail:'Stable contracts document fields, status codes, compatibility, and version/deprecation policy.'}
      ],
      connection:[
        {from:'Application',to:'DNS',message:'Resolve service name',detail:'A DNS failure prevents the client from obtaining the destination address; TCP and TLS have not started.'},
        {from:'Client',to:'Destination address',message:'Establish TCP connection',detail:'A TCP failure points toward reachability, routing, firewall, listener, or transport-level causes.'},
        {from:'TLS client',to:'TLS server',message:'Negotiate and validate TLS',detail:'A TLS failure can involve protocol mismatch, certificate identity/trust, expiry, or handshake policy.'},
        {from:'HTTP client',to:'HTTP server',message:'Send application request',detail:'Only after lower layers succeed can HTTP status, authentication, routing, or application behavior be investigated.'}
      ]
    };
    const initial=(scenario)=>({scenario:scenario||'dns',index:0,events:['Choose a protocol scenario and inspect each boundary.']});
    let state=initial('dns');
    function sequence(){return scenarios[state.scenario];}
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,8);}
    function setScenario(s){if(!scenarios[s])throw new TypeError('Unknown protocol scenario');state=initial(s);log('Scenario changed to '+s+'.');}
    function next(){if(state.index<sequence().length-1){state.index++;log('Advanced to '+sequence()[state.index].message+'.');return true;}return false;}
    function previous(){if(state.index>0){state.index--;log('Returned to '+sequence()[state.index].message+'.');return true;}return false;}
    function reset(){state=initial(state.scenario);}
    function snapshot(){return JSON.parse(JSON.stringify({...state,sequence:sequence(),total:sequence().length,current:sequence()[state.index],scenarios:Object.keys(scenarios)}));}
    return {setScenario,next,previous,reset,snapshot};
  }

  function createCap() {
    const initial=()=>({policy:'consistency',partition:false,side:'BC',nextVersion:2,replicas:[{id:'A',value:1,version:1},{id:'B',value:1,version:1},{id:'C',value:1,version:1}],events:['All replicas start with value v1.']});
    let state=initial();
    function log(m){state.events.unshift(m);state.events=state.events.slice(0,10);}
    function reachable(){return state.partition?(state.side==='A'?['A']:['B','C']):['A','B','C'];}
    function setPolicy(p){if(!['consistency','availability'].includes(p))throw new TypeError('Unknown policy');state.policy=p;log('Policy changed to '+p+'.');}
    function setPartition(v){state.partition=!!v;log(state.partition?'Network partition enabled: A is isolated from B/C.':'Network healed: all replicas can communicate.');}
    function setSide(v){if(!['A','BC'].includes(v))throw new TypeError('Unknown client side');state.side=v;log('Client is operating on '+(v==='A'?'replica A':'replicas B/C')+'.');}
    function write(){
      const nodes=reachable();
      if(state.policy==='consistency'&&nodes.length<2){log('WRITE REJECTED: no majority quorum (need 2 of 3).');return {ok:false,reason:'no-quorum'};}
      const version=state.nextVersion++;
      nodes.forEach(id=>{const r=state.replicas.find(x=>x.id===id);r.value=version;r.version=version;});
      log('WRITE v'+version+' accepted on '+nodes.join(', ')+(nodes.length<3?'; other replica(s) remain stale.':'.'));
      return {ok:true,version,nodes};
    }
    function read(){
      const nodes=reachable();
      if(state.policy==='consistency'&&nodes.length<2){log('READ UNAVAILABLE: no majority quorum.');return {ok:false,reason:'no-quorum'};}
      const available=state.replicas.filter(r=>nodes.includes(r.id));
      const chosen=available.reduce((a,r)=>r.version>a.version?r:a,available[0]);
      log('READ returned v'+chosen.value+' from '+chosen.id+'.'+(state.policy==='availability'&&new Set(available.map(r=>r.version)).size>1?' Replicas disagree; this is a local, not globally consistent, read.':''));
      return {ok:true,value:chosen.value,replica:chosen.id};
    }
    function reset(){state=initial();}
    function snapshot(){return JSON.parse(JSON.stringify(state));}
    return {setPolicy,setPartition,setSide,write,read,reset,snapshot};
  }
  return {createLoadBalancer,createCache,createQueue,createRetry,createSipFlow,createDataStructure,createGraphTraversal,createTimeline,createScheduler,createVirtualMemory,createRaceSimulator,createNetworkPath,createProtocolTimeline,createCap};
});
