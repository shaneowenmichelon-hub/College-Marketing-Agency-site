import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {chromium} from 'playwright';
import * as verifier from '../scripts/verify-seo-live.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

test('installed verifier resolves runtime dependencies from the publication worktree',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'installed-seo-verifier-'));
 const file=path.join(dir,'verify-seo-live.mjs');
 fs.copyFileSync(new URL('../scripts/verify-seo-live.mjs',import.meta.url),file);
 try {await assert.doesNotReject(()=>import(pathToFileURL(file).href));}
 finally {fs.rmSync(dir,{recursive:true});}
});

test('rendered body links and destinations are independently verified, not photo/footer links',async()=>{
  assert.equal(typeof verifier.verifyBodyLinks,'function','Missing body-link browser verification');
  let mode='ok';
  const server=http.createServer((req,res)=>{
    if(mode==='broken-target' && req.url==='/reference'){res.statusCode=404;res.end('missing');return;}
    res.setHeader('content-type','text/html');res.end('<html><title>Public reference</title><body><main>'+('Public reference guidance for a campus campaign. '.repeat(20))+'<div id="product-placement">Product placement</div></main></body></html>');
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  const links=[{href:'/services/events',anchor:'campus events',kind:'internal'},{href:'/services#product-placement',anchor:'product placement',kind:'internal'},{href:'/contact',anchor:'contact the team',kind:'internal'},{href:base+'/reference',anchor:'public reference guide',kind:'external'}];
  const browser=await chromium.launch();const page=await browser.newPage();
  const html=links.map(x=>`<p>Prepare your campaign using the <a href="${x.href}">${x.anchor}</a> before launch.</p>`).join('');
  try {
    await page.goto(base);await page.setContent(`<article><div class="prose-custom">${html}</div></article>`);
    assert.equal((await verifier.verifyBodyLinks(page,links,base)).length,4);
    await page.setContent(`<article><div class="prose-custom">${html.replace(/<a [^>]+>public reference guide<\/a>/,'plain text')}</div><footer><a href="${base}/reference">public reference guide</a></footer></article>`);
    await assert.rejects(()=>verifier.verifyBodyLinks(page,links,base));
    await page.setContent(`<article><div class="prose-custom">${html}${html}</div></article>`);
    await assert.rejects(()=>verifier.verifyBodyLinks(page,links,base));
    await page.setContent(`<article><div class="prose-custom">${html}</div></article>`);
    mode='broken-target';await assert.rejects(()=>verifier.verifyBodyLinks(page,links,base));
  }finally{await browser.close();server.close();}
});
