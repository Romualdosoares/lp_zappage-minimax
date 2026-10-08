import assert from 'node:assert/strict';
const {chromium}=await import('file:///C:/Users/Romualdo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
let rows=[], fail=false, posts=[]; const errors=[];
await context.routeWebSocket(/supabase\.co\/realtime/,socket=>socket.close());
await context.route('https://yeqcojnwxxpffvfxoiwc.supabase.co/**', async route=>{
 const request=route.request(),url=new URL(request.url());let body=[];
 if(url.pathname.endsWith('/profiles')) body=[{id:'qa-admin',role:'admin'}];
 if(url.pathname.endsWith('/portfolio_services')) {
  if(request.method()==='POST') {
    if(fail) return route.fulfill({status:500,json:{message:'Falha simulada'}});
    const record=request.postDataJSON();posts.push(record);
    rows=rows.filter(row=>row.id!==record.id).concat(record);body=[record];
  } else if(url.searchParams.get('id')?.startsWith('in.')) body=rows;
 }
 await route.fulfill({json:body});
});
await context.addInitScript(()=>localStorage.setItem('zapPage.supabaseSession.v1',JSON.stringify({access_token:'qa.'+btoa(JSON.stringify({exp:Math.floor(Date.now()/1000)+3600}))+'.qa',user:{id:'qa-admin'}})));
const admin=await context.newPage();admin.on('pageerror',error=>errors.push(error.message));
await admin.goto('http://127.0.0.1:5173/admin');await admin.getByRole('button',{name:'Planos',exact:true}).click({timeout:10000}).catch(async e=>{console.log('UI',await admin.locator('body').innerText());console.log('ERRORS',errors);throw e});
await admin.locator('#price-express').waitFor();
await admin.waitForFunction(()=>document.querySelector('#price-express')?.value==='197,00');
const home=await context.newPage();home.on('pageerror',error=>errors.push(error.message));await home.goto('http://127.0.0.1:5173/');
const v2=await context.newPage();v2.on('pageerror',error=>errors.push(error.message));await v2.goto('http://127.0.0.1:5173/landing-v2/');
for(const [key,value,installment] of [['express','240,00','12x de R$ 20,00 sem juros'],['professional','360,00','12x de R$ 30,00 sem juros'],['turbo','600,00','12x de R$ 50,00 sem juros']]) {
 await admin.locator('#price-'+key).fill(value);
 const form=admin.locator('#price-'+key).locator('..');
 await form.getByRole('button',{name:'Salvar valor'}).click();
 await admin.getByText('Preço salvo.',{exact:false}).waitFor();
 await home.waitForFunction(text=>document.querySelector('#planos')?.textContent.includes(text),installment);
 await v2.waitForFunction(text=>document.body.textContent.includes(text),installment);
}
assert.equal(posts.length,3);assert.equal(posts[0].price,'240.00');
assert.match(await home.locator('.barber-hero-details').innerText(),/240,00/);
assert.match(await home.locator('#planos a').first().getAttribute('href'),/240%2C00/);
await admin.reload();await admin.getByRole('button',{name:'Planos',exact:true}).click();await admin.waitForFunction(()=>document.querySelector('#price-express')?.value==='240,00');
await admin.locator('#price-express').fill('-1');assert.equal(await admin.locator('#price-express').locator('..').getByRole('button',{name:'Salvar valor'}).isDisabled(),true);
fail=true;await admin.locator('#price-express').fill('250,00');await admin.locator('#price-express').locator('..').getByRole('button',{name:'Salvar valor'}).click();await admin.getByText('Erro ao salvar preço:',{exact:false}).waitFor();assert.equal(posts.length,3);
for(const page of [admin,home,v2]) {await page.setViewportSize({width:390,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)}
await admin.locator('#price-express').fill('240,00');await admin.locator('#price-express').scrollIntoViewIfNeeded();await admin.screenshot({path:'output/admin-precos-mobile.png'});
await home.locator('#pricing-title').scrollIntoViewIfNeeded();await home.waitForTimeout(800);await home.locator('#planos').screenshot({path:'output/planos-12x-mobile.png'});
assert.deepEqual(errors,[]);console.log('PASS: salvamento dos 3 planos, recarga, principal/V2, WhatsApp, validação, falha de gravação e celular.');
await browser.close();
