import type { StoryProfile } from "@/types/story";

export const defaultStory: StoryProfile = {
  owner: "YUL",
  headline: "나는, 아직 쓰이는 중입니다.",
  introduction: "완성된 사람의 소개가 아니라, 지금도 모양이 바뀌고 있는 한 사람의 기록입니다.",
  pages: [
    { id: "start", year: "2007", chapter: "처음", label: "출발점", title: "작은 세계에서\n큰 질문을 배웠다.", description: "처음부터 특별한 아이는 아니었습니다. 다만 주변의 작은 것들을 오래 바라보는 습관이 있었습니다.", category: "quiet", theme: "paper" },
    { id: "turn", year: "2021", chapter: "전환", label: "방향을 바꾼 날", title: "만드는 사람이\n되어보기로 했다.", description: "아이디어는 머릿속에만 있을 때보다 화면 위에 놓였을 때 더 솔직해졌습니다. 실패해도 직접 만든 것은 남았습니다.", category: "turning", theme: "night" },
    { id: "expand", year: "2023", chapter: "확장", label: "여러 개의 나", title: "하나의 이름 안에\n여러 프로젝트가 자랐다.", description: "시간표, 편지, 아카이브, 작은 실험들. 서로 달라 보이는 것들이 결국 같은 질문을 향하고 있었습니다.", category: "turning", theme: "lilac" },
    { id: "pause", year: "2025", chapter: "머무름", label: "속도를 늦춘 시기", title: "잘 만든다는 건\n잘 보는 일이기도 했다.", description: "더 많이 만들기보다, 왜 만드는지 오래 생각했습니다. 빈 공간과 느린 장면에도 의미가 있다는 것을 배웠습니다.", category: "quiet", theme: "warm" },
    { id: "now", year: "NOW", chapter: "진행 중", label: "현재형", title: "아직 정해지지 않은\n사람으로 남아있기.", description: "나는 계속 만들고, 고치고, 다시 질문합니다. 다음 장면은 아직 비어 있어서 더 기대됩니다.", category: "now", theme: "violet" },
  ],
};
