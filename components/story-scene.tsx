"use client";

import { motion, useReducedMotion } from "motion/react";
import type { StoryPage } from "@/types/story";

const themeClass: Record<StoryPage["theme"], string> = {
  paper: "bg-[#e5e0d8] text-[#17151d]",
  night: "bg-[#232128] text-[#f7f4ef]",
  lilac: "bg-[#dcd5ee] text-[#17151d]",
  warm: "bg-[#e8cda9] text-[#17151d]",
  violet: "bg-[#7764a9] text-[#f7f4ef]",
};

type StorySceneProps = {
  index: number;
  page: StoryPage;
  editing: boolean;
  onEdit?: (page: StoryPage) => void;
};

export function StoryScene({ index, page, editing, onEdit }: StorySceneProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      id={`scene-${page.id}`}
      className={`group relative grid min-h-svh w-full snap-start snap-always overflow-hidden px-[5vw] pb-[7svh] pt-[16svh] lg:grid-cols-[1fr_2fr_1fr] lg:gap-8 ${themeClass[page.theme]}`}
      initial={false}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.52 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.28 }}
    >
      <motion.div
        className="font-mono text-xs tracking-[0.08em]"
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.6 }}
        transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 150, damping: 26 }}
      >
        {page.year}
        <span className="mt-2 block text-[0.64rem] opacity-50">{page.chapter}</span>
      </motion.div>

      <motion.div
        className="self-end pb-16 lg:pb-0"
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.5 }}
        transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 120, damping: 24, delay: 0.04 }}
      >
        <span className="font-mono text-[0.64rem] tracking-[0.12em] opacity-55">
          {String(index + 1).padStart(2, "0")} · {page.label}
        </span>
        <h3 className="mt-5 whitespace-pre-line text-[clamp(2.5rem,6vw,5.8rem)] font-black leading-[1.01] tracking-[-0.075em]">
          {page.title}
        </h3>
        <p className="mt-6 max-w-md text-sm leading-7 opacity-70">{page.description}</p>
      </motion.div>

      <div className="pointer-events-none absolute right-6 top-5 font-mono text-6xl opacity-10 sm:right-10 sm:top-8">
        {String(index + 1).padStart(2, "0")}
      </div>

      {onEdit && <motion.button
        type="button"
        onClick={() => onEdit(page)}
        className={`absolute bottom-[5svh] right-[5vw] rounded-full border border-white/40 bg-white/20 px-4 py-2 text-xs backdrop-blur-xl ${editing ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}`}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 480, damping: 34 }}
      >
        이 페이지 꾸미기
      </motion.button>}
    </motion.article>
  );
}
