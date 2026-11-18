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
  // A different valid PNG. Hashing the optimizer response instead of the source file must fail.
  const derivative=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
  let mode='ok'; let base;
  const server=http.createServer((req,res)=>{
    if(req.url==='/images/blog/test.png') {res.setHeader('content-type','image/png');res.end(mode==='broken-photo'?'not an image':photo);return;}
    if(req.url.startsWith('/_next/image')) {res.setHeader('content-type','image/png');res.end(derivative);return;}
    if(req.url==='/sitemap.xml') {res.end(`<urlset><url><loc>${base}/insights/${mode==='sitemap-missing'?'different':'test'}</loc></url></urlset>`);return;}
    if(mode==='404') res.statusCode=404;
    res.setHeader('content-type','text/html');
    const hero = mode==='no-photo' ? '' : mode==='optimized'
      ? '<img src="/_next/image?url=%2Fimages%2Fblog%2Ftest.png&amp;w=32&amp;q=75" alt="Test photo" width="1" height="1">'
      : '<img src="/images/blog/test.png" alt="Test photo">';
    res.end(`<html><head><link rel="canonical" href="${base}/insights/test"><meta name="description" content="Exact description"></head><body><article><h1>${mode==='wrong-title'?'Wrong title':'Exact title'}</h1>${hero}<p>Exact body sentinel</p></article></body></html>`);
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  base=`http://127.0.0.1:${server.address().port}`;
  const a={slug:'test',title:'Exact title',metaDescription:'Exact description',image:'/images/blog/test.png',imageAlt:'Test photo',image_sha256:createHash('sha256').update(photo).digest('hex'),body_sentinel:'Exact body sentinel'};
  try {
    const ok=await verify(a,base); assert.equal(ok.width,1);
    mode='optimized';
    const optimized=await verify(a,base);
    assert.equal(optimized.alt,'Test photo');
    mode='ok';
    for (const m of ['404','wrong-title','no-photo','broken-photo','sitemap-missing']) {
      mode=m; await assert.rejects(()=>verify(a,base),undefined,m+' must fail');
    }
    mode='ok'; await assert.rejects(()=>verify({...a,image_sha256:'0'.repeat(64)},base));
    await assert.rejects(()=>verify({...a,body_links:[{href:'/services/events',anchor:'events'},{href:'/contact',anchor:'contact'},{href:'https://www.ftc.gov/reference',anchor:'reference'}]},base),undefined,'missing rendered contextual links must fail');
  } finally {server.close();}
});
