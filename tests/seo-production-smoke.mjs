import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.argv[2] ?? 'https://collegiateagency.com';
const screenshot=process.argv[3];
const browser=await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+'/insights/campus-marketing-agency-rfp',{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  const image=page.locator('article img');await image.scrollIntoViewIfNeeded();
  await image.evaluate(i=>i.decode());
  assert.equal(await page.locator('article a[href="https://unsplash.com/license"]').count(),1);
  assert.equal(await page.locator('article a[href="https://unsplash.com/photos/brown-concrete-building-U0dBV_QeiYk"]').count(),1);
  assert.match(await page.locator('meta[property="og:image"]').getAttribute('content'),/campus-library-michael-marsh.jpg$/);
  assert.ok((await page.locator('article').innerText()).includes('not a Collegiate Agency activation or endorsement'));
  const before=await image.boundingBox();assert.ok(before.height>200);
  if(screenshot) await page.screenshot({path:screenshot,fullPage:false});
  await page.setViewportSize({width:390,height:844});
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
  assert.equal(await page.locator('article img').evaluate(i=>i.naturalWidth),1600);
  await page.goto(base+'/insights',{waitUntil:'networkidle'});
  assert.equal(await page.locator('a[href="/insights/campus-marketing-agency-rfp"] img').count(),1);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({status:'passed',base,credit:true,license:true,openGraph:true,mobileWidth:390,indexPhoto:true,pageErrors:0}));
} finally {await browser.close();}
