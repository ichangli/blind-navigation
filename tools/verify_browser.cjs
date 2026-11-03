// Optional browser QA: PLAYWRIGHT_MODULE may point to an installed Playwright package.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});try{const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto((process.argv[2] || 'http://127.0.0.1:8877/') + 'Web管理端.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window._geoSceneViewReady,{timeout:60000}).catch(()=>{});console.log(await p.evaluate(()=>({ready:window._geoSceneViewReady,status:document.getElementById('sceneStatus')?.textContent,resources:performance.getEntriesByType('resource').filter(x=>/network-display/.test(x.name)).map(x=>({url:x.name,startMs:x.startTime,durationMs:x.duration,transferBytes:x.transferSize,decodedBytes:x.decodedBodySize})),buttons:document.querySelectorAll('button.leg-toggle').length})));if(await p.evaluate(()=>performance.getEntriesByType('resource').some(x=>/network-display/.test(x.name))))throw Error('roads loaded before opt-in');
await p.locator('[data-map-layer="roads"]').focus();await p.keyboard.press('Enter');
await p.waitForFunction(()=>window._demoRoadLayer&&window._demoRoadLayer.loaded,{timeout:45000});
await p.locator('[data-theme="accessible"]').click();
await p.waitForFunction(()=>window._geoSceneView.stationary&&!window._geoSceneView.updating,{timeout:45000});
if(await p.evaluate(()=>window._demoRoadLayer.queryFeatureCount())<=0)throw Error('no road features');
console.log('roads after keyboard opt-in',await p.evaluate(()=>({renderer:window._demoRoadLayer.renderer.type,pressed:document.querySelector('[data-map-layer="roads"]').getAttribute('aria-pressed'),requests:performance.getEntriesByType('resource').filter(x=>/network-display/.test(x.name)).length,reduced:prefersReducedMotion()})));
await p.locator('[data-map-layer="roads"]').click();await p.locator('[data-map-layer="roads"]').click();
if(await p.evaluate(()=>performance.getEntriesByType('resource').filter(x=>/network-display/.test(x.name)).length)!==1)throw Error('duplicate road request');
await p.locator('.nav-item[data-page="events"]').click();await p.locator('tbody button').first().click();await p.locator('#eventDetailDeleteButton').click();
await p.waitForFunction(()=>document.activeElement.id==='confirmDeleteEventButton');await p.keyboard.press('Tab');
if(!await p.evaluate(()=>document.getElementById('eventDeleteDialog').contains(document.activeElement)))throw Error('focus escaped');
await p.keyboard.press('Escape');if(!await p.evaluate(()=>document.getElementById('eventDeleteDialog').hidden&&document.activeElement.id==='eventDetailDeleteButton'))throw Error('focus restore failed');
await p.locator('.nav-item[data-page="dashboard"]').click();
console.log('keyboard and focus checks passed; errors',errors);
if(process.argv[3])await p.screenshot({path:process.argv[3]});}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});

