const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
function load(file){const m=new module.constructor(file,module);m.filename=file;m.paths=module.paths;m.require=id=>id.startsWith('@/')?load(path.join(__dirname,'../src',id.slice(2)+'.ts')):require(id);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,file);return m.exports;}
const plan=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/seo/link-backfill-20260921.json')));
test('all live-source MDX and hardcoded longform bodies preserve old anchors and add exactly two',()=>{
 const {posts,caseStudies}=load(path.join(__dirname,'../src/lib/content.ts'));
 const urls=[...posts.map(p=>'/insights/'+p.slug),...caseStudies.filter(c=>c.article?.length).map(c=>'/work/'+c.slug)].sort();
 assert.deepEqual(urls,plan.entries.map(e=>e.path).sort());
 for(const e of plan.entries){const record=(e.scope==='insights'?posts:caseStudies).find(p=>p.slug===e.slug);const blocks=e.scope==='insights'?record.body:record.article;const html=blocks.map(b=>b.html??b.items?.join(' ')??'').join('\n');const links=[...html.matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)].map(m=>({href:m[1],anchor:m[2].replace(/<[^>]+>/g,'')}));
  assert.equal(links.length,e.baseline_body_links.length+2,e.path+' exact additional two');
  for(const a of [...e.baseline_body_links,...e.added_links])assert.ok(links.some(l=>l.href===a.href&&l.anchor===a.anchor),e.path+' '+a.anchor);
  for(const a of e.added_links)assert.equal(links.filter(l=>l.href===a.href).length,1,e.path+' new target unique');
 }
});
