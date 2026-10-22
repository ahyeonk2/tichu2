/* SVG elements are redrawn at a deterministic 0–5 second frame.
   No page auto-advance; only the active scene owns an animation clock. */
const scenes=window.TICHU_SCENES, $=id=>document.getElementById(id);
const R='#ae2d3c',B='#367fb8',K='#2c2926',G='#aaa39b';
const P=[[212,60],[376,188],[212,316],[48,188]],H=[[212,104],[326,188],[212,272],[98,188]];
let page=0,elapsed=0,playing=true,speed=1,last=0,cycle=0;
const media=matchMedia('(prefers-reduced-motion: reduce)');let reduced=media.matches;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},lerp=(a,b,t)=>a+(b-a)*t;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function txt(x,y,s,size=16,color=K,weight=400){return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-size="${size}" font-weight="${weight}">${esc(s)}</text>`}
function line(x,y,a,b,color=G,dash=''){return `<path d="M${x} ${y}L${a} ${b}" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="6 5"':''} fill="none"/>`}
function group(s,x=0,y=0,opacity=1){return `<g transform="translate(${x} ${y})" opacity="${opacity}">${s}</g>`}
function card(x,y,n='',color=K,w=28,h=43){return `<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="3" fill="white" stroke="${color}" stroke-width="1.6"/>${n!==''?txt(x,y+1,n,w*.61,color):line(x-w/2+5,y-6,x+w/2-5,y+6,'#d5d0cb')}`}
function hand(i,count=3,label=''){let [x,y]=H[i],s='';for(let j=0;j<count;j++)s+=card(x+(j-(count-1)/2)*7,y-j*3,'',K,21,30);return s+(label?txt(x,y+30,label,12,G):'')}
function cards(nums,x,y,color=K,w=31){return nums.map((n,j)=>card(x+(j-(nums.length-1)/2)*(w+5),y,n,color,w,w*1.5)).join('')}
function table(t=1){let s='<rect x="64" y="78" width="296" height="220" rx="86" fill="white" stroke="'+K+'" stroke-width="2.5"/>';P.forEach(([x,y],i)=>{s+=group(`<circle cx="${x}" cy="${y}" r="16" fill="white" stroke="${K}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="6" fill="${i%2?B:R}"/>`,0,0,clamp(t*4-i*.16))});return s}
function bubble(i,s,alpha=1){let [x,y]=P[i];x=i===1?333:i===3?91:x;y=i===0?25:i===2?348:y-42;const w=Math.max(70,s.length*13+22);return group(`<rect x="${x-w/2}" y="${y-15}" width="${w}" height="30" rx="9" fill="white" stroke="${i%2?B:R}" stroke-width="1.4"/>${txt(x,y,s,13,i%2?B:R)}`,0,0,alpha)}
// Animated scenes describe visible actions; scoring effects belong in editable copy.
function declarationBubble(thinking,label,alpha=1){
const shape=thinking?`<path d="M132 158C116 147 99 163 107 179C92 193 111 215 128 210C139 227 160 225 171 216C192 228 216 225 228 217C246 228 270 225 280 214C301 222 321 207 315 190C330 174 313 154 294 159C282 141 259 144 248 152C229 139 204 142 192 151C173 139 147 142 132 158Z" fill="#faf8f8" stroke="#d8c9cc" stroke-width="1.5"/><circle cx="218" cy="129" r="3" fill="#faf8f8" stroke="#d8c9cc"/><circle cx="227" cy="141" r="5" fill="#faf8f8" stroke="#d8c9cc"/>`:`<path d="M147 155H199L211 140L217 155H277Q293 155 293 171V201Q293 217 277 217H147Q131 217 131 201V171Q131 155 147 155Z" fill="#fff8f9" stroke="${R}" stroke-width="1.6"/>`;
return group(shape+(thinking?txt(212,176,'1등 할 수',17,K)+txt(212,199,'있을 것 같아',17,K):txt(212,188,label,22,R,700)),0,0,alpha);
}
function packet(x,y){return [0,1,2].map(j=>card(x+j*3,y-j*3,'',K,25,37)).join('')}
function movingCard(a,b,q,n='',color=K){q=ease(q);return card(lerp(a[0],b[0],q),lerp(a[1],b[1],q),n,color,25,37)}
function render(t){let s='',type=scenes[page].type;
$('scene').classList.toggle('flow-scene',['flow','points','combinations'].includes(type));$('scene').setAttribute('role',['flow','points','combinations'].includes(type)?'group':'img');
if(scenes[page].textOnly){$('scene').innerHTML='';return}
if(type==='flow'&&window.drawFlow){window.drawFlow();return}
if(['points','combinations'].includes(type)&&window.drawRulePage){window.drawRulePage(type);return}
if(scenes[page].rule){const rule=scenes[page].rule;s=txt(212,45,'티츄 특수 규칙',16,R);
if(rule==='combinations'){s+=cards([7],80,130,R)+cards([7,7],230,130,B)+txt(80,185,'한 장',16,R)+txt(230,185,'페어',16,B)+cards([3,4,5,6,7],212,260,R,30)+txt(212,318,'스트레이트 · 자세한 조합은 아래에서',13,R)}
else if(rule==='bomb'){s+=cards([7,7,7,7],212,135,R,34)+txt(212,193,'같은 숫자 4장',16,R)+cards([3,4,5,6,7],212,258,B,30)+txt(212,315,'같은 무늬의 연속 숫자 5장 이상',14,B)}
else if(rule==='declarations'){const large=window.declarationMode!=='small';s+=txt(212,112,large?'라지 티츄':'스몰 티츄',27,R,700)+txt(212,180,large?'±200점':'±100점',38,R,700)+txt(212,249,large?'9번째 카드를 받기 전에':'자신의 첫 카드를 내기 전에',17,K)+txt(212,294,'선언한 본인이 1위!',20,K)}
else if(rule==='double'){
 s=table();const order=[0,2],done=Math.min(2,Math.max(0,Math.floor((t-.4)/1.2)+1));
 for(let i=0;i<4;i++){const rank=order.indexOf(i);if(rank<0||rank>=done)s+=hand(i);else s+=bubble(i,`${rank+1}위`,ease((t-(.4+rank*1.2))/.3))}
 if(t>1.9)s+=line(212,104,212,272,R,true)+txt(212,175,'같은 팀 1·2위',22,R,700)+txt(212,205,'라운드 종료',18,K);
}
else{const names={mahjong:['참새','1 · 소원'],dog:['개','팀원에게 선 넘기기'],phoenix:['봉황','−25점 · 대체 카드'],dragon:['용','+25점 · 가장 강한 한 장']};const [name,sub]=names[rule];s+=`<image href="assets/cards/${rule}.png" x="146" y="76" width="132" height="208" preserveAspectRatio="xMidYMid meet"><title>${name} 카드</title></image>`+txt(212,315,sub,19,K)}
$('scene').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 424 374" aria-hidden="true">${s}</svg>`;return;}

if(type==='higher'&&window.higherMode==='pass'){
s=table()+cards([8,8],212,195,B);P.forEach((_,i)=>s+=hand(i));if(t>.3)s+=bubble(3,'넘길게요',ease((t-.3)/.25));
}else if(['intro','higher'].includes(type)){
const examples=[[[5],[8]],[[5,5],[8,8]],[[4,4,4],[9,9,9]],[[2,3,4,5,6],[5,6,7,8,9]]];
const pair=examples[type==='intro'?cycle%4:1+cycle%2];
s=type==='intro'?'':table();
if(type!=='intro')s+=txt(212,96,'앞사람이 낸 카드',15,B);
const y=type==='intro'?190:190;
s+=cards(pair[0],203,y,K,type==='intro'?36:29);
let q=ease((t-.8)/1.1);s+=group(cards(pair[1],220,y+13,R,type==='intro'?36:29),0,lerp(160,0,q),q);
if(type!=='intro')s+=txt(212,346,t<1?'같은 종류의 카드 조합':'그 위에 더 높은 카드를 내요',15,R);
}else if(type==='teams'){
s=table(t);let a=ease((t-.7)/.6),b=ease((t-1.5)/.6);s+=group(line(212,104,212,280,R,true)+txt(212,151,'빨간 팀',20,R),0,0,a);s+=group(line(86,188,338,188,B,true)+txt(212,235,'파란 팀',20,B),0,0,b);
}else if(type==='deal8'||type==='deal6'){
s=table();const q=ease((t-.35)/.7),total=type==='deal8'?8:6;
for(let i=0;i<4;i++){s+=packet(lerp(212,H[i][0],q),lerp(188,H[i][1],q));if(q===1)s+=txt(H[i][0],H[i][1]+32,`${type==='deal6'?14:total}장`,12,G)}
s+=txt(212,231,type==='deal8'?'8장씩 나눠 받아요':'6장씩 더 받아요',19,R);
}else if(type==='large'||type==='small'){
s=table()+hand(0,3,type==='large'?'8장':'14장');
if(t<1.8)s+=declarationBubble(true,'',Math.min(ease(t/.25),ease((1.8-t)/.2)));
else s+=declarationBubble(false,type==='large'?'라지 티츄!':'스몰 티츄!',ease((t-1.8)/.25));
}else if(type==='exchange'){
s=table();P.forEach((p,i)=>s+=hand(i));const sender=Math.min(3,Math.floor(t/1.1)),q=clamp((t-sender*1.1)/.75);
for(let target=0;target<4;target++)if(target!==sender){s+=line(...H[sender],...H[target],sender%2?B:R,true);s+=movingCard(H[sender],H[target],q,'',sender%2?B:R)}s+=txt(212,346,t>4.4?'모두 3장을 보내고 3장을 받았어요':'각자 다른 세 사람에게 한 장씩',14,R);
}else if(type==='first'){
s=table()+hand(0,3)+`<image href="assets/cards/mahjong.png" x="192" y="77" width="40" height="63" preserveAspectRatio="xMidYMid meet"><title>참새 카드</title></image>`;
s+=txt(324,59,'← 참새 카드를 가진 사람',11,R);
const examples=[[5,5],[8,8,8],[3,4,5,6,7]],index=Math.min(2,Math.floor(t/(5/3))),local=t-index*(5/3),q=ease((local-.15)/.5),opacity=ease(local/.15)*ease(((5/3)-local)/.2);
s+=group(cards(examples[index],212,lerp(112,213,q),R,29),0,0,opacity);
s+=txt(212,285,['5 · 5','8 · 8 · 8','3 · 4 · 5 · 6 · 7'][index],15,R)+txt(212,342,`첫 카드 예시 ${index+1} / 3`,12,G);
}else if(type==='collect'){
s=table();P.forEach((_,i)=>s+=hand(i));
const gather=ease((t-3.6)/.7),land=ease((t-.25)/.6),flip=ease((t-4.3)/.25);
let pile=cards([5,5],196,187,K,26)+cards([8,8],209,194,B,26);
pile+=group(cards([10,10],218,204,R,29),0,lerp(-97,0,land),ease(t/.2));
s+=group(pile,gather*70,-gather*65,1-flip);
[3,2,1].forEach((i,j)=>{const start=1+j*.8;if(t>=start&&t<start+.7)s+=bubble(i,'넘길게요',ease((t-start)/.12))});
if(t>4.3)s+=group(packet(288,134),0,0,flip);
}else if(type==='rank'){
s=table();for(let i=0;i<4;i++){if(t<i*.9+.4)s+=hand(i);else s+=bubble(i,`${i+1}위`,ease((t-i*.9-.4)/.3))}if(t>3.5)s+=txt(212,188,'한 판 종료',24,R,700);
}else if(type==='score'||type==='next'){
if(type==='score'){s=txt(212,37,'모아 둔 카드를 펼쳐 확인해요',17,R);[5,10,13,5].forEach((n,i)=>{const q=ease((t-i*.35)/.6);s+=card(lerp(212,100+i*75,q),lerp(110,220,q),n,i%2?B:R,38,57)});}else{s=table();const q=ease((t-.5)/.8);for(let i=0;i<4;i++)s+=packet(lerp(212,H[i][0],q),lerp(188,H[i][1],q));s+=txt(212,346,'다음 라운드의 카드를 받아요',17,R);}
}else if(type==='flow'){
const labels=[['카드 준비','8장 → 선언 선택 → 6장 → 교환'],['첫 카드 내기','숫자 1을 가진 사람이 먼저 시작'],['반복','카드 내기 → 높이기 또는 넘기기'],['카드 획득','모두 넘기면 마지막 낸 사람이 획득'],['한 판 종료','손패를 비운 순위 결정'],['점수 계산','가져간 카드 더미 점수 합산'],['다음 판','1,000점까지 누적']];let active=Math.min(6,Math.floor(t/.7));labels.forEach(([a,b],i)=>{let y=12+i*49;s+=`<rect x="24" y="${y}" width="365" height="43" rx="5" fill="${i===active?'#fbf2f3':'white'}" stroke="${i===active?R:K}" stroke-width="1.5"/>`+`<text x="39" y="${y+17}" fill="${R}" font-size="14">${a}</text><text x="39" y="${y+33}" fill="${K}" font-size="10">${b}</text>`;if(i<6)s+=line(206,y+43,206,y+49,R)});s+=`<path d="M395 330H407V20H395 M399 15L394 20L399 25 M20 180H9V126H20 M15 121L20 126L15 131" fill="none" stroke="${R}" stroke-width="1.5"/>`;
}else{
s=table();[5,8,10].forEach((n,i)=>s+=group(card(166+i*47,188,n,K,36,54),0,-Math.sin(clamp((t-i*.3)/1.5)*Math.PI)*16));s+=bubble(0,t<2.5?'티츄!':'준비됐나요?',ease(t/.4));}
$('scene').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 424 374" aria-hidden="true">${s}</svg>`;
}
function show(i){page=Math.max(0,Math.min(scenes.length-1,i));elapsed=0;cycle=0;const p=scenes[page];const reference=['points','combinations'].includes(p.type);document.querySelector('.page').classList.toggle('is-reference-page',reference);const copy=document.querySelector('.copy');if(reference)copy.after($('scene'));else copy.before($('scene'));if(!reference)delete $('scene').dataset.rulePage;$('declaration-tabs').hidden=p.type!=='declarations';$('title').textContent=p.title;$('body').textContent=p.body;$('note').textContent=p.note||'';$('note').hidden=!p.note;$('count').textContent=page?`${page} / ${scenes.length-1}`:'게임 소개';$('step').textContent='';$('bars').innerHTML=page>=1&&page<=12?Array.from({length:12},(_,j)=>`<span class="${j<page?'on':''}"></span>`).join(''):'';$('prev').disabled=page===0;$('next').textContent=page===14?'게임 준비하기':'다음 →';$('scene').setAttribute('aria-label',p.title+' '+p.body);render(reduced?4.5:0);window.paintCopy?.(page);$('rule-source').hidden=!p.rule;for(const id of ['open-card-rules','open-special-rules'])$(id).hidden=!['first','higher'].includes(p.type)||(p.type==='higher'&&window.higherMode==='pass');$('open-score-rules').hidden=p.type!=='score';$('higher-tabs').hidden=p.type!=='higher';}
$('declaration-tabs').onclick=e=>{const b=e.target.closest('[data-declaration]');if(!b)return;window.declarationMode=b.dataset.declaration;for(const x of $('declaration-tabs').querySelectorAll('button'))x.setAttribute('aria-pressed',String(x===b));window.paintCopy(page);render(elapsed/1000)};
media.addEventListener('change',e=>{reduced=e.matches;if(reduced)render(4.5)});
function tick(now){const delta=last?Math.min(now-last,100):0;last=now;if(playing&&!reduced&&!document.hidden){elapsed+=delta*speed*(page===0&&!window.activeCut?1.8:1);const cut=window.activeCut, end=cut?cut.end:(scenes[page].type==='higher'?2400:5000), start=cut?cut.start:0;if(elapsed>=end){elapsed=start+(elapsed-end)%(end-start);if(!cut)cycle++}render(elapsed/1000);}requestAnimationFrame(tick)}
$('higher-tabs').onclick=e=>{const button=e.target.closest('[data-higher]');if(!button)return;window.higherMode=button.dataset.higher;for(const b of $('higher-tabs').querySelectorAll('button'))b.setAttribute('aria-pressed',String(b===button));elapsed=0;window.paintCopy(page);for(const id of ['open-card-rules','open-special-rules'])$(id).hidden=window.higherMode==='pass';render(0);};
show(0);requestAnimationFrame(tick);
