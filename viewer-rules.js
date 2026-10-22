/* Read-only reference sheets. */
(()=>{
const dialog=document.createElement('dialog');dialog.id='rules-sheet';dialog.setAttribute('aria-labelledby','rules-sheet-title');
dialog.innerHTML='<div class="sheet-grip" aria-hidden="true"></div><header class="sheet-header"><h2 id="rules-sheet-title"></h2><button id="close-rules-sheet" aria-label="규칙 닫기">×</button></header><div id="rules-sheet-content"></div>';document.body.append(dialog);
let previousPlaying=false,previousOverflow='',origin=null;
const sheetCopy=window.TICHU_PUBLISHED_EDITS['tichu.rule-sheets.v1']||{};
const palette=['#fff09a','#ffd1df','#c9e7ff'];
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function clean(html){const template=document.createElement('template');template.innerHTML=html;function walk(n){if(n.nodeType===3)return safe(n.textContent);if(n.nodeType!==1)return '';const tag=n.tagName;if(['SCRIPT','STYLE','IFRAME','OBJECT','IMG','SVG'].includes(tag))return '';const inner=[...n.childNodes].map(walk).join('');if(tag==='BR')return '<br>';if(['B','STRONG'].includes(tag))return '<strong>'+inner+'</strong>';if(tag==='MARK'){let c=n.getAttribute('data-color');return `<mark data-color="${palette.includes(c)?c:palette[0]}" style="background-color:${palette.includes(c)?c:palette[0]}">${inner}</mark>`}if(['DIV','P'].includes(tag))return inner+'<br>';return inner}return [...template.content.childNodes].map(walk).join('').replace(/(<br>)+$/,'')}
function applyFields(content,view,title=null){
 // Keep navigation buttons intact while making the introductory copy editable.
 content.querySelectorAll('p').forEach(p=>{if(p.querySelector('button')){[...p.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).forEach(n=>{const span=document.createElement('span');span.textContent=n.textContent;n.replaceWith(span)})}});
 const fields=[title,...content.querySelectorAll('h3,.special-summary p,.combination-intro:not(:has(button)),.combination-intro>span,.combination-heading small,.sheet-footnote,.sheet-pill,th,td'),...content.querySelectorAll('[data-sheet-key]')];
 // Keep saved point-table field numbers stable after removing the duplicate chip.
 if(view==='points')fields.splice(1,0,null);
 fields.forEach((el,i)=>{if(!el)return;el.dataset.sheetField=el.dataset.sheetKey||String(i);const value=sheetCopy[view]?.[el.dataset.sheetField];if(typeof value==='string')el.textContent=value;else if(value&&typeof value.html==='string')el.innerHTML=clean(value.html);el.classList.add('sheet-rich');});
}

function prepareSheet(view){applyFields($('rules-sheet-content'),view,$('rules-sheet-title'))}
const suitColors=['#c42439','#2459c5','#367b67','#c47b00'],suits=['✦','◆','✳','▲'];
function mini(rank,suit=0){return `<span class="example-card" style="--suit:${suitColors[suit]}" aria-label="${rank}"><small>${rank}</small><b aria-hidden="true">${suits[suit]}</b><small aria-hidden="true">${rank}</small></span>`}
const special=[
{id:'dragon',name:'용',glyph:'龍',color:'#2b806f',extra:['한 장으로만 냅니다. 스트레이트에는 넣을 수 없고, 폭탄에는 집니다.','트릭을 넘겨도 다음 트릭을 시작할 권리는 유지합니다.','용 위에 폭탄이 나오면 폭탄으로 이긴 사람이 트릭을 가져갑니다. 이때는 상대에게 주지 않습니다.','카드 점수는 +25점입니다.']},
{id:'phoenix',name:'봉황',glyph:'鳳',color:'#c15b66',extra:['조합에서 일반 카드 한 장을 대신할 수 있지만, 폭탄에는 사용할 수 없습니다.','싱글로 처음 내면 1.5이고, 앞 카드 위에 내면 그 카드보다 0.5 높습니다.','A보다 높게 낼 수 있지만 용을 이길 수는 없습니다.','카드 점수는 −25점입니다.']},
{id:'dog',name:'개',glyph:'犬',color:'#8b6c43',extra:['새 트릭을 시작할 때 한 장으로만 냅니다. 다른 카드 위에는 낼 수 없습니다.','팀원이 이미 손패를 비웠다면 그다음 차례의 남은 사람이 시작합니다.','개 카드 위에는 폭탄을 낼 수 없습니다.','카드 점수는 0점입니다.']},
{id:'mahjong',name:'참새',glyph:'1',color:'#4a8c82',extra:['참새를 가진 사람이 첫 순서입니다. 첫 카드로 참새를 꼭 낼 필요는 없습니다.','숫자 1로 사용하며 스트레이트에도 넣을 수 있습니다.','낼 때 일반 카드 숫자 하나를 소원으로 요청할 수 있습니다. 소원은 충족될 때까지 유지됩니다.','자기 차례에 소원 숫자를 합법적으로 낼 수 있다면 반드시 내야 합니다.','카드 점수는 0점입니다.']},
{id:'bomb',name:'폭탄',glyph:'✦',color:'#af443c',extra:['같은 숫자 4장 또는 같은 무늬의 연속 숫자 5장 이상입니다.','자기 차례가 아니어도 낼 수 있고, 일반 조합을 이깁니다.','폭탄끼리는 장수가 많은 쪽이 강하고, 장수가 같으면 숫자가 높은 쪽이 강합니다.','개 카드에는 폭탄을 낼 수 없습니다.']}
];
function art(d){if(d.id==='bomb')return `<div class="special-art bomb-art" role="img" aria-label="같은 숫자 7 네 장">${[0,1,2,3].map(i=>mini(7,i)).join('')}</div>`;
return `<img class="special-art" src="assets/cards/${d.id}.png" alt="${d.name} 카드" width="106" height="170">`}

function source(){return '<p class="sheet-source"><a href="https://fatamorgana.ch/fatamorgana/tichu/english-rules" target="_blank" rel="noopener">공식 규칙 ↗</a></p>'}
function renderSpecial(id='dragon'){
const d=special.find(x=>x.id===id)||special[0],scene=scenes.find(p=>p.rule===d.id);
$('rules-sheet-title').textContent='특수카드';
$('rules-sheet-content').innerHTML=`<div class="special-tabs" role="tablist" aria-label="특수카드">${special.map(x=>`<button id="special-tab-${x.id}" data-special="${x.id}" role="tab" aria-selected="${x.id===d.id}" tabindex="${x.id===d.id?0:-1}" aria-controls="special-panel">${x.name}</button>`).join('')}</div><section id="special-panel" role="tabpanel" aria-labelledby="special-tab-${d.id}"><h3>${d.name}</h3><div class="special-overview">${art(d)}<div class="special-summary"><p>${esc(scene.body)}</p><p>${esc(scene.note||'')}</p></div></div></section>${source()}`;
prepareSheet('special:'+d.id);
}
function renderCombinations(target=$('rules-sheet-content')){
const inSheet=target===$('rules-sheet-content');if(inSheet)$('rules-sheet-title').textContent='조합내기';
const rows=[['싱글','카드 1장',[[7,0]]],['페어','같은 숫자 2장',[[7,0],[7,1]]],['트리플','같은 숫자 3장',[[7,0],[7,1],[7,2]]],['연속 페어','연속된 숫자의 페어 2쌍 이상',[[5,0],[5,1],[6,2],[6,3]]],['풀하우스','같은 숫자 3장 + 같은 숫자 2장',[[7,0],[7,1],[7,2],[9,0],[9,1]]],['스트레이트','연속 숫자 5장 이상',[[3,0],[4,1],[5,2],[6,3],[7,0]]]];
target.innerHTML=`<div class="special-tabs"><span class="sheet-pill">기본 조합</span></div><p class="combination-intro">기본 카드 조합은 여섯 가지입니다. <button class="inline-rule" data-special-link="bomb">폭탄은 특수카드에서 확인하세요.</button></p><section class="card-rank-guide"><h4 data-sheet-key="card-rank-title">📍 카드의 크기</h4><p data-sheet-key="card-rank-order">2 &lt; 3 &lt; ··· &lt; 10 &lt; J &lt; Q &lt; K &lt; A</p></section><ol class="combination-list">${rows.map(([name,desc,example],i)=>`<li><div class="combination-heading"><span>${String(i+1).padStart(2,'0')}</span><h3>${name}</h3><small>${desc}</small></div><div class="example-hand" aria-label="${name} 예시">${example.map(([rank,suit])=>mini(rank,suit)).join('')}</div></li>`).join('')}</ol><p class="sheet-footnote">앞 조합과 같은 종류·같은 장수의 더 높은 조합을 냅니다. 풀하우스는 세 장짜리 숫자로 비교합니다.</p>${source()}`;
if(inSheet)prepareSheet('combinations');else applyFields(target,'combinations');
}
function renderPoints(target=$('rules-sheet-content')){
const inSheet=target===$('rules-sheet-content');if(inSheet)$('rules-sheet-title').textContent='카드별 점수표';
target.innerHTML=`<div class="rule-switches" role="group" aria-label="점수 종류"><button data-score-tab="cards" aria-pressed="true">카드 점수</button><button data-score-tab="bonus" aria-pressed="false">원투 · 티츄 선언</button></div><div data-score-pane="cards"><p class="combination-intro">획득한 카드의 점수를 합산합니다. 전체 카드의 총점은 100점입니다.</p><table class="points-table sheet-points"><thead><tr><th scope="col">카드</th><th scope="col">한 장의 점수</th></tr></thead><tbody>${[['5','+5점'],['10','+10점'],['K','+10점'],['용','+25점'],['봉황','−25점'],['참새 (1)','0점'],['개','0점'],['나머지 일반 카드','0점']].map(([name,score])=>`<tr><th scope="row">${name}</th><td>${score}</td></tr>`).join('')}</tbody></table><p class="sheet-footnote">티츄 선언 점수는 별도로 계산합니다. 같은 팀이 1·2위를 차지하면 일반 카드 점수 대신 200점을 얻습니다.</p></div><section class="bonus-scores" data-score-pane="bonus" hidden><h3>원투 · 티츄 선언 점수</h3><table class="points-table sheet-points bonus-table"><thead><tr><th scope="col">종류</th><th scope="col">성공</th><th scope="col">실패</th></tr></thead><tbody><tr><th scope="row">원투</th><td>우리 팀 +200점<br>상대 팀 0점</td><td>해당 없음</td></tr><tr><th scope="row">라지 티츄</th><td>+200점</td><td>−200점</td></tr><tr><th scope="row">스몰 티츄</th><td>+100점</td><td>−100점</td></tr></tbody></table><p class="sheet-footnote">원투: 같은 팀 두 명이 1등과 2등으로 손패를 모두 비우면 성공해요. 카드 점수 계산을 생략하고 200점을 얻어요.</p><p class="sheet-footnote">라지·스몰 티츄: 선언한 본인이 가장 먼저 손패를 비워야 성공해요. 팀원이 1등이어도 본인이 1등이 아니면 실패예요.</p><p class="sheet-footnote">선언 점수는 카드 점수 또는 원투 점수에 별도로 더하거나 빼요. 예: 원투 + 라지 티츄 성공 = 400점.</p></section>${source()}`;
if(inSheet)prepareSheet('points');else applyFields(target,'points');
}

window.drawRulePage=kind=>{const root=$('scene');if(root.dataset.rulePage===kind&&root.querySelector('.reference-content'))return;root.dataset.rulePage=kind;root.innerHTML='<div class="reference-content"></div>';if(kind==='points')renderPoints(root.firstElementChild);else renderCombinations(root.firstElementChild)};
document.addEventListener('click',e=>{const score=e.target.closest('[data-score-tab]');if(score){const root=score.closest('#rules-sheet-content,.reference-content');root.querySelectorAll('[data-score-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b===score)));root.querySelectorAll('[data-score-pane]').forEach(p=>p.hidden=p.dataset.scorePane!==score.dataset.scoreTab);return}const related=e.target.closest('.reference-content [data-special-link]');if(related){window.openRules('special');renderSpecial(related.dataset.specialLink)}});
window.openRules=kind=>{if(!dialog.open){origin=document.activeElement;previousPlaying=playing;playing=false;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden'}if(kind==='points')renderPoints();else if(kind==='special')renderSpecial();else renderCombinations();if(!dialog.open)dialog.showModal();dialog.scrollTop=0};
$('close-rules-sheet').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;playing=previousPlaying;origin?.focus({preventScroll:true})});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}const tab=e.target.closest('[data-special]'),related=e.target.closest('[data-special-link]');if(tab){const id=tab.dataset.special;renderSpecial(id);$('special-tab-'+id).focus({preventScroll:true})}else if(related){renderSpecial(related.dataset.specialLink);dialog.scrollTop=0;$('special-tab-'+related.dataset.specialLink).focus({preventScroll:true})}});
dialog.addEventListener('keydown',e=>{if(!e.target.matches('[data-special]')||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=special.findIndex(x=>x.id===e.target.dataset.special);const next=e.key==='Home'?0:e.key==='End'?special.length-1:(i+(e.key==='ArrowRight'?1:-1)+special.length)%special.length;renderSpecial(special[next].id);$('special-tab-'+special[next].id).focus({preventScroll:true})});

$('open-card-rules').onclick=()=>window.openRules('combinations');$('open-special-rules').onclick=()=>window.openRules('special');$('open-score-rules').onclick=()=>window.openRules('points');
})();
