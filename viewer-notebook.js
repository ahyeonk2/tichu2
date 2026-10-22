/* Read-only notebook navigation. */
(()=>{
const groups=structuredClone(window.TICHU_PUBLISHED_EDITS['tichu.notebook.v1'].groups);
let active='all',position=0;
const groupNow=()=>groups.find(g=>g.id===active);
const items=()=>active==='all'?scenes.map((s,i)=>({id:'all-'+i,scene:i,kind:'page'})).filter(e=>e.scene>0):(groupNow()?.entries||[]);
const label=e=>e.kind==='cut'?e.label:scenes[e.scene].title;
function animate(){const el=document.querySelector('.page');el.classList.remove('paper-enter');void el.offsetWidth;el.classList.add('paper-enter')}
function draw(){
 $('index-tabs').innerHTML=groups.map((g,i)=>`<button class="index-tab flow-tab" data-index="${esc(g.id)}" aria-current="${active===g.id}" style="--tab-color:${g.color}"><span class="index-number">${String(i+1).padStart(2,'0')}</span>${esc(g.name)}<small>${g.entries.length}개</small></button>`).join('')+`<button class="index-tab" data-index="all" aria-current="${active==='all'}" style="--tab-color:#f3f1ef">전체<small>${scenes.length-1}페이지</small></button>`;
 $('subindex-name').textContent=groupNow()?.name||'전체 페이지';$('collection-name').textContent=groupNow()?.name||'전체 페이지';
 $('collection-pages').innerHTML=items().map((e,i)=>`<button class="subindex-item" data-entry="${i}" aria-current="${position===i}" title="${esc(label(e))}">${esc(e.kind==='cut'?e.label:window.pageChip(e.scene))}</button>`).join('');
 $('prev').disabled=position<=0;const atEnd=position>=items().length-1;$('next').hidden=atEnd&&!nextIndex();$('next').disabled=false;$('next').textContent=roundRestart()?'다음 라운드하기':atEnd?'다음 단계로 넘어가기':'다음 →';if(scenes[page].type==='flow')window.drawFlow?.();
}
function roundRestart(){const current=groupNow();return current&&flowRole(current)==='finish'&&scenes[page].type==='next'?groups.find(g=>flowRole(g)==='prepare')||null:null}
function nextIndex(){if(active==='all')return null;const restart=roundRestart();return restart||groups[groups.findIndex(g=>g.id===active)+1]||null}
function advance(){const restart=roundRestart();if(restart){select(restart.id);return}if(position<items().length-1)go(position+1);else{const next=nextIndex();if(next)select(next.id)}}
function go(index,turn=true){const list=items();position=Math.max(0,Math.min(list.length-1,index));const e=list[position];window.activeCut=null;
 if(e){show(e.scene);playing=true;if(e.kind==='cut'){window.activeCut={start:e.start,end:e.end};elapsed=reduced?e.end-1:e.start;cycle=e.variant;render(elapsed/1000)}$('scene').hidden=!!scenes[page].textOnly;document.querySelector('.copy').hidden=false;
 }else{playing=false;$('scene').innerHTML='<div class="empty-collection">등록된 페이지가 없어요.</div>';$('scene').hidden=false;document.querySelector('.copy').hidden=true;$('bars').innerHTML='';$('count').textContent='0개';for(const id of ['rule-source','open-card-rules','open-score-rules','open-special-rules','higher-tabs','declaration-tabs'])$(id).hidden=true;}
 draw();if(turn){animate();window.scrollTo({top:0,behavior:'instant'})}
}
function select(id){active=id;go(0)}
$('index-tabs').onclick=e=>{const b=e.target.closest('[data-index]');if(b)select(b.dataset.index)};
$('collection-pages').onclick=e=>{const b=e.target.closest('[data-entry]');if(b)go(Number(b.dataset.entry))};
$('prev').onclick=()=>go(position-1);$('next').onclick=advance;
document.addEventListener('keydown',e=>{if(document.getElementById('rules-sheet')?.open||document.querySelector('.notebook').classList.contains('is-cover'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();if(e.key==='ArrowRight')advance();else go(position-1)}},true);
function flowRole(g){const nums=g.entries.map(e=>e.scene);if(nums.includes(13))return 'map';if(nums.length&&nums.every(i=>i>=14))return 'reference';if(nums.some(i=>i>=2&&i<=6))return 'prepare';if(nums.some(i=>i>=7&&i<=9))return 'play';if(nums.some(i=>i>=10&&i<=12))return 'finish';return 'intro'}
window.drawFlow=()=>{const signature=JSON.stringify(groups);const root=$('scene');if(root.querySelector('.flow-map')&&root.dataset.flowSignature===signature)return;root.dataset.flowSignature=signature;const flowGroups=groups.filter(g=>flowRole(g)!=='map');const roundPositions=flowGroups.map((g,i)=>['prepare','play','finish'].includes(flowRole(g))?i:-1).filter(i=>i>=0),first=Math.min(...roundPositions),last=Math.max(...roundPositions);let html='<div class="flow-map"><div class="round-strip"><span>라운드 1</span><b>→</b><span>라운드 2</span><b>→</b><span>라운드 3…</span></div><p class="flow-hint">인덱스를 따라 한 라운드씩 진행해요</p>';
const descriptions={intro:'게임과 팀 알아보기',prepare:'8장 → 선언 선택 → 6장 → 교환',play:'카드 내기 ↔ 넘기기 → 획득 · 반복',finish:'순위 결정 → 점수 계산 → 누적',map:'지금 보고 있는 전체 흐름',reference:'폭탄 · 특수 카드 · 선언 · 동시 종료'};
flowGroups.forEach((g,i)=>{const role=flowRole(g);const number=groups.indexOf(g)+1;if(['prepare','play','finish'].includes(role)&&(i===0||!['prepare','play','finish'].includes(flowRole(flowGroups[i-1]))))html+='<section class="round-bracket"><h3>한 라운드 <small>준비부터 점수 계산까지, 14장의 카드를 받아 모두 소진할 때까지 진행하는 한 판.</small></h3>';html+=`<button class="flow-node" data-flow-index="${esc(g.id)}" style="--node-color:${g.color}"><span><b>${esc(g.name)}</b><small>${descriptions[role]}</small>${role==='play'?'<span class="flow-definitions"><span><strong>트릭:</strong> 누군가 카드를 내기 시작해 나머지 사람들이 패스하고, 카드를 획득하기까지의 과정</span><small class="flow-trick-repeat">한 라운드 안에서 여러 번의 트릭을 반복해요.</small></span>':''}</span><span aria-hidden="true">↗</span></button>`;if(['prepare','play','finish'].includes(role)&&(i===flowGroups.length-1||!['prepare','play','finish'].includes(flowRole(flowGroups[i+1])))){const target=groups.find(g=>flowRole(g)==='prepare');if(i===last)html+=`<div class="round-return">↶ <strong>1,000점 미만이면</strong> <button ${target?`data-flow-index="${esc(target.id)}"`:''}>다음 라운드 준비</button></div>`;html+='</section>';if(i===last)html+='<p class="round-goal"><strong>1,000점 도달</strong> → 게임 종료 확인</p>'}else if(i<flowGroups.length-1)html+='<div class="flow-connector" aria-hidden="true">↓</div>'});if(!flowGroups.length)html+='<p>등록된 진행순서가 없어요.</p>';html+='<p class="flow-footnote">두 팀 모두 1,000점 이상이면 높은 팀이 승리하고, 동점이면 계속해요.</p></div>';root.innerHTML=html;};
$('scene').addEventListener('click',e=>{const b=e.target.closest('[data-flow-index]');if(b)select(b.dataset.flowIndex)});


const book=document.querySelector('.notebook');
function cover(){window.activeCut=null;book.classList.add('is-cover');show(0);playing=true;$('scene').hidden=false;document.querySelector('.copy').hidden=false;window.scrollTo({top:0,behavior:'instant'})}
$('open-cover').onclick=cover;
$('start-book').onclick=()=>{const open=()=>{book.classList.remove('is-cover','opening');const introduction=groups.find(g=>g.entries.some(e=>e.scene===13))||groups.find(g=>g.name.includes('게임 소개'))||groups[0];active=introduction?.id||'all';go(0);window.scrollTo({top:0,behavior:'instant'})};if(reduced){open();return}book.classList.add('opening');setTimeout(open,320)};
cover();
})();
