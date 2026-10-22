# 티츄 — 브라우저 수정 내용 포함 배포본

2026-10-22 21:25 (한국 시간)에 현재 사이트의 브라우저 저장 데이터를 내보낸 버전입니다.
본문 22개 페이지, 인덱스 5개, 바텀시트 5개의 저장 내용과 하이라이트가 포함되어 있습니다.
새 사이트를 처음 여는 방문자에게도 이 내용이 기본으로 표시됩니다.

## GitHub에 올리는 방법

1. ZIP 압축을 풉니다. ZIP 파일 자체가 아니라 안의 파일 전부와 fonts 폴더를 올립니다.
2. GitHub 저장소 최상위에 index.html이 바로 보이게 올립니다.
3. Settings → Pages → Source: Deploy from a branch.
4. Branch: main, Folder: /(root) → Save.
5. 배포 후 Pages의 Visit site에서 확인합니다.

중요: saved-content.js도 반드시 같이 올리세요. 브라우저에서 수정한 본문·하이라이트·인덱스·바텀시트 데이터가 담긴 파일입니다.
기존 버전을 이미 올렸다면 index.html과 모든 JS/CSS 파일을 이 버전으로 덮어쓰세요.

## 파일

- index.html: 첫 화면
- saved-content.js: 사용자가 브라우저에서 수정한 내용 (필수)
- style.css: 디자인 및 반응형 레이아웃
- scenes.js / app.js: 기본 장면 및 애니메이션
- notebook.js: 인덱스와 페이지 이동
- content-editor.js: 본문 및 하이라이트 편집
- rule-sheets.js: 바텀시트 및 편집
- site-backup.js: 전체 편집 백업
- fonts/: 폰트 2개
- .nojekyll: 정적 파일 배포 설정
- README.md: 안내문

macOS에서 .nojekyll이 보이지 않으면 Command + Shift + . 키를 누르세요.
별도 설치나 빌드, API 키가 필요 없습니다.

## 이후 편집

방문자가 추가로 수정하면 해당 브라우저에 저장됩니다. 전체 편집 백업 버튼으로 JSON을 내보낼 수 있습니다.
이번 ZIP은 내보낸 시점의 스냅샷입니다. 이후 편집 내용이 GitHub 파일에 자동 반영되지는 않습니다.
새 GitHub 주소에 기존 편집 기록이 있으면 그 브라우저의 저장 기록을 우선 표시합니다.
GitHub Pages 공개 여부는 기존 Sites의 비공개 설정과 별개입니다.

공식 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
