# Personal Storytelling

삶의 순간을 한 화면씩 꾸미고 이어 붙이는 개인 스토리텔링 서비스 MVP입니다.

## Stack

- Next.js App Router
- React + TypeScript/TSX
- Tailwind CSS
- Motion for React
- LocalStorage 기반 MVP 저장

## Run

```bash
npm install
npm run dev
```

## 화면

- `/` — 서비스를 소개하고 제작을 시작하는 랜딩
- `/studio` — 장면 추가·편집·순서 변경·삭제, 글과 배경 톤 커스터마이즈
- `/story` — 만든 이야기를 전체 화면 스냅 프레임으로 감상
- `/sample` — 기존 예시 이야기

현재 데이터는 이 브라우저의 LocalStorage에만 보관됩니다. 다른 기기와 동기화되지 않으며, 브라우저 데이터를 지우면 사라질 수 있습니다. 계정, 이미지 업로드, 공개 공유 URL은 아직 구현하지 않았습니다.
