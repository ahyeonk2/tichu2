// Read rules without leaving the current animation or page.
(()=>{
const dialog=document.createElement('dialog');dialog.id='rules-sheet';dialog.setAttribute('aria-labelledby','rules-sheet-title');
dialog.innerHTML='<div class="sheet-grip" aria-hidden="true"></div><header class="sheet-header"><h2 id="rules-sheet-title"></h2><button id="close-rules-sheet" aria-label="규칙 닫기">×</button></header><div class="sheet-editor-bar"><button id="edit-sheet" type="button">내용 편집</button><span id="sheet-edit-status" role="status"></span></div><div id="rules-sheet-content"></div>';
document.body.append(dialog);
let previousPlaying=false,previousOverflow='',origin=null;
const sheetKey='tichu.rule-sheets.v1';let sheetCopy={},sheetView='',sheetEditing=false;
try{const data=(window.readTichuData(sheetKey)||{});if(data&&typeof data==='object'&&!Array.isArray(data))sheetCopy=data}catch{}
function prepareSheet(view){
 sheetView=view;
 const content=$('rules-sheet-content');
 // Keep navigation buttons intact while making the introductory copy editable.
 content.querySelectorAll('p').forEach(p=>{if(p.querySelector('button')){[...p.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).forEach(n=>{const span=document.createElement('span');span.textContent=n.textContent;n.replaceWith(span)})}});
 const fields=[$('rules-sheet-title'),...content.querySelectorAll('h3,.special-summary p,.combination-intro:not(:has(button)),.combination-intro>span,.combination-heading small,.sheet-footnote,.sheet-pill,th,td')];
 fields.forEach((el,i)=>{el.dataset.sheetField=String(i);const value=sheetCopy[view]?.[i];if(typeof value==='string')el.textContent=value;el.contentEditable=String(sheetEditing);el.setAttribute('spellcheck','false');if(sheetEditing)el.setAttribute('aria-label','수정할 내용');else el.removeAttribute('aria-label')});
 updateSheetEditor();
}
function updateSheetEditor(){
 dialog.classList.toggle('sheet-editing',sheetEditing);$('edit-sheet').textContent=sheetEditing?'편집 완료':'내용 편집';$('edit-sheet').setAttribute('aria-pressed',String(sheetEditing));
 dialog.querySelectorAll('[data-sheet-field]').forEach(el=>{el.contentEditable=String(sheetEditing)});
 $('sheet-edit-status').textContent=sheetEditing?'글자를 눌러 수정하세요 · 이 브라우저에 자동 저장':'';
}
$('edit-sheet').onclick=()=>{sheetEditing=!sheetEditing;updateSheetEditor()};
dialog.addEventListener('input',e=>{const field=e.target.closest('[data-sheet-field]');if(!field||!sheetEditing)return;const value=field.innerText;if(value.length>30000){$('sheet-edit-status').textContent='내용은 30,000자 이내로 작성해 주세요.';return}if(!Object.hasOwn(sheetCopy,sheetView))sheetCopy[sheetView]={};sheetCopy[sheetView][field.dataset.sheetField]=value;try{localStorage.setItem(sheetKey,JSON.stringify(sheetCopy));$('sheet-edit-status').textContent='저장했어요 · 이 브라우저에 자동 저장'}catch{$('sheet-edit-status').textContent='저장 공간이 부족해 저장하지 못했어요.'}});
dialog.addEventListener('paste',e=>{if(!e.target.closest('[data-sheet-field]')||!sheetEditing)return;e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))});
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
// Original ornamental card illustration, with readable names rather than a screenshot of the reference.
return `<svg class="special-art" viewBox="0 0 110 170" role="img" aria-label="${d.name} 카드"><rect x="1" y="1" width="108" height="168" rx="6" fill="#fffdf7" stroke="#e4dfd3"/><path d="M10 29V10H28M82 10H100V29M10 141V160H28M82 160H100V141" fill="none" stroke="${d.color}" stroke-width="1.4"/><path d="M55 34C89 47 94 75 70 89C44 105 28 97 28 76C28 54 60 48 73 68C88 92 66 128 40 137" fill="none" stroke="#d7b572" stroke-width="12" opacity=".5"/><path d="M55 34C89 47 94 75 70 89C44 105 28 97 28 76C28 54 60 48 73 68C88 92 66 128 40 137" fill="none" stroke="${d.color}" stroke-width="5"/><circle cx="55" cy="84" r="27" fill="#fffdf7" stroke="${d.color}" stroke-width="1.2"/><text x="55" y="95" text-anchor="middle" font-size="31" fill="${d.color}" font-family="serif">${d.glyph}</text><text x="15" y="24" font-size="11" fill="${d.color}">${d.name}</text><text x="95" y="153" text-anchor="end" font-size="11" fill="${d.color}">${d.name}</text></svg>`}
function source(){return '<p class="sheet-source"><a href="https://fatamorgana.ch/fatamorgana/tichu/english-rules" target="_blank" rel="noopener">공식 규칙 ↗</a></p>'}
function renderSpecial(id='dragon'){
const d=special.find(x=>x.id===id)||special[0],scene=scenes.find(p=>p.rule===d.id);
$('rules-sheet-title').textContent='특수카드';
$('rules-sheet-content').innerHTML=`<div class="special-tabs" role="tablist" aria-label="특수카드">${special.map(x=>`<button id="special-tab-${x.id}" data-special="${x.id}" role="tab" aria-selected="${x.id===d.id}" tabindex="${x.id===d.id?0:-1}" aria-controls="special-panel">${x.name}</button>`).join('')}</div><section id="special-panel" role="tabpanel" aria-labelledby="special-tab-${d.id}"><h3>${d.name}</h3><div class="special-overview">${art(d)}<div class="special-summary"><p>${esc(scene.body)}</p><p>${esc(scene.note||'')}</p></div></div></section>${source()}`;
prepareSheet('special:'+d.id);
}
function renderCombinations(){
$('rules-sheet-title').textContent='조합내기';
const rows=[['싱글','카드 1장',[[7,0]]],['페어','같은 숫자 2장',[[7,0],[7,1]]],['트리플','같은 숫자 3장',[[7,0],[7,1],[7,2]]],['연속 페어','연속된 숫자의 페어 2쌍 이상',[[5,0],[5,1],[6,2],[6,3]]],['풀하우스','같은 숫자 3장 + 같은 숫자 2장',[[7,0],[7,1],[7,2],[9,0],[9,1]]],['스트레이트','연속 숫자 5장 이상',[[3,0],[4,1],[5,2],[6,3],[7,0]]]];
$('rules-sheet-content').innerHTML=`<div class="special-tabs"><span class="sheet-pill">기본 조합</span></div><p class="combination-intro">기본 카드 조합은 여섯 가지입니다. <button class="inline-rule" data-special-link="bomb">폭탄은 특수카드에서 확인하세요.</button></p><ol class="combination-list">${rows.map(([name,desc,example],i)=>`<li><div class="combination-heading"><span>${String(i+1).padStart(2,'0')}</span><h3>${name}</h3><small>${desc}</small></div><div class="example-hand" aria-label="${name} 예시">${example.map(([rank,suit])=>mini(rank,suit)).join('')}</div></li>`).join('')}</ol><p class="sheet-footnote">앞 조합과 같은 종류·같은 장수의 더 높은 조합을 냅니다. 풀하우스는 세 장짜리 숫자로 비교합니다.</p>${source()}`;
prepareSheet('combinations');
}
function renderPoints(){
$('rules-sheet-title').textContent='카드별 점수표';
$('rules-sheet-content').innerHTML=`<div class="special-tabs"><span class="sheet-pill">카드 점수</span></div><p class="combination-intro">획득한 카드의 점수를 합산합니다. 전체 카드의 총점은 100점입니다.</p><table class="points-table sheet-points"><thead><tr><th scope="col">카드</th><th scope="col">한 장의 점수</th></tr></thead><tbody>${[['5','+5점'],['10','+10점'],['K','+10점'],['용','+25점'],['봉황','−25점'],['참새 (1)','0점'],['개','0점'],['나머지 일반 카드','0점']].map(([name,score])=>`<tr><th scope="row">${name}</th><td>${score}</td></tr>`).join('')}</tbody></table><p class="sheet-footnote">티츄 선언 점수는 별도로 계산합니다. 같은 팀이 1·2위를 차지하면 일반 카드 점수 대신 200점을 얻습니다.</p>${source()}`;
prepareSheet('points');
}
window.openRules=(kind)=>{if(!dialog.open){origin=document.activeElement;previousPlaying=playing;playing=false;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';if(kind==='points')renderPoints();else if(kind==='special')renderSpecial();else renderCombinations();dialog.showModal();}else{if(kind==='points')renderPoints();else if(kind==='special')renderSpecial();else renderCombinations();}dialog.scrollTop=0;};
$('close-rules-sheet').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>{sheetEditing=false;updateSheetEditor();document.body.style.overflow=previousOverflow;playing=previousPlaying;$('play').textContent=playing?'일시정지':'재생';origin?.focus({preventScroll:true})});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}const tab=e.target.closest('[data-special]'),related=e.target.closest('[data-special-link]');if(tab){const id=tab.dataset.special;renderSpecial(id);$('special-tab-'+id).focus({preventScroll:true})}else if(related){renderSpecial(related.dataset.specialLink);dialog.scrollTop=0;$('special-tab-'+related.dataset.specialLink).focus({preventScroll:true})}});
dialog.addEventListener('keydown',e=>{if(!e.target.matches('[data-special]')||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=special.findIndex(x=>x.id===e.target.dataset.special);const next=e.key==='Home'?0:e.key==='End'?special.length-1:(i+(e.key==='ArrowRight'?1:-1)+special.length)%special.length;renderSpecial(special[next].id);$('special-tab-'+special[next].id).focus({preventScroll:true})});
$('open-card-rules').onclick=()=>window.openRules('combinations');$('open-special-rules').onclick=()=>window.openRules('special');$('open-score-rules').onclick=()=>window.openRules('points');
})();
