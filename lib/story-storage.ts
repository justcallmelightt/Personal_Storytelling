import type { StoryProfile, StoryPage } from "@/types/story";
const KEY = "personal-storytelling-service-v1";
export const blankStory = (): StoryProfile => ({ owner: "", headline: "나의 이야기", introduction: "", pages: [] });
export const blankPage = (): StoryPage => ({ id: crypto.randomUUID(), year: "지금", chapter: "새 장면", label: "MOMENT", title: "새 장면의 제목", description: "이 순간의 이야기를 적어보세요.", category: "quiet", theme: "paper" });
export function loadStory(): StoryProfile | null {
  try { const raw = localStorage.getItem(KEY); if (!raw) return null; const value: unknown = JSON.parse(raw); if (value && typeof value === "object" && "pages" in value && Array.isArray(value.pages) && "owner" in value && typeof value.owner === "string") return value as StoryProfile; } catch { return null; }
  return null;
}
export function saveStory(value: StoryProfile): boolean { try { localStorage.setItem(KEY, JSON.stringify(value)); return true; } catch { return false; } }
