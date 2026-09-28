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
  onEdit: (page: StoryPage) => void;
};

export function StoryScene({ index, page, editing, onEdit }: StorySceneProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      id={`scene-${page.id}`}
      className={`group relative grid min-h-[82svh] snap-start overflow-hidden rounded-[1.6rem] p-6 sm:p-10 lg:grid-cols-[1fr_2fr_1fr] lg:gap-8 ${themeClass[page.theme]}`}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 130, damping: 25, mass: 0.9 }}
    >
      <div className="font-mono text-xs tracking-[0.08em]">
        {page.year}
        <span className="mt-2 block text-[0.64rem] opacity-50">{page.chapter}</span>
      </div>

      <div className="self-end pb-12 lg:pb-0">
        <span className="font-mono text-[0.64rem] tracking-[0.12em] opacity-55">
          {String(index + 1).padStart(2, "0")} · {page.label}
        </span>
        <h3 className="mt-5 whitespace-pre-line text-[clamp(2.5rem,6vw,5.8rem)] font-black leading-[1.01] tracking-[-0.075em]">
          {page.title}
        </h3>
        <p className="mt-6 max-w-md text-sm leading-7 opacity-70">{page.description}</p>
      </div>

      <div className="pointer-events-none absolute right-6 top-5 font-mono text-6xl opacity-10 sm:right-10 sm:top-8">
        {String(index + 1).padStart(2, "0")}
      </div>

      <motion.button
        type="button"
        onClick={() => onEdit(page)}
        className={`absolute bottom-6 right-6 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-xs backdrop-blur-xl sm:bottom-10 sm:right-10 ${editing ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}`}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 480, damping: 34 }}
      >
        이 페이지 꾸미기
      </motion.button>
    </motion.article>
  );
}
