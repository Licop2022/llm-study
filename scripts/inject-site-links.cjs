// Inject navigation into a deployment staging directory; original experiment files stay untouched.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const [target,site]=process.argv.slice(2);
if(!target||site!=='llm-study')throw Error('Usage: node scripts/inject-site-links.cjs <staging-directory> llm-study');
const root=path.resolve(target);
if(root===process.cwd()||!fs.statSync(root).isDirectory())throw Error('Use a dedicated staging directory, not the repository root');
fs.copyFileSync(path.resolve(__dirname,'../site-links.js'),path.join(root,'site-links.js'));
let count=0;
function visit(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','.github','node_modules'].includes(entry.name)||entry.isSymbolicLink())continue;const file=path.join(dir,entry.name);if(entry.isDirectory()){visit(file);continue;}if(!entry.name.endsWith('.html'))continue;let html=fs.readFileSync(file,'utf8');if(html.includes('data-site-nav='))continue;const src=path.relative(path.dirname(file),path.join(root,'site-links.js')).split(path.sep).join('/');const tag=`<script src="${src}?v=20261029" data-site-nav="${site}" defer></script>`;html=/<\/body>/i.test(html)?html.replace(/<\/body>/i,tag+'\n</body>'):/<\/html>/i.test(html)?html.replace(/<\/html>/i,tag+'\n</html>'):html+'\n'+tag;fs.writeFileSync(file,html);count++;}}
visit(root);
const manifestPath=path.join(root,'publish-manifest.json');
if(fs.existsSync(manifestPath)){const m=JSON.parse(fs.readFileSync(manifestPath,'utf8'));if(Array.isArray(m.files)){for(const row of m.files){const full=path.resolve(root,row.path);if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile())continue;const bytes=fs.readFileSync(full);row.bytes=bytes.length;row.sha256=crypto.createHash('sha256').update(bytes).digest('hex');}for(const file of ['site-links.js','scripts/inject-site-links.cjs'])if(!m.files.some(x=>x.path===file)&&fs.existsSync(path.join(root,file))){const bytes=fs.readFileSync(path.join(root,file));m.files.push({path:file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}fs.writeFileSync(manifestPath,JSON.stringify(m,null,2)+'\n');}}
console.log(`Added site links to ${count} staged HTML files.`);
