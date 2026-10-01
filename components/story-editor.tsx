"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { StoryPage, StoryTheme } from "@/types/story";

type StoryEditorProps = {
  page: StoryPage | null;
  onClose: () => void;
  onSave: (page: StoryPage) => void;
};

const themes: Array<{ value: StoryTheme; label: string }> = [
  { value: "paper", label: "종이" },
  { value: "night", label: "밤" },
  { value: "lilac", label: "라일락" },
  { value: "warm", label: "따뜻한 빛" },
  { value: "violet", label: "현재" },
];

export function StoryEditor({ page, onClose, onSave }: StoryEditorProps) {
  return (
    <AnimatePresence>
      {page ? <EditorPanel key={page.id} page={page} onClose={onClose} onSave={onSave} /> : null}
    </AnimatePresence>
  );
}

function EditorPanel({ page, onClose, onSave }: { page: StoryPage; onClose: () => void; onSave: (page: StoryPage) => void }) {
  const [draft, setDraft] = useState(page);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
          className="fixed inset-0 z-50 flex items-end justify-end bg-[#17151d]/30 p-3 backdrop-blur-sm sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.22 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.form
            className="max-h-[calc(100svh-1.5rem)] w-full overflow-y-auto rounded-[1.5rem] border border-white/60 bg-[#f8f6f2]/90 p-6 shadow-[0_2rem_5rem_rgba(23,21,29,.22)] backdrop-blur-2xl sm:max-w-lg sm:p-8"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 28, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.99 }}
            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 180, damping: 26 }}
            onSubmit={(event) => {
              event.preventDefault();
              onSave(draft);
              onClose();
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.64rem] tracking-[0.14em] text-[#77727d]">PAGE CUSTOMIZER</span>
              <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-black/5 text-xl active:scale-90" aria-label="편집기 닫기">×</button>
            </div>
            <h2 className="my-8 text-4xl font-black leading-[1.04] tracking-[-0.065em]">이 페이지를<br /><em className="not-italic text-[#816bc0]">당신답게 바꾸기</em></h2>
            <EditorField label="페이지 이름"><input value={draft.year} onChange={(event) => setDraft({ ...draft, year: event.target.value })} required /></EditorField>
            <EditorField label="작은 이름"><input value={draft.chapter} onChange={(event) => setDraft({ ...draft, chapter: event.target.value })} required /></EditorField>
            <EditorField label="페이지 제목"><textarea rows={2} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></EditorField>
            <EditorField label="페이지 이야기"><textarea rows={4} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} required /></EditorField>
            <EditorField label="분위기">
              <select value={draft.theme} onChange={(event) => setDraft({ ...draft, theme: event.target.value as StoryTheme })}>
                {themes.map((theme) => <option key={theme.value} value={theme.value}>{theme.label}</option>)}
              </select>
            </EditorField>
            <motion.button type="submit" className="mt-6 w-full rounded-xl bg-[#17151d] px-4 py-4 text-sm font-bold text-white" whileTap={{ scale: 0.97 }}>페이지 저장하기</motion.button>
          </motion.form>
    </motion.div>
  );
}

function EditorField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="mt-4 block font-mono text-[0.64rem] tracking-[0.08em] text-[#77727d] [&_input]:mt-2 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-black/10 [&_input]:bg-white/60 [&_input]:px-4 [&_input]:py-3 [&_input]:font-sans [&_textarea]:mt-2 [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-black/10 [&_textarea]:bg-white/60 [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:font-sans [&_select]:mt-2 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-black/10 [&_select]:bg-white/60 [&_select]:px-4 [&_select]:py-3 [&_select]:font-sans">{label}{children}</label>;
}
