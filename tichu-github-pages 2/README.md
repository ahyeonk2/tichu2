# 티츄 게임 설명서 — GitHub Pages 배포용

2026-10-22 저장. 모바일 오른쪽 세부 메뉴 및 바텀시트 편집까지 반영한 버전입니다.
HTML/CSS/JavaScript 정적 사이트이므로 별도 설치·빌드·서버·API 키가 필요 없습니다.

## 올릴 파일

ZIP을 압축 해제하고 아래 파일과 fonts 폴더를 저장소 최상위에 모두 올리세요.
ZIP 파일 자체를 올리거나 tichu-github-pages 폴더를 한 겹 더 넣지 마세요.
저장소를 열었을 때 index.html이 바로 보여야 합니다.

- index.html: 첫 화면
- style.css: 화면 디자인 및 모바일 대응
- scenes.js: 장면과 기본 내용
- app.js: 애니메이션
- notebook.js: 인덱스 및 페이지 이동
- content-editor.js: 본문 편집
- rule-sheets.js: 바텀시트 및 편집
- fonts/: 폰트 파일 2개, 폴더 구조를 유지하세요.
- .nojekyll: 정적 파일 그대로 게시하기 위한 빈 파일
- README.md: 이 안내문

macOS에서 .nojekyll이 안 보이면 Command + Shift + . 키로 숨김 파일을 표시하세요.

## GitHub 웹에서 배포하기

1. GitHub에서 새 저장소를 만드세요. 예: tichu-guide. 무료 계정에서는 Public 저장소를 선택하세요.
2. 저장소의 Add file → Upload files를 선택하세요. 비어 있는 저장소라면 uploading an existing file 링크를 누르세요.
3. 위 파일과 fonts 폴더를 모두 드래그한 뒤 Commit changes로 저장하세요.
4. Settings → Pages → Build and deployment로 이동하세요.
5. Source에서 Deploy from a branch를 선택하세요.
6. Branch는 main, 폴더는 /(root)를 선택하고 Save를 누르세요.
7. 배포가 완료되면 Pages 화면의 Visit site로 여세요.
   일반적인 주소: https://깃허브아이디.github.io/tichu-guide/

저장소 이름을 다르게 정했다면 URL의 tichu-guide도 해당 이름으로 바뀝니다.
GitHub Pages 공개 여부는 기존 Sites의 비공개 설정과 별개입니다.

## 수정한 내용의 저장 범위

이 패키지는 배포된 코드와 기본 콘텐츠를 포함합니다.
사이트에서 직접 편집한 본문·인덱스·바텀시트 내용은 브라우저 localStorage에 저장되며,
GitHub 저장소로 자동 반영되거나 다른 도메인으로 자동 이전되지 않습니다.
기존 사이트의 본문은 내용 편집 → 백업 내보내기, 인덱스는 인덱스 편집의 백업 기능으로
각각 저장한 뒤 새 사이트에서 불러올 수 있습니다. 바텀시트 편집 내용은 별도로 옮겨야 합니다.
모든 방문자에게 보일 기본 내용은 scenes.js 및 rule-sheets.js를 수정하고 다시 업로드하세요.

## 업데이트

변경한 파일을 같은 경로에 업로드하고 Commit changes하면 Pages가 다시 배포합니다.
fonts 폴더는 폰트가 바뀌지 않으면 다시 올리지 않아도 됩니다.

## 공식 안내

https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
