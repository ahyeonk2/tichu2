# 티츄 설명서 — 열람 전용 배포본

브라우저 저장 데이터 기준: 2026-10-23 01:24:46 (한국 시간).
본문 22개 페이지, 인덱스 5개, 바텀시트 6개의 최신 수정 내용을 포함합니다.
하이라이트·볼드·TIP·탭별 문구와 인덱스 이름·색상·순서가 반영되어 있습니다.

이 배포본에는 내용 편집, 인덱스 편집·추가·드래그, 애니메이션 조절, 백업·불러오기 기능이 없습니다.
애니메이션은 자동 재생되며 기기의 동작 줄이기 설정을 따릅니다.
페이지 이동, 인덱스 탐색, 설명 탭, 카드표 바텀시트와 접는 도움말은 사용할 수 있습니다.
저장된 콘텐츠를 그대로 표시하므로 방문자의 기존 localStorage 값으로 덮어쓰지 않습니다.

## GitHub Pages에 올리기

1. ZIP을 압축 해제합니다.
2. 안의 모든 파일과 assets·fonts 폴더를 저장소 최상위에 올립니다.
   저장소를 열었을 때 index.html이 바로 보여야 합니다. ZIP 자체를 올리는 방식이 아닙니다.
3. Settings → Pages → Source: Deploy from a branch.
4. Branch: main / Folder: /(root) → Save.
5. 배포 후 Visit site에서 확인합니다.

기존 배포본을 교체할 때는 예전 HTML·JS·CSS 파일을 이 패키지로 교체하세요.
특히 index.html과 published-content.js 및 viewer-*.js를 모두 포함해야 합니다.
별도 설치·빌드·API 키가 필요 없습니다.

## 파일

- index.html: 화면 구조
- published-content.js: 최신 브라우저 편집 내용을 담은 고정 데이터
- scenes.js: 기본 장면과 문구
- viewer-copy.js: 문구와 서식 표시
- viewer-app.js: 자동 재생 애니메이션
- viewer-notebook.js: 열람 전용 인덱스·페이지 이동
- viewer-rules.js: 열람 전용 규칙 표와 바텀시트
- style.css: 디자인 및 반응형 레이아웃
- assets/cards/: 특수카드 이미지
- fonts/: 폰트
- .nojekyll: 정적 파일 배포 설정

이 파일은 저장 시점의 스냅샷입니다. 이후 원본 사이트에서 수정한 내용이 자동 반영되지는 않습니다.
