/* Accessible UI adapters for deterministic simulations. */
(function () {
  'use strict';
  if (!window.CourseInteractions || !window.CourseSimulations) return;
  const S = window.CourseSimulations;
  function find(root, selector) { return root.querySelector(selector); }
  function listenAll(ctx, selector, event, fn) { ctx.root.querySelectorAll(selector).forEach(el=>ctx.listen(el,event,fn)); }
  function text(root, selector, value) { const el=find(root,selector); if(el) el.textContent=String(value); }
  function list(root, selector, items) { const el=find(root,selector); if(!el)return; el.replaceChildren(); items.forEach(item=>{const li=el.ownerDocument.createElement('li');li.textContent=item;el.appendChild(li);}); }
  function renderBalancer(ctx, sim) {
    const s=sim.snapshot();
    s.servers.forEach(server=>{const card=find(ctx.root,'[data-server="'+server.id+'"]');if(!card)return;
      text(card,'[data-requests]',server.requests);text(card,'[data-active]',server.active);
      text(card,'[data-health]',server.healthy?'Healthy':'Unhealthy');card.classList.toggle('is-unhealthy',!server.healthy);
      const toggle=find(card,'[data-health-toggle]');if(toggle){toggle.checked=server.healthy;toggle.setAttribute('aria-label','Mark server '+server.id+' healthy');}
    });
    text(ctx.root,'[data-pending]',s.pending.length);text(ctx.root,'[data-next]',s.nextId<=s.count?s.nextId:'Complete');
    list(ctx.root,'[data-event-log]',s.events);
    const run=find(ctx.root,'[data-action="step"]');if(run)run.disabled=s.nextId>s.count;
    ctx.status('Requests sent: '+(s.nextId-1)+' of '+s.count+'. Active connections: '+s.pending.length+'.');
  }
  window.CourseInteractions.register('load-balancer',function(ctx){
    const sim=S.createLoadBalancer({count:Math.max(1,Math.min(30,Number(ctx.config.count)||12))});
    listenAll(ctx,'[data-strategy]','change',e=>{sim.setStrategy(e.currentTarget.value);ctx.status('Strategy: '+e.currentTarget.selectedOptions[0].textContent);});
    listenAll(ctx,'[data-health-toggle]','change',e=>{sim.setHealthy(e.currentTarget.closest('[data-server]').dataset.server,e.currentTarget.checked);renderBalancer(ctx,sim);});
    listenAll(ctx,'[data-action="step"]','click',()=>{sim.step();renderBalancer(ctx,sim);});
    listenAll(ctx,'[data-action="complete"]','click',()=>{sim.complete();renderBalancer(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderBalancer(ctx,sim);});
    listenAll(ctx,'[data-action="replay"]','click',()=>{sim.reset();while(sim.snapshot().nextId<=sim.snapshot().count)sim.step();renderBalancer(ctx,sim);});
    renderBalancer(ctx,sim);
    return {reset(){sim.reset();renderBalancer(ctx,sim);},destroy(){}};
  });
  function renderCache(ctx,sim){
    const s=sim.snapshot();text(ctx.root,'[data-clock]',s.now);text(ctx.root,'[data-ttl]',s.ttl);
    text(ctx.root,'[data-db-value]','v'+s.dbValue);text(ctx.root,'[data-cache-value]',s.cache&&s.now<s.cache.expiresAt?'v'+s.cache.value:'Empty / expired');
    text(ctx.root,'[data-expiry]',s.cache?'t='+s.cache.expiresAt:'—');text(ctx.root,'[data-hits]',s.hits);text(ctx.root,'[data-misses]',s.misses);text(ctx.root,'[data-db-calls]',s.databaseCalls);
    text(ctx.root,'[data-stale]',s.cache&&s.now<s.cache.expiresAt&&s.cache.value!==s.dbValue?'STALE: cache v'+s.cache.value+' differs from database v'+s.dbValue:'No stale cached value currently detected.');
    list(ctx.root,'[data-event-log]',s.events);ctx.status('Virtual time '+s.now+' seconds. Cache hits '+s.hits+', misses '+s.misses+', database calls '+s.databaseCalls+'.');
  }
  window.CourseInteractions.register('cache-simulator',function(ctx){
    const sim=S.createCache({ttl:5});
    listenAll(ctx,'[data-action="read"]','click',()=>{sim.read();renderCache(ctx,sim);});
    listenAll(ctx,'[data-action="advance"]','click',()=>{sim.advance(1);renderCache(ctx,sim);});
    listenAll(ctx,'[data-action="update-db"]','click',()=>{sim.updateDatabase();renderCache(ctx,sim);});
    listenAll(ctx,'[data-action="invalidate"]','click',()=>{sim.invalidate();renderCache(ctx,sim);});
    listenAll(ctx,'[data-ttl-input]','change',e=>{sim.setTtl(Number(e.currentTarget.value));renderCache(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderCache(ctx,sim);});
    renderCache(ctx,sim);
    return {reset(){sim.reset();renderCache(ctx,sim);},destroy(){}};
  });
  function renderQueue(ctx,sim){
    const s=sim.snapshot();text(ctx.root,'[data-queue-clock]',s.now);text(ctx.root,'[data-queue-depth]',s.queue.length);text(ctx.root,'[data-queue-capacity]',s.capacity);text(ctx.root,'[data-queue-completed]',s.completed.length);text(ctx.root,'[data-queue-rejected]',s.rejected);
    s.workers.forEach(w=>text(ctx.root,'[data-worker="'+w.id+'"] [data-worker-status]',w.job?'Job '+w.job.id+' · '+w.remaining+' tick(s) remaining':'Idle'));
    list(ctx.root,'[data-queue-items]',s.queue.length?s.queue.map(j=>'Job '+j.id):['No waiting jobs.']);
    list(ctx.root,'[data-queue-log]',s.events);
    ctx.status('Tick '+s.now+'. Waiting jobs '+s.queue.length+' of '+s.capacity+'. Completed '+s.completed.length+'. Rejected '+s.rejected+'.');
  }
  window.CourseInteractions.register('queue-simulator',function(ctx){
    const sim=S.createQueue();
    listenAll(ctx,'[data-action="enqueue"]','click',()=>{sim.enqueue();renderQueue(ctx,sim);});
    listenAll(ctx,'[data-action="burst"]','click',()=>{sim.burst(3);renderQueue(ctx,sim);});
    listenAll(ctx,'[data-action="tick"]','click',()=>{sim.step();renderQueue(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderQueue(ctx,sim);});
    renderQueue(ctx,sim);
    return {reset(){sim.reset();renderQueue(ctx,sim);},destroy(){}};
  });
  function renderRetry(ctx,sim){
    const s=sim.snapshot();const policy=find(ctx.root,'[data-idempotency]');if(policy){policy.checked=s.reuseKey;policy.disabled=s.attempt>0;}text(ctx.root,'[data-retry-clock]',s.now);text(ctx.root,'[data-attempt]',s.attempt);text(ctx.root,'[data-max-attempts]',s.maxAttempts);text(ctx.root,'[data-next-retry]',s.nextRetryAt==null?'—':'t='+s.nextRetryAt);text(ctx.root,'[data-retry-status]',s.status);text(ctx.root,'[data-side-effects]',s.sideEffects);text(ctx.root,'[data-idempotency-state]',s.reuseKey?'Reuses order-42 across attempts':'Creates a new key for every attempt');
    const send=find(ctx.root,'[data-action="send-retry"]');if(send)send.disabled=s.status==='succeeded'||s.status==='failed';
    const advance=find(ctx.root,'[data-action="advance-retry"]');if(advance)advance.disabled=s.status!=='waiting';
    list(ctx.root,'[data-retry-log]',s.events);
    ctx.status('Attempt '+s.attempt+' of '+s.maxAttempts+'. Virtual time '+s.now+'. Side effects committed '+s.sideEffects+'. Status '+s.status+'.');
  }
  window.CourseInteractions.register('retry-simulator',function(ctx){
    const sim=S.createRetry();
    listenAll(ctx,'[data-idempotency]','change',e=>{sim.setIdempotency(e.currentTarget.checked);renderRetry(ctx,sim);});
    listenAll(ctx,'[data-action="send-retry"]','click',()=>{sim.send();renderRetry(ctx,sim);});
    listenAll(ctx,'[data-action="advance-retry"]','click',()=>{sim.advanceToRetry();renderRetry(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderRetry(ctx,sim);});
    renderRetry(ctx,sim);
    return {reset(){sim.reset();renderRetry(ctx,sim);},destroy(){}};
  });
  function renderSip(ctx,sim){
    const s=sim.snapshot(),step=s.current,relay=find(ctx.root,'[data-sip-relay]');
    if(relay)relay.checked=s.relay;
    text(ctx.root,'[data-sip-step]',s.index+1);text(ctx.root,'[data-sip-total]',s.total);text(ctx.root,'[data-sip-from]',step.from);text(ctx.root,'[data-sip-to]',step.to);text(ctx.root,'[data-sip-message]',step.message);text(ctx.root,'[data-sip-plane]',step.plane);text(ctx.root,'[data-sip-detail]',step.detail);
    const prev=find(ctx.root,'[data-action="sip-previous"]'),next=find(ctx.root,'[data-action="sip-next"]');
    if(prev)prev.disabled=s.index===0;if(next)next.disabled=s.index===s.total-1;
    list(ctx.root,'[data-sip-sequence]',s.sequence.map((x,i)=>(i===s.index?'Current step: ':'Step '+(i+1)+': ')+x.message+' — '+x.from+' → '+x.to));
    list(ctx.root,'[data-sip-log]',s.events);
    ctx.status('SIP flow step '+(s.index+1)+' of '+s.total+': '+step.message+'. Plane: '+step.plane+'.');
  }
  window.CourseInteractions.register('sip-flow-explorer',function(ctx){
    const sim=S.createSipFlow();
    listenAll(ctx,'[data-sip-relay]','change',e=>{sim.setRelay(e.currentTarget.checked);renderSip(ctx,sim);});
    listenAll(ctx,'[data-action="sip-next"]','click',()=>{sim.next();renderSip(ctx,sim);});
    listenAll(ctx,'[data-action="sip-previous"]','click',()=>{sim.previous();renderSip(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderSip(ctx,sim);});
    renderSip(ctx,sim);
    return {reset(){sim.reset();renderSip(ctx,sim);},destroy(){}};
  });
  function renderDataStructure(ctx,sim){
    const s=sim.snapshot(),d=s.states[s.structure],items=d.items||d.keys||[],select=find(ctx.root,'[data-ds-operation]'),actions=sim.actionsFor(s.structure),old=select&&select.value;
    text(ctx.root,'[data-ds-structure-label]',s.structure);text(ctx.root,'[data-ds-size]',items.length);text(ctx.root,'[data-ds-capacity]',d.capacity||'—');
    if(select){select.replaceChildren();actions.forEach(a=>{const o=select.ownerDocument.createElement('option');o.value=a.value;o.textContent=a.label;select.appendChild(o);});select.value=actions.some(a=>a.value===old)?old:actions[0].value;}
    const r=s.lastResult;text(ctx.root,'[data-ds-complexity]',r?r.complexity:'—');text(ctx.root,'[data-ds-steps]',r?r.steps:'—');text(ctx.root,'[data-ds-outcome]',r?r.outcome:'Choose an operation and apply it.');text(ctx.root,'[data-ds-note]',r&&r.note?r.note:'');
    list(ctx.root,'[data-ds-items]',items.length?items.map((x,i)=>i+': '+x):['Empty']);
    list(ctx.root,'[data-ds-log]',s.events);
    ctx.status('Structure '+s.structure+'. Size '+items.length+'. '+(r?'Last operation '+r.label+'; complexity '+r.complexity+'.':'No operation applied yet.'));
  }
  window.CourseInteractions.register('data-structure-explorer',function(ctx){
    const sim=S.createDataStructure();
    listenAll(ctx,'[data-ds-structure]','change',e=>{sim.setStructure(e.currentTarget.value);renderDataStructure(ctx,sim);});
    listenAll(ctx,'[data-action="ds-apply"]','click',()=>{sim.perform(find(ctx.root,'[data-ds-operation]').value);renderDataStructure(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderDataStructure(ctx,sim);});
    renderDataStructure(ctx,sim);
    return {reset(){sim.reset();renderDataStructure(ctx,sim);},destroy(){}};
  });
  function renderGraph(ctx,sim){
    const s=sim.snapshot();
    text(ctx.root,'[data-graph-current]',s.current||'—');text(ctx.root,'[data-graph-algorithm-label]',s.algorithm.toUpperCase());text(ctx.root,'[data-graph-topology-label]',s.topology==='tree'?'Tree':'Graph');
    text(ctx.root,'[data-graph-complete]',s.frontier.length?'In progress':'Complete');text(ctx.root,'#graph-svg-title',s.topology==='tree'?'Five-node tree':'Five-node undirected graph');text(ctx.root,'#graph-svg-desc',s.topology==='tree'?'A is the root; B and C are children; D is a child of B; E is a child of C.':'Edges connect A to B and C, B to D, C to D and E. Traversal state is also presented in text below.');
    const crossEdge=find(ctx.root,'[data-edge="CD"]');if(crossEdge)crossEdge.setAttribute('visibility',s.topology==='tree'?'hidden':'visible');
    ctx.root.querySelectorAll('[data-node]').forEach(el=>{const id=el.dataset.node;el.classList.toggle('is-visited',s.visited.includes(id));el.classList.toggle('is-frontier',s.frontier.includes(id));el.classList.toggle('is-current',s.current===id);el.setAttribute('aria-label','Node '+id+(s.current===id?', current':s.visited.includes(id)?', visited':s.frontier.includes(id)?', discovered and waiting':', not yet discovered'));});
    list(ctx.root,'[data-graph-order]',s.order.length?s.order:['No nodes visited yet']);
    list(ctx.root,'[data-graph-frontier]',s.frontier.length?s.frontier:['Empty']);
    list(ctx.root,'[data-graph-log]',s.events);
    const next=find(ctx.root,'[data-action="graph-step"]');if(next)next.disabled=!s.frontier.length;
    ctx.status(s.algorithm.toUpperCase()+' traversal. Visited order: '+(s.order.join(' → ')||'none')+'. Frontier: '+(s.frontier.join(', ')||'empty')+'.');
  }
  window.CourseInteractions.register('graph-traversal-explorer',function(ctx){
    const sim=S.createGraphTraversal();
    listenAll(ctx,'[data-graph-algorithm]','change',e=>{sim.setAlgorithm(e.currentTarget.value);renderGraph(ctx,sim);});
    listenAll(ctx,'[data-graph-topology]','change',e=>{sim.setTopology(e.currentTarget.value);renderGraph(ctx,sim);});
    listenAll(ctx,'[data-action="graph-step"]','click',()=>{sim.step();renderGraph(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderGraph(ctx,sim);});
    renderGraph(ctx,sim);
    return {reset(){sim.reset();renderGraph(ctx,sim);},destroy(){}};
  });
  function renderTimeline(ctx,sim){
    const s=sim.snapshot(),step=s.current,scenario=find(ctx.root,'[data-timeline-scenario]');
    if(scenario)scenario.value=s.scenario;
    text(ctx.root,'[data-timeline-step]',s.index+1);text(ctx.root,'[data-timeline-total]',s.total);text(ctx.root,'[data-timeline-from]',step.from);text(ctx.root,'[data-timeline-to]',step.to);text(ctx.root,'[data-timeline-message]',step.message);text(ctx.root,'[data-timeline-detail]',step.detail);
    const prev=find(ctx.root,'[data-action="timeline-previous"]'),next=find(ctx.root,'[data-action="timeline-next"]');
    if(prev)prev.disabled=s.index===0;if(next)next.disabled=s.index===s.total-1;
    list(ctx.root,'[data-timeline-sequence]',s.sequence.map((x,i)=>(i===s.index?'Current: ':'Step '+(i+1)+': ')+x.message+' — '+x.from+' → '+x.to));
    list(ctx.root,'[data-timeline-log]',s.events);ctx.status(s.scenario+' scenario, step '+(s.index+1)+' of '+s.total+': '+step.message+'.');
  }
  window.CourseInteractions.register('os-timeline-explorer',function(ctx){
    const sim=S.createTimeline();
    listenAll(ctx,'[data-timeline-scenario]','change',e=>{sim.setScenario(e.currentTarget.value);renderTimeline(ctx,sim);});
    listenAll(ctx,'[data-action="timeline-next"]','click',()=>{sim.next();renderTimeline(ctx,sim);});
    listenAll(ctx,'[data-action="timeline-previous"]','click',()=>{sim.previous();renderTimeline(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderTimeline(ctx,sim);});
    renderTimeline(ctx,sim);return {reset(){sim.reset();renderTimeline(ctx,sim);},destroy(){}};
  });
  function renderScheduler(ctx,sim){
    const s=sim.snapshot(),policy=find(ctx.root,'[data-scheduler-policy]');if(policy)policy.value=s.algorithm;
    text(ctx.root,'[data-scheduler-time]',s.time);text(ctx.root,'[data-scheduler-running]',s.running||'CPU idle');text(ctx.root,'[data-scheduler-ready]',s.ready.join(', ')||'Empty');text(ctx.root,'[data-context-switches]',s.contextSwitches);text(ctx.root,'[data-scheduler-complete]',sim.done()?'All processes complete':'In progress');
    s.processes.forEach(p=>{const row=find(ctx.root,'[data-process="'+p.id+'"]');if(row){text(row,'[data-process-state]',p.state);text(row,'[data-process-remaining]',p.remaining);text(row,'[data-process-arrival]',p.arrival);text(row,'[data-process-burst]',p.burst);text(row,'[data-process-completion]',p.completion==null?'—':p.completion);}});
    const step=find(ctx.root,'[data-action="scheduler-step"]');if(step)step.disabled=sim.done();
    list(ctx.root,'[data-scheduler-log]',s.events);ctx.status(s.algorithm.toUpperCase()+' scheduler at t='+s.time+'. Running '+(s.running||'none')+'. Ready queue '+(s.ready.join(', ')||'empty')+'.');
  }
  window.CourseInteractions.register('scheduler-explorer',function(ctx){
    const sim=S.createScheduler();
    listenAll(ctx,'[data-scheduler-policy]','change',e=>{sim.setAlgorithm(e.currentTarget.value);renderScheduler(ctx,sim);});
    listenAll(ctx,'[data-action="scheduler-step"]','click',()=>{sim.step();renderScheduler(ctx,sim);});
    listenAll(ctx,'[data-action="scheduler-reset"]','click',()=>{sim.reset();renderScheduler(ctx,sim);});
    renderScheduler(ctx,sim);return {reset(){sim.reset();renderScheduler(ctx,sim);},destroy(){}};
  });
  function renderVirtualMemory(ctx,sim,result){
    const s=sim.snapshot();list(ctx.root,'[data-page-table]',s.table.map(p=>'Virtual page '+p.page+' → '+(p.present?'frame '+p.frame:'not present')));
    if(result){text(ctx.root,'[data-vm-page]',result.page);text(ctx.root,'[data-vm-offset]',result.offset);text(ctx.root,'[data-vm-frame]',result.frame==null?'—':result.frame);text(ctx.root,'[data-vm-physical]',result.physicalAddress==null?'Page fault':result.physicalAddress);text(ctx.root,'[data-vm-result]',result.explanation);text(ctx.root,'[data-vm-status]',result.pageFault?'Page fault':'Translated');}
    ctx.status(result?'Virtual address '+result.address+': '+(result.pageFault?'page fault':'physical address '+result.physicalAddress)+'.':'Enter a virtual address from 0 to 15 and translate.');
  }
  window.CourseInteractions.register('virtual-memory-explorer',function(ctx){
    const sim=S.createVirtualMemory();let last=null;
    listenAll(ctx,'[data-action="vm-translate"]','click',()=>{try{last=sim.translate(Number(find(ctx.root,'[data-vm-address]').value));renderVirtualMemory(ctx,sim,last);}catch(e){text(ctx.root,'[data-vm-result]',e.message);ctx.status(e.message);}});
    listenAll(ctx,'[data-action="vm-reset"]','click',()=>{last=null;text(ctx.root,'[data-vm-page]','—');text(ctx.root,'[data-vm-offset]','—');text(ctx.root,'[data-vm-frame]','—');text(ctx.root,'[data-vm-physical]','—');text(ctx.root,'[data-vm-result]','Enter an address and translate it.');text(ctx.root,'[data-vm-status]','Ready');renderVirtualMemory(ctx,sim,null);});
    renderVirtualMemory(ctx,sim,null);return {reset(){last=null;renderVirtualMemory(ctx,sim,null);},destroy(){}};
  });
  function renderRace(ctx,sim){
    const s=sim.snapshot(),mode=find(ctx.root,'[data-race-mode]');if(mode)mode.value=s.mode;
    text(ctx.root,'[data-race-counter]',s.counter);text(ctx.root,'[data-race-local-a]',s.locals.A==null?'—':s.locals.A);text(ctx.root,'[data-race-local-b]',s.locals.B==null?'—':s.locals.B);text(ctx.root,'[data-race-lock]',s.lockOwner||'Unlocked');text(ctx.root,'[data-race-next]',s.next?s.next[0]+' '+s.next[1]:'Complete');
    const step=find(ctx.root,'[data-action="race-step"]');if(step)step.disabled=s.complete;
    list(ctx.root,'[data-race-log]',s.events);ctx.status(s.mode+' schedule, operation '+s.index+' of '+s.total+'. Shared counter is '+s.counter+'.');
  }
  window.CourseInteractions.register('race-condition-explorer',function(ctx){
    const sim=S.createRaceSimulator();
    listenAll(ctx,'[data-race-mode]','change',e=>{sim.setMode(e.currentTarget.value);renderRace(ctx,sim);});
    listenAll(ctx,'[data-action="race-step"]','click',()=>{sim.step();renderRace(ctx,sim);});
    listenAll(ctx,'[data-action="race-reset"]','click',()=>{sim.reset();renderRace(ctx,sim);});
    renderRace(ctx,sim);return {reset(){sim.reset();renderRace(ctx,sim);},destroy(){}};
  });
  function renderNetwork(ctx,sim){
    const s=sim.snapshot(),step=s.current;
    const controls=[['[data-network-scenario]',s.scenario],['[data-network-transport]',s.transport],['[data-network-payload]',String(s.payloadBytes)],['[data-network-mtu]',String(s.mtu)]];
    controls.forEach(([selector,value])=>{const el=find(ctx.root,selector);if(el)el.value=value;});
    text(ctx.root,'[data-network-step]',s.index+1);text(ctx.root,'[data-network-total]',s.total);text(ctx.root,'[data-network-from]',step.from);text(ctx.root,'[data-network-to]',step.to);text(ctx.root,'[data-network-message]',step.message);text(ctx.root,'[data-network-detail]',step.detail);
    text(ctx.root,'[data-network-scenario-label]',s.scenario==='lan'?'Same subnet':'Routed subnet');text(ctx.root,'[data-network-transport-label]',s.transport.toUpperCase());text(ctx.root,'[data-network-mtu-label]',s.mtu+' bytes');
    const prev=find(ctx.root,'[data-action="network-previous"]'),next=find(ctx.root,'[data-action="network-next"]');if(prev)prev.disabled=s.index===0;if(next)next.disabled=s.index===s.total-1;
    list(ctx.root,'[data-network-sequence]',s.sequence.map((x,i)=>(i===s.index?'Current: ':'Step '+(i+1)+': ')+x.message+' — '+x.from+' → '+x.to));
    list(ctx.root,'[data-network-log]',s.events);ctx.status(s.scenario+' path, '+s.transport.toUpperCase()+', step '+(s.index+1)+' of '+s.total+': '+step.message+'.');
  }
  window.CourseInteractions.register('network-path-explorer',function(ctx){
    const sim=S.createNetworkPath();
    listenAll(ctx,'[data-network-scenario]','change',e=>{sim.setScenario(e.currentTarget.value);renderNetwork(ctx,sim);});
    listenAll(ctx,'[data-network-transport]','change',e=>{sim.setTransport(e.currentTarget.value);renderNetwork(ctx,sim);});
    listenAll(ctx,'[data-network-payload]','change',e=>{sim.setPayload(e.currentTarget.value);renderNetwork(ctx,sim);});
    listenAll(ctx,'[data-network-mtu]','change',e=>{sim.setMtu(e.currentTarget.value);renderNetwork(ctx,sim);});
    listenAll(ctx,'[data-action="network-next"]','click',()=>{sim.next();renderNetwork(ctx,sim);});
    listenAll(ctx,'[data-action="network-previous"]','click',()=>{sim.previous();renderNetwork(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderNetwork(ctx,sim);});
    renderNetwork(ctx,sim);return {reset(){sim.reset();renderNetwork(ctx,sim);},destroy(){}};
  });
  function renderProtocolTimeline(ctx,sim){
    const s=sim.snapshot(),step=s.current,scenario=find(ctx.root,'[data-protocol-scenario]');if(scenario)scenario.value=s.scenario;
    text(ctx.root,'[data-protocol-step]',s.index+1);text(ctx.root,'[data-protocol-total]',s.total);text(ctx.root,'[data-protocol-from]',step.from);text(ctx.root,'[data-protocol-to]',step.to);text(ctx.root,'[data-protocol-message]',step.message);text(ctx.root,'[data-protocol-detail]',step.detail);text(ctx.root,'[data-protocol-scenario-label]',s.scenario.toUpperCase());
    const prev=find(ctx.root,'[data-action="protocol-previous"]'),next=find(ctx.root,'[data-action="protocol-next"]');if(prev)prev.disabled=s.index===0;if(next)next.disabled=s.index===s.total-1;
    list(ctx.root,'[data-protocol-sequence]',s.sequence.map((x,i)=>(i===s.index?'Current: ':'Step '+(i+1)+': ')+x.message+' — '+x.from+' → '+x.to));
    list(ctx.root,'[data-protocol-log]',s.events);ctx.status(s.scenario+' protocol scenario, step '+(s.index+1)+' of '+s.total+': '+step.message+'.');
  }
  window.CourseInteractions.register('protocol-timeline-explorer',function(ctx){
    const sim=S.createProtocolTimeline();
    listenAll(ctx,'[data-protocol-scenario]','change',e=>{sim.setScenario(e.currentTarget.value);renderProtocolTimeline(ctx,sim);});
    listenAll(ctx,'[data-action="protocol-next"]','click',()=>{sim.next();renderProtocolTimeline(ctx,sim);});
    listenAll(ctx,'[data-action="protocol-previous"]','click',()=>{sim.previous();renderProtocolTimeline(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderProtocolTimeline(ctx,sim);});
    renderProtocolTimeline(ctx,sim);return {reset(){sim.reset();renderProtocolTimeline(ctx,sim);},destroy(){}};
  });
  function renderCap(ctx,sim){
    const s=sim.snapshot();
    s.replicas.forEach(r=>{text(ctx.root,'[data-replica="'+r.id+'"] [data-value]','v'+r.value);text(ctx.root,'[data-replica="'+r.id+'"] [data-version]','Version '+r.version);});
    text(ctx.root,'[data-partition-state]',s.partition?'Partitioned':'Network healed');
    text(ctx.root,'[data-quorum-state]',s.policy==='consistency'?'Consistency-first: majority quorum required':'Availability-first: reachable replica accepts operation');
    text(ctx.root,'[data-side-state]',s.partition?(s.side==='A'?'Client can reach A only':'Client can reach B and C'):'Client can reach all replicas');
    list(ctx.root,'[data-event-log]',s.events);
    ctx.status(s.policy==='consistency'?'Consistency-first policy; read/write requires at least two replicas.':'Availability-first policy; operations can succeed on a reachable minority and diverge.');
  }
  window.CourseInteractions.register('cap-explorer',function(ctx){
    const sim=S.createCap();
    listenAll(ctx,'[data-policy]','change',e=>{sim.setPolicy(e.currentTarget.value);renderCap(ctx,sim);});
    listenAll(ctx,'[data-action="partition"]','click',()=>{sim.setPartition(!sim.snapshot().partition);renderCap(ctx,sim);});
    listenAll(ctx,'[data-side]','change',e=>{sim.setSide(e.currentTarget.value);renderCap(ctx,sim);});
    listenAll(ctx,'[data-action="write"]','click',()=>{sim.write();renderCap(ctx,sim);});
    listenAll(ctx,'[data-action="read"]','click',()=>{sim.read();renderCap(ctx,sim);});
    listenAll(ctx,'[data-action="reset"]','click',()=>{sim.reset();renderCap(ctx,sim);});
    renderCap(ctx,sim);
    return {reset(){sim.reset();renderCap(ctx,sim);},destroy(){}};
  });
  document.addEventListener('DOMContentLoaded',()=>window.CourseInteractions.init(document));
})();
