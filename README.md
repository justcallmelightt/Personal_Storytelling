# Storyframe

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

사진과 글을 시간순으로 엮어 스크롤로 읽는 개인 이야기 웹사이트를 만드는 서비스 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

- `/` 또는 `/studio` — 표지·장면·마지막 문장을 웹페이지 위에서 직접 편집
- `/story` — 같은 구성을 읽기 전용으로 표시
- 예전 `/storyframe/index.html`과 `/storyframe/preview.html` 주소는 새 화면으로 이동

표지에는 사진·배경·글 정렬을 설정할 수 있습니다. 각 장면에는 사진·글 비율을 고를 수 있고, 사진을 넣기 전 자르기 방식과 위치를 확인합니다. 장면은 최대 30개까지 추가할 수 있습니다.

글은 LocalStorage, 사진은 IndexedDB에 이 브라우저에 저장됩니다. 계정, 기기 간 동기화, 공개 공유 링크는 아직 제공하지 않습니다.

현재 편집·독자 화면은 `components/storyframe-app.tsx`와 `lib/storyframe-storage.ts`가 담당합니다. 스타일은 기존 `public/storyframe/studio.css`를 재사용합니다. 기존 브라우저 저장 키와 IndexedDB 사진 데이터는 그대로 읽으며, 로그인과 공개 공유는 아직 제공하지 않습니다.

`/sample`의 별도 실험 화면에는 Tailwind CSS와 Motion이 사용됩니다. 현재 편집·독자 화면의 스타일과 드래그 모션은 CSS 및 React 이벤트로 구현되어 있습니다.
