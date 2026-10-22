// Export only this guide's editable content; no other browser data is read.
(()=>{
const button=document.createElement('button');button.id='export-all-content';button.type='button';button.textContent='전체 편집 백업';
const status=document.createElement('p');status.className='save-state';status.setAttribute('role','status');
const row=document.createElement('div');row.className='editor-actions';row.append(button);document.getElementById('copy-editor').append(row,status);
button.onclick=()=>{
 try{
  const data={version:1,exportedAt:new Date().toISOString(),storage:{}};
  for(const key of ['tichu.copy.v1','tichu.notebook.v1','tichu.rule-sheets.v1']){const value=window.readTichuData(key);if(value!==null)data.storage[key]=value}
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='tichu-all-edits.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
  status.textContent='본문·하이라이트·인덱스·바텀시트의 저장 내용을 파일로 내보냈어요.';
 }catch{status.textContent='백업하지 못했어요. 브라우저의 저장 공간 및 다운로드 설정을 확인해 주세요.'}
};
})();
