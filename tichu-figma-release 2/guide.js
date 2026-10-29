const pages=window.GUIDE_PAGES,byId=id=>pages.find(p=>p.id===id),phases=['시작 준비','카드 플레이','플레이 마무리'];
let current='intro',history=[],doubleVictory=false;
const plainText=s=>{const t=document.createElement('template');t.innerHTML=s;return t.content.textContent};
function icon(p,name,cls=''){const src=p.icons[name];return src?`<img class="${cls}" src="${src}" alt="">`:''}
const coreIcons=['<circle cx="8" cy="8" r="3"/><circle cx="20" cy="8" r="3"/><path d="M3 23v-5a5 5 0 0110 0v5M15 23v-5a5 5 0 0110 0v5"/>','<rect x="4" y="7" width="12" height="17" rx="2"/><rect x="12" y="3" width="12" height="17" rx="2"/>','<path d="M4 23l7-7 5 3 8-14M16 5h8v8"/>','<rect x="9" y="3" width="12" height="17" rx="2"/><path d="M4 15v6a5 5 0 005 5h13M12 11l3 3 6-7"/>','<path d="M8 3h12v8a6 6 0 01-12 0zM8 6H3v4a5 5 0 005 5M20 6h5v4a5 5 0 01-5 5M14 17v7M8 25h12"/>'];
function phase(p){return p.step<=6?0:p.step<=9?1:2}
function tipBody(p,index){
 const notes={teams:['같은 팀은 서로 도우면서 손에 든 카드를 먼저 비우는 것이 목표예요.<br>자신의 카드를 팀원에게 보여주지는 않아요.'],deal8:['처음 받은 8장을 보고 라지 티츄를 선언할지 결정해요. 나머지 6장을 받기 전에 결정해야 해요.'],large:['선언한 본인이 가장 먼저 손패를 비우면 +200점, 그렇지 않으면 −200점이에요. 카드 점수 또는 원투 점수와 별도로 계산해요.','용·A·봉황 같은 강한 카드나 폭탄, 긴 조합이 있다면 선언을 고려해 보세요. 선언은 선택이에요.'],deal6:['같은 숫자와 연속된 숫자를 모으면 페어·트리플·스트레이트 같은 조합을 찾기 쉬워요.'],small:['라지 티츄는 8장을 보고 선언하며 ±200점이에요. 스몰 티츄는 자신의 첫 카드를 내기 전까지 선언할 수 있고 ±100점이에요.','용·A·봉황처럼 강한 카드, 긴 스트레이트나 연속 페어, 폭탄이 있다면 선언을 고려해 보세요.'],exchange:['팀원이 티츄를 선언했다면 1등을 할 수 있도록 도와주세요. 상대에게 줄 카드를 고를 때에는 자신의 조합도 함께 생각해 보세요.'],first:['참새는 숫자 1로 사용해요. 참새를 가진 사람이 먼저 시작하지만, 참새 카드를 먼저 낼 필요는 없어요.','싱글·페어·트리플·연속 페어·풀하우스·스트레이트를 낼 수 있어요.'],higher:['앞사람과 같은 종류·같은 장수의 더 높은 조합을 내세요. 폭탄은 별도 규칙을 따라요.','낼 카드가 있어도 패스할 수 있어요. 한 번 패스했더라도 다음 차례에 다시 카드를 낼 수 있어요. 세 사람이 연달아 패스하면 마지막에 낸 사람이 카드를 가져가요.','참새·개·봉황·용은 각각 특별한 규칙이 있어요.'],collect:['참새는 숫자 1로 쓰며, 낼 때 일반 카드 숫자 하나를 소원으로 요청할 수 있어요.'],redistribute:['1등이 같은 팀이어도 게임 중 가져와 모아둔 카드는 1등에게 주세요. 손에 남은 카드는 상대 팀에게 줘요.'],score:['5는 +5점, 10과 K는 +10점, 용은 +25점, 봉황은 −25점이에요. 나머지 카드는 0점이에요.'],declarationScore:['티츄는 팀이 아니라 선언한 본인이 1등이어야 성공해요. 라지 티츄는 ±200점, 스몰 티츄는 ±100점을 카드 점수나 원투 점수에 별도로 더하거나 빼요.'],end:['5는 +5점, 10과 K는 +10점, 용은 +25점, 봉황은 −25점이며 나머지 카드는 0점이에요.']};
 let body=notes[p.id]?.[index]||'';const label=p.tips[index]||'';
 if(/몇 점/.test(label))body+='<button class="reference-link" data-reference="points">카드별 점수표 자세히 보기</button>';
 if(['large','small'].includes(p.id)&&index===1)body+=`<div class="declaration-card-examples"><figure><img src="assets/cards/dragon.png" alt="용 카드"><figcaption>용</figcaption></figure><figure><img src="assets/cards/phoenix.png" alt="봉황 카드"><figcaption>봉황</figcaption></figure><figure><svg viewBox="0 0 88 125" role="img" aria-label="같은 숫자 7 네 장의 폭탄">${[[22,31],[66,31],[22,91],[66,91]].map(([x,y],j)=>card(x,y,7,j%2?K:R,36,54)).join('')}</svg><figcaption>폭탄 · 같은 숫자 4장</figcaption></figure><figure class="bomb-run"><svg viewBox="0 0 230 78" role="img" aria-label="같은 다이아몬드 무늬의 3, 4, 5, 6, 7 스트레이트 폭탄">${[3,4,5,6,7].map((n,j)=>card(23+j*46,37,n,R,36,60)+txt(23+j*46,55,'◆',10,R)).join('')}</svg><figcaption>폭탄 · 같은 무늬의 연속 숫자 5장 이상</figcaption></figure></div>`;
 return body;
}
function pageReferences(p){
 const refs={resume:['combinations','special'],first:['combinations','special'],higher:['combinations','special'],collect:['special']}[p.id];
 return refs?`<nav class="page-references" aria-label="규칙 자세히 보기">${refs.map(ref=>`<button data-reference="${ref}">${ref==='special'?'특수카드':'카드조합'} 자세히 보기<span aria-hidden="true">↗</span></button>`).join('')}</nav>`:'';
}
function backButton(p){return `<button class="back" data-back aria-label="이전">${icon(p,'imgEvaArrowBackFill')||icon(pages[0],'imgEvaArrowBackFill')}</button>`}
const scoringChoices={
 rank:[['1 · 2등이 서로 같은 팀이에요','double'],['1 · 2등이 서로 다른 팀이에요','redistribute']],
 double:[['티츄 선언한 사람이 있어요','declarationScore'],['티츄 선언한 사람이 없어요','end']],
 score:[['티츄 선언한 사람이 있어요','declarationScore'],['티츄 선언한 사람이 없어요','end']],
 end:[['네','complete'],['아니오','resume']]
};
function footer(p){
 if(!p)return '<button class="primary" data-go="teams">시작하기</button>';
 if(scoringChoices[p.id])return `<div class="choice-navigation">${backButton(p)}<div class="choice-buttons">`+scoringChoices[p.id].map(([t,id],i)=>`<button class="${i?'secondary':'primary'}" data-go="${id}">${t}</button>`).join('')+'</div></div>';
 const order=['teams','deal8','large','deal6','small','exchange','first','higher','collect','rank'];
 const next={resume:'higher',redistribute:'score',declarationScore:'end'}[p.id]||order[order.indexOf(p.id)+1]||'rank';
 const label={redistribute:'카드 점수 계산하기',declarationScore:'누적 점수 확인하기'}[p.id]||'다음';
 return `<div class="standard-navigation">${backButton(p)}<button class="primary" data-go="${next}">${label}</button></div>`;
}
function showGuide(id,push=true){
 if(id==='complete'){const d=$('complete');d.showModal();return}
 if(push&&current!==id)history.push(current);current=id;const p=byId(id),cover=!p;
 $('guide').classList.toggle('intro',cover);$('guide').classList.toggle('branch',!!p&&!!scoringChoices[p.id]);
 const identity=p||window.GUIDE_COVER;
 $('guide-header').innerHTML=`<div class="topline"><button id="open-flow">${icon(identity,'imgAndrsrxnMenuBurger')}<span>전체 흐름 보기</span></button><span class="wordmark">TICHU</span></div>`+(p?`<nav class="phase-tabs" aria-label="게임 단계">${phases.map((t,i)=>`<button data-phase="${i}" aria-current="${phase(p)===i}">${t}</button>`).join('')}</nav><div class="step-progress" aria-label="12단계 중 ${p.step}단계">${Array.from({length:12},(_,i)=>`<span class="${i<p.step?'done':''}"></span>`).join('')}</div>`:'');
 if(cover){
  $('guide-main').innerHTML=`<section class="cover-content" data-figma-node="219:3591"><h1>티츄는 이런 게임이에요</h1><div class="intro-card-grid">${[['2:2 팀전','2명씩 팀을 이루어 경쟁해요.'],['카드 조합','정해진 족보에 따라 카드를 내요.'],['높은 카드 경쟁','앞서 나온 카드보다 높은 조합을 내요.'],['손패 소진','손에 든 카드를 모두 내려놓아야 해요.'],['점수 경쟁','카드를 모으고 순위 보너스를 얻어 점수를 쌓아요.']].map(([t,b],i)=>`<article class="intro-card"><div class="intro-card-top"><svg viewBox="0 0 28 28" aria-hidden="true">${coreIcons[i]}</svg><span>${String(i+1).padStart(2,'0')}</span></div><h2>${t}</h2><p>${b}</p></article>`).join('')}</div></section>`;
 }else{
  $('guide-main').innerHTML=`<section class="step-content ${p.id==='end'?'endgame':''}" data-figma-node="${p.node}"><h1>${p.title}</h1><div class="animation-wrap"><div id="scene" role="img" aria-label="${esc(plainText(p.title))}"></div></div><div class="support">${p.combinationReminder?`<section class="combination-reminder"><h2>같은 종류 · 같은 장수로 내요</h2><p>싱글에는 싱글, <strong>페어에는 페어</strong>, 트리플에는 트리플을 내야 해요.</p><p>스트레이트도 앞사람과 <strong>장수가 같아야</strong> 해요. 그 안에서 숫자가 더 높은 조합을 내세요.</p><p class="combination-exception">폭탄은 예외예요. 자세한 규칙은 카드조합·특수카드에서 확인하세요.</p></section>`:''}<section class="action"><div class="action-label">${icon(p,'imgGroup','hand-icon')}<span>지금 할 행동</span></div><div class="action-copy">${p.action}</div></section>${p.prompt?`<p class="support-prompt">${p.prompt}</p>`:''}${pageReferences(p)}<div class="tips">${p.tips.map((label,i)=>`<details class="tip"><summary><span>${label.replace(/^TIP\s*[/／·:]?\s*/,'TIP / ')}</span>${icon(p,'imgAkarIconsChevronDownSmall')}</summary><div class="tip-content">${tipBody(p,i)}</div></details>`).join('')}</div></div></section>`;
  page=p.scene;elapsed=0;cycle=0;playing=true;window.guideMotion=p.id;window.declarationMode='large';render(reduced?4.5:0);
 }
 $('guide-footer').innerHTML=footer(p);$('guide-footer').classList.toggle('choices',!!p&&!!scoringChoices[p.id]);
 window.decorateGuideTerms($('guide-main'),id);
 document.title=cover?'TICHU — 티츄 설명서':`${p.label} — TICHU`;$('guide-main').scrollTo({top:0,behavior:'instant'});
}
let flowAnimation;
function closeFlow(immediate=false){
 const panel=$('flow-menu');if(!panel.open)return;
 if(flowAnimation)flowAnimation.cancel();
 if(immediate||reduced){panel.close();return}
 flowAnimation=panel.animate([{transform:'translateX(0)'},{transform:'translateX(-100%)'}],{duration:220,easing:'cubic-bezier(.4,0,1,1)'});
 flowAnimation.finished.then(()=>panel.close()).catch(()=>{});
}
$('guide-main').addEventListener('toggle',e=>{
 const tip=e.target;if(!tip.matches('details.tip')||!tip.open)return;
 requestAnimationFrame(()=>tip.scrollIntoView({block:'nearest',behavior:reduced?'instant':'smooth'}));
},true);
function openFlow(){
 const groups=[
  {title:'시작<br>준비',description:'카드를 나누고,<br>교환하며 전략을<br>세워요.',items:[['팀 나누기','teams'],['카드 8장 받기','deal8'],['라지 티츄 선언하기','large'],['카드 6장 받기','deal6'],['카드 3장 교환하기','exchange']]},
  {title:'카드<br>플레이',description:'더 높은 조합을<br>내고, 카드를<br>모두 비워요.',items:[['스몰 티츄','small'],['첫 카드 내기','first'],['다시 카드 내기','resume'],['조합 내기 · 패스','higher'],['트릭 획득','collect']]},
  {title:'플레이<br>마무리',description:'순위를 정하고,<br>획득한 카드의<br>점수를 계산해요.',items:[['순위 결정','rank'],['점수 계산','score'],['최종 승리','end']]}
 ];
 const active={double:'rank',redistribute:'score',declarationScore:'score'}[current]||current;
 $('flow-content').innerHTML='<nav class="flow-navigation" aria-label="게임 전체 흐름" data-figma-node="213:156">'+groups.map(g=>`<section class="flow-stage"><div class="flow-stage-description"><h3>${g.title}</h3><p>${g.description}</p></div><div class="flow-stage-links">${g.items.map(([label,id])=>`<button data-go="${id}" ${id===active?'aria-current="page"':''}>${label}</button>`).join('')}</div></section>`).join('')+'</nav><div class="flow-extras"><button class="cover-link" data-go="intro">티츄는 이런 게임이에요</button><section class="flow-group"><h3>규칙 찾아보기</h3><button data-reference="combinations">카드 조합</button><button data-reference="special">특수카드</button><button data-reference="points">카드별 점수표</button></section></div>';
 const panel=$('flow-menu');if(flowAnimation)flowAnimation.cancel();panel.showModal();panel.scrollTop=0;
 if(!reduced)flowAnimation=panel.animate([{transform:'translateX(-100%)'},{transform:'translateX(0)'}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});
}
$('flow-menu').addEventListener('cancel',e=>{e.preventDefault();closeFlow()});
document.addEventListener('click',e=>{
 const go=e.target.closest('[data-go]');if(go){if($('flow-menu').open)closeFlow(true);if(current==='rank')doubleVictory=go.dataset.go==='double';showGuide(go.dataset.go);return}
 if(e.target.closest('[data-back]')){showGuide(history.pop()||'intro',false);return}
 const tab=e.target.closest('[data-phase]');if(tab){showGuide(['teams','first','rank'][Number(tab.dataset.phase)]);return}
 if(e.target.closest('#open-flow')){openFlow();return}
 const ref=e.target.closest('[data-reference]');if(ref){if($('flow-menu').open)closeFlow(true);window.openRules(ref.dataset.reference);return}
 const close=e.target.closest('.close-dialog');if(close){const dialog=close.closest('dialog');if(dialog.id==='flow-menu')closeFlow();else dialog.close()}
 if(e.target.closest('#restart-guide')){$('complete').close();history=[];showGuide('intro',false)}
});
for(const d of [$('flow-menu'),$('complete')])d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){if(d.id==='flow-menu')closeFlow();else d.close()}}});
media.addEventListener('change',e=>{reduced=e.matches;if(byId(current)&&current!=='end')render(4.5)});
function tick(now){const delta=last?Math.min(now-last,100):0;last=now;const p=byId(current);if(p&&p.id!=='end'&&playing&&!reduced&&!document.hidden){elapsed+=delta;const duration=p.id==='higher'?2400:5000;if(elapsed>=duration){elapsed%=duration;cycle++}render(elapsed/1000)}requestAnimationFrame(tick)}
showGuide('intro',false);requestAnimationFrame(tick);
