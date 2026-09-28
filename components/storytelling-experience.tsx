"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { defaultStory } from "@/data/default-story";
import type { StoryCategory, StoryPage, StoryProfile } from "@/types/story";
import { StoryEditor } from "./story-editor";
import { StoryScene } from "./story-scene";

const storageKey = "personal-storytelling-mvp";
type Filter = "all" | StoryCategory;

const filters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "전체 보기" },
  { value: "turning", label: "전환점" },
  { value: "quiet", label: "조용한 순간" },
  { value: "now", label: "지금" },
];

export function StorytellingExperience() {
  const [story, setStory] = useState<StoryProfile>(defaultStory);
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState(false);
  const [activePage, setActivePage] = useState<StoryPage | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try { setStory(JSON.parse(saved) as StoryProfile); } catch { window.localStorage.removeItem(storageKey); }
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(story));
  }, [hydrated, story]);

  const pages = useMemo(() => story.pages.filter((page) => filter === "all" || page.category === filter), [filter, story.pages]);
  const [headlineLead, ...headlineRest] = story.headline.split(",");
  const savePage = (nextPage: StoryPage) => setStory((current) => ({ ...current, pages: current.pages.map((page) => page.id === nextPage.id ? nextPage : page) }));

  return (
    <main id="top" className="h-svh snap-y snap-mandatory overflow-x-hidden overflow-y-auto bg-[#f7f4ef] text-[#17151d]">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-white/20 bg-[#f7f4ef]/55 px-[5vw] py-5 font-mono text-[0.68rem] tracking-[0.08em] backdrop-blur-xl">
        <a href="#top" className="active:opacity-50">{story.owner} / STORY 01</a>
        <div className="text-[#77727d]"><span className="mr-2 inline-block size-1.5 rounded-full bg-[#8dce72] shadow-[0_0_0_.25rem_rgba(141,206,114,.16)]" />계속 쓰이는 중</div>
      </header>

      <section className="mx-auto flex min-h-svh w-[min(1080px,90vw)] snap-start snap-always flex-col items-start pt-[23svh]">
        <motion.p className="font-mono text-[0.67rem] tracking-[0.12em] text-[#77727d]" initial={false} animate={{ opacity: 1 }}>A PERSONAL TIMELINE · 2007 — NOW</motion.p>
        <motion.h1 className="mt-12 max-w-[10ch] text-[clamp(3.8rem,9.5vw,8.9rem)] font-black leading-[.98] tracking-[-0.075em]" initial={false} animate={{ opacity: 1 }}>{headlineLead},<br /><em className="not-italic text-[#816bc0]">{headlineRest.join(",").trim()}</em></motion.h1>
        <p className="mt-7 max-w-md text-[clamp(1rem,1.5vw,1.2rem)] leading-8 tracking-[-0.035em] text-[#605b64]">{story.introduction}</p>
        <a href="#story" className="mt-[12svh] inline-flex items-center gap-3 font-mono text-xs active:scale-95"><span className="h-px w-14 bg-current" />천천히 읽기</a>
      </section>

      <section id="story" className="flex min-h-svh snap-start snap-always flex-col justify-center px-[5vw] py-[13svh]">
        <div className="mx-auto grid w-full max-w-[1080px] items-start gap-8 lg:grid-cols-[1fr_2fr_1fr]">
          <span className="font-mono text-[0.67rem] tracking-[0.12em] text-[#77727d]">01 / {String(story.pages.length).padStart(2, "0")}</span>
          <h2 className="text-[clamp(2.8rem,6vw,6.5rem)] font-black leading-[1.02] tracking-[-0.075em]">시간은 직선이<br /><span className="text-[#816bc0]">아니었습니다.</span></h2>
          <p className="text-sm leading-7 text-[#77727d]">어떤 날은 앞으로 갔고, 어떤 날은 같은 자리에서 오래 머물렀습니다. 그 모든 장면이 지금의 나를 만들었습니다.</p>
        </div>

        <div className="mx-auto mt-20 flex w-full max-w-[1080px] flex-col gap-5 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div><span className="font-mono text-[0.64rem] tracking-[0.14em] text-[#77727d]">MY STORY / EDIT MODE</span><strong className="mt-2 block text-sm tracking-[-0.03em]">각 장면은 하나의 페이지입니다.</strong></div>
          <motion.button type="button" onClick={() => setEditing((value) => !value)} className="self-start rounded-full border border-black/15 px-4 py-2 text-xs sm:self-auto" whileTap={{ scale: 0.94 }}>{editing ? "꾸미기 끝내기" : "페이지 꾸미기 ↗"}</motion.button>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-[1080px] flex-wrap gap-2" role="group" aria-label="이야기 필터">
          {filters.map((item) => <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`rounded-full border px-4 py-2 text-xs transition-colors active:scale-95 ${filter === item.value ? "border-[#17151d] bg-[#17151d] text-white" : "border-black/15 bg-white/40 text-[#77727d] hover:text-[#17151d]"}`}>{item.label}</button>)}
        </div>

      </section>

      <div aria-live="polite">
        {pages.map((page) => <StoryScene key={page.id} page={page} index={story.pages.findIndex((item) => item.id === page.id)} editing={editing} onEdit={setActivePage} />)}
      </div>

      <nav className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex" aria-label="연대기 프레임 이동">
        <a href="#top" className="size-1.5 rounded-full bg-current opacity-30 transition-opacity hover:opacity-100" aria-label="표지로 이동" />
        {story.pages.map((page) => <a key={page.id} href={`#scene-${page.id}`} className="size-1.5 rounded-full bg-current opacity-30 transition-opacity hover:opacity-100" aria-label={`${page.year} 프레임으로 이동`} />)}
      </nav>

      <section className="mx-auto flex min-h-svh w-[min(1080px,90vw)] snap-start snap-always flex-col items-center justify-center text-center">
        <span className="font-mono text-[0.67rem] tracking-[0.12em] text-[#77727d]">NEXT / YOUR PAGE</span>
        <h2 className="my-8 text-[clamp(3rem,7vw,7rem)] font-black leading-none tracking-[-0.075em]">다음 장면은<br /><em className="not-italic text-[#816bc0]">당신이 정합니다.</em></h2>
        <p className="leading-8 text-[#77727d]">편집한 내용은 이 브라우저에 자동으로 저장됩니다.<br />로그인과 공유는 다음 MVP에서 이어집니다.</p>
      </section>

      <footer className="flex min-h-[4rem] snap-end justify-between border-t border-black/10 px-[5vw] py-7 font-mono text-[0.64rem] tracking-[0.08em] text-[#77727d]"><span>© 2026 {story.owner}</span><span>MADE WITH TIME & ATTENTION</span></footer>
      <StoryEditor page={activePage} onClose={() => setActivePage(null)} onSave={savePage} />
    </main>
  );
}
