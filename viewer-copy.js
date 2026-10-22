// Text formatting is stored separately from the animation data.
(()=>{
const KEY='tichu.copy.v1',list=window.TICHU_SCENES,fields=['title','body','note','chip','tip','passBody','passTip','passTitle','largeBody','largeNote','largeTip','smallBody','smallNote','smallTip'],palette=['#fff09a','#ffd1df','#c9e7ff'];
const original=structuredClone(list);let saved={};
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function clean(html){const template=document.createElement('template');template.innerHTML=html;function walk(n){if(n.nodeType===3)return safe(n.textContent);if(n.nodeType!==1)return '';const tag=n.tagName;if(['SCRIPT','STYLE','IFRAME','OBJECT','IMG','SVG'].includes(tag))return '';const inner=[...n.childNodes].map(walk).join('');if(tag==='BR')return '<br>';if(['B','STRONG'].includes(tag))return '<strong>'+inner+'</strong>';if(tag==='MARK'){let c=n.getAttribute('data-color');return `<mark data-color="${palette.includes(c)?c:palette[0]}" style="background-color:${palette.includes(c)?c:palette[0]}">${inner}</mark>`}if(['DIV','P'].includes(tag))return inner+'<br>';return inner}return [...template.content.childNodes].map(walk).join('').replace(/(<br>)+$/,'')}
function plain(html){const d=document.createElement('div');d.innerHTML=html.replace(/<br>/g,'\n');return d.textContent}
function valid(data){return data&&data.version===1&&data.pages&&typeof data.pages==='object'&&!Array.isArray(data.pages)&&Object.entries(data.pages).every(([key,v])=>list.some(p=>p.type===key)&&v&&fields.every(f=>(!['title','body','note'].includes(f)&&v[f]===undefined)||(typeof v[f]==='string'&&v[f].length<=30000)))}
function apply(){list.forEach((p,i)=>{const v=saved[p.type];for(const f of fields)p[f]=v&&v[f]!==undefined?plain(v[f]):original[i][f]||''})}
try{const data=window.readTichuData(KEY);if(valid(data))saved=Object.fromEntries(Object.entries(data.pages).map(([k,v])=>[k,Object.fromEntries(fields.filter(f=>v[f]!==undefined).map(f=>[f,clean(v[f])]))]));}catch{}
if(saved.collect&&!saved.collect.note.includes('가져온 카드는 뒤집어서'))saved.collect.note+=(saved.collect.note?'<br>':'')+original.find(p=>p.type==='collect').note;
if(saved.first?.note)saved.first.note=saved.first.note.replace('1을 꼭 내야 하는 것은 아니에요. 어떤 조합을 낼 수 있는지는 뒤에서 알려드릴게요!', '낼 수 있는 카드는 특수규칙에서 확인할 수 있어요.');
apply();
window.higherMode='play';window.declarationMode='large';
window.pageChip=i=>list[i].chip||list[i].title;
function overviewCards(html){
const source=document.createElement('div');source.innerHTML=html;const lines=[''];
function walk(node,bold=false,color=null){if(node.nodeType===3){node.textContent.split('\n').forEach((part,i)=>{if(i)lines.push('');let value=safe(part);if(bold)value='<strong>'+value+'</strong>';if(color)value='<mark data-color="'+color+'" style="background-color:'+color+'">'+value+'</mark>';lines[lines.length-1]+=value});return}if(node.nodeType!==1)return;if(node.tagName==='BR'){lines.push('');return}const b=bold||['STRONG','B'].includes(node.tagName),c=node.tagName==='MARK'?node.dataset.color:color;[...node.childNodes].forEach(child=>walk(child,b,c))}
[...source.childNodes].forEach(n=>walk(n));
const icons=['<circle cx="8" cy="8" r="3"/><circle cx="20" cy="8" r="3"/><path d="M3 23v-5a5 5 0 0110 0v5M15 23v-5a5 5 0 0110 0v5"/>','<rect x="4" y="7" width="12" height="17" rx="2"/><rect x="12" y="3" width="12" height="17" rx="2"/>','<path d="M4 23l7-7 5 3 8-14M16 5h8v8"/>','<rect x="9" y="3" width="12" height="17" rx="2"/><path d="M4 15v6a5 5 0 005 5h13M12 11l3 3 6-7"/>','<path d="M8 3h12v8a6 6 0 01-12 0zM8 6H3v4a5 5 0 005 5M20 6h5v4a5 5 0 01-5 5M14 17v7M8 25h12"/>'];
return lines.filter(line=>plain(line).trim()).map((line,i)=>{const root=document.createElement('div');root.innerHTML=line;const raw=root.textContent,at=raw.indexOf('—');let heading=line,description='';if(at>=0){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let offset=0,node;while(node=walker.nextNode()){if(at<offset+node.length){const a=document.createRange(),b=document.createRange();a.selectNodeContents(root);a.setEnd(node,at-offset);b.selectNodeContents(root);b.setStart(node,at-offset+1);const left=document.createElement('div'),right=document.createElement('div');left.append(a.cloneContents());right.append(b.cloneContents());heading=left.innerHTML;description=right.innerHTML;break}offset+=node.length}}
return `<article class="core-card"><div class="core-card-top"><svg viewBox="0 0 28 28" aria-hidden="true">${icons[i%icons.length]}</svg><span>${String(i+1).padStart(2,'0')}</span></div><h2>${heading}</h2><p>${description}</p></article>`}).join('')}
window.paintCopy=i=>{const p=list[i],v=saved[p.type]||{},passing=p.type==='higher'&&window.higherMode==='pass';
for(const target of ['title','body','note','tip']){const field=p.type==='declarations'&&target!=='title'?window.declarationMode+target[0].toUpperCase()+target.slice(1):target==='title'&&passing?'passTitle':target==='body'&&passing?'passBody':target==='tip'&&passing?'passTip':target;document.getElementById(target).innerHTML=v[field]!==undefined?v[field]:safe(p[field]||'').replace(/\n/g,'<br>')}
document.getElementById('body').hidden=p.type==='overview';document.getElementById('overview-cards').hidden=p.type!=='overview';if(p.type==='overview')document.getElementById('overview-cards').innerHTML=overviewCards(document.getElementById('body').innerHTML);
document.getElementById('count').textContent=i?`${i} / ${list.length-1}`:'게임 소개';
document.getElementById('note').hidden=passing||!document.getElementById('note').textContent.trim();document.getElementById('tip-block').hidden=!document.getElementById('tip').textContent.trim();
document.getElementById('scene').setAttribute('aria-label',p.title+' '+(passing?p.passBody:p.body));
};
})();
