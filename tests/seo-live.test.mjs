import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

test('live verifier rejects false success and checks exact article, sitemap and decoded photo', async () => {
  assert.ok(fs.existsSync(new URL('../scripts/verify-seo-live.mjs',import.meta.url)), 'Independent browser verifier is missing');
  const {verify}=await import('../scripts/verify-seo-live.mjs');
  // Synthetic 1x1 PNG fixture, never used as an editorial photograph.
  const photo=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9XkAAAAASUVORK5CYII=','base64');
  let mode='ok'; let base;
  const server=http.createServer((req,res)=>{
    if(req.url==='/images/blog/test.png') {res.setHeader('content-type','image/png');res.end(mode==='broken-photo'?'not an image':photo);return;}
    if(req.url==='/sitemap.xml') {res.end(`<urlset><url><loc>${base}/insights/${mode==='sitemap-missing'?'different':'test'}</loc></url></urlset>`);return;}
    if(mode==='404') res.statusCode=404;
    res.setHeader('content-type','text/html');
    res.end(`<html><head><link rel="canonical" href="${base}/insights/test"><meta name="description" content="Exact description"></head><body><article><h1>${mode==='wrong-title'?'Wrong title':'Exact title'}</h1>${mode==='no-photo'?'':`<img src="/images/blog/test.png" alt="Test photo">`}<p>Exact body sentinel</p></article></body></html>`);
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  base=`http://127.0.0.1:${server.address().port}`;
  const a={slug:'test',title:'Exact title',metaDescription:'Exact description',image:'/images/blog/test.png',imageAlt:'Test photo',image_sha256:createHash('sha256').update(photo).digest('hex'),body_sentinel:'Exact body sentinel'};
  try {
    const ok=await verify(a,base); assert.equal(ok.width,1);
    for (const m of ['404','wrong-title','no-photo','broken-photo','sitemap-missing']) {
      mode=m; await assert.rejects(()=>verify(a,base),undefined,m+' must fail');
    }
    mode='ok'; await assert.rejects(()=>verify({...a,image_sha256:'0'.repeat(64)},base));
  } finally {server.close();}
});
