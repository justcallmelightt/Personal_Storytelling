"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadStory } from "@/lib/story-storage";
import { StoryScene } from "@/components/story-scene";
import type { StoryProfile } from "@/types/story";
export function StoryReader() {
  const [story, setStory] = useState<StoryProfile | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { const id = window.setTimeout(() => { setStory(loadStory()); setReady(true); }, 0); return () => window.clearTimeout(id); }, []);
  if (!ready) return <main className="studio-loading">이야기를 여는 중…</main>;
  if (!story) return <main className="reader-empty"><Link href="/" className="brand">STORY<span>FRAME</span><i>✳</i></Link><div><p className="eyebrow">NO STORY YET</p><h1>아직 펼칠 이야기가 없어요.</h1><Link href="/studio" className="primary-action">내 이야기 만들기 ↗</Link></div></main>;
  return <main className="reader-scroll"><header className="reader-header"><Link href="/" className="brand">STORY<span>FRAME</span><i>✳</i></Link><Link href="/studio" className="nav-cta">내 이야기 편집 ↗</Link></header><section className="reader-intro"><span className="eyebrow">A PERSONAL STORY / {story.owner || "YOUR NAME"}</span><h1>{story.headline || "나의 이야기"}</h1><p>{story.introduction || "한 장면씩 펼쳐지는 이야기"}</p><span className="scroll-hint">아래로 넘겨보세요 ↓</span></section>{story.pages.map((page, index) => <StoryScene key={page.id} page={page} index={index} editing={false} />)}<section className="reader-end"><span>THE STORY CONTINUES</span><h2>다음 장면은<br/>아직 쓰이는 중.</h2><Link href="/studio" className="primary-action">이야기 이어 쓰기 ↗</Link></section></main>;
}
