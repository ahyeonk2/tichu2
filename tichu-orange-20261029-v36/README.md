# TICHU — Figma 설명서 디자인 반영본

2026-10-28, Figma 「수련의방」의 설명서 페이지(219:2548)에 있는 16개 프레임을 기준으로 구현했습니다.
상단 단계 탭, 12칸 진행 바, 지금 할 행동, 펼치는 TIP, 원투·일반 점수 계산 분기를 제공합니다.
기존 자동 애니메이션과 특수카드·조합표·점수표를 연결했습니다.
1,000점 확인에서 아니오를 누르면 다시 카드 내기 안내를 거쳐 카드 내기·패스로 이어집니다.
편집·인덱스 추가·드래그·애니메이션 조절 기능이 없는 열람 전용 배포본입니다.

## GitHub Pages

ZIP 압축을 풀고 안의 모든 파일과 assets·fonts 폴더를 저장소 최상위에 올리세요.
저장소 첫 화면에 index.html이 바로 보여야 합니다.
Settings → Pages → Deploy from a branch → main / (root) → Save.
별도 설치나 빌드, API 키 없이 실행됩니다.

## 파일

- index.html / guide.css: 화면 구조와 반응형 디자인
- guide-content.js: Figma의 문구, 화면 구성 및 로컬 아이콘 경로
- guide.js: 단계 탭, TIP, 선택에 따른 화면 이동
- guide-motion.js / guide-runtime.js / scenes.js: 기존 애니메이션
- guide-rules.js / guide-rules-data.js: 기존 규칙 바텀시트와 저장된 문구
- assets/figma: Figma가 제공한 아이콘 원본
- assets/cards: 사용자가 제공한 특수카드 이미지
- fonts: Pretendard 폰트

Figma 원본: https://www.figma.com/design/4yOQPqLiof2AumvllhWyKo/?node-id=219-2548
브라우저 주소와 무관하게 포함된 고정 콘텐츠를 표시합니다.

용어를 누르면 문장 아래에서 설명 각주를 펼치고 닫을 수 있습니다. guide-terms.js에 용어 정의를 포함합니다.
