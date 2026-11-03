// Usage: PLAYWRIGHT_MODULE=<installed package> node tools/verify_static_release.cjs <extracted EXE>
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const path=require('node:path');
async function main(){
  const executable=path.resolve(process.argv[2]);
  const server=spawn(executable,['--no-browser','--port','0'],{cwd:path.dirname(executable),windowsHide:true,stdio:['ignore','pipe','pipe']});
  let browser;
  try {
    const base=await new Promise((resolve,reject)=>{
      let output='';const timer=setTimeout(()=>reject(Error('Static server did not start')),20000);
      server.on('error',e=>{clearTimeout(timer);reject(e);});
      server.on('exit',code=>{clearTimeout(timer);reject(Error('Server exited: '+code));});
      server.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/http:\/\/127\.0\.0\.1:\d+\//);if(match){clearTimeout(timer);resolve(match[0]);}});
    });
    browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});
    const external=[],errors=[],bad=[],networkAPI=[];
    await context.route('**/*',route=>{
      const url=new URL(route.request().url());
      if(url.origin!==new URL(base).origin){external.push(url.origin);return route.abort();}
      if(url.pathname.startsWith('/api/'))networkAPI.push(url.pathname);
      return route.continue();
    });
    context.on('page',p=>{p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))bad.push(r.status()+' '+new URL(r.url()).pathname);});});
    const web=await context.newPage();
    await web.goto(base,{waitUntil:'load'});
    assert.equal(await web.locator('.experience-card').count(),2);
    await web.goto(base+'Web管理端.html',{waitUntil:'domcontentloaded'});
    await web.waitForFunction(()=>window._geoSceneViewReady,{timeout:60000});
    await web.waitForFunction(()=>window._geoSceneView.stationary&&!window._geoSceneView.updating,{timeout:60000});
    assert.equal(await web.evaluate(()=>performance.getEntriesByType('resource').filter(x=>x.name.includes('network-display')).length),0);
    await web.locator('[data-map-layer="roads"]').focus();await web.keyboard.press('Enter');
    await web.waitForFunction(()=>window._demoRoadLayer&&window._demoRoadLayer.loaded,{timeout:45000});
    await web.locator('[data-theme="accessible"]').click();
    assert.ok(await web.evaluate(()=>window._demoRoadLayer.queryFeatureCount())>0);
    const mobile=await context.newPage();
    await mobile.goto(base+'移动端.html',{waitUntil:'load'});
    await mobile.waitForFunction(()=>window.MOBILE_DATA&&window.BlindDemo&&window.BlindDemo.cases.length===3);
    const result=await mobile.evaluate(async()=>{
      await BlindDemo.ready;
      const form=new FormData();form.set('type','盲道被占');form.set('description','静态发布验收');form.set('lon','114.055');form.set('lat','22.535');form.set('address','演示地点');
      const submitted=await (await fetch(BlindDemo.apiBase+'/api/mobile/report',{method:'POST',body:form})).json();
      const plan=await (await fetch(BlindDemo.apiBase+'/api/mobile/navigation/plan',{method:'POST',body:JSON.stringify({destination:BlindDemo.cases[0].destination})})).json();
      await drawNavigationMap(plan);
      return {id:submitted.eventId,routePoints:plan.route.length,map:!!window._demoMobileMap};
    });
    assert.ok(result.id.startsWith('DEMO-'));assert.ok(result.routePoints>2&&result.map);
    await web.evaluate(id=>openEventDetail(id),result.id);
    await web.waitForFunction(id=>window.APP_DATA.eventDetail.id===id,result.id);
    await web.evaluate(()=>eventApprove());
    await web.waitForFunction(id=>APP_DATA.events.some(e=>e.id===id&&e.status==='处理中'),result.id);
    await mobile.reload({waitUntil:'load'});
    const status=await mobile.evaluate(async id=>{await BlindDemo.ready;const history=await (await fetch(BlindDemo.apiBase+'/api/mobile/report/history')).json();return history.find(e=>e.eventId===id).status;},result.id);
    assert.equal(status,'处理中');
    assert.deepEqual(external,[],'no external HTTP request attempts');
    assert.deepEqual(networkAPI,[],'no business API requests leave the browser');
    assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);
    console.log(JSON.stringify({staticEXE:true,landing:true,webGL:true,roadLazyLoading:true,mobileRoute:true,reportReviewPersistence:true,externalRequests:external.length,businessNetworkRequests:networkAPI.length,pageErrors:errors.length}));
  } finally {
    if(browser)await browser.close();
    server.kill();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
