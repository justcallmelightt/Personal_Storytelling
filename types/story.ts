export type StoryCategory = "turning" | "quiet" | "now";
export type StoryTheme = "paper" | "night" | "lilac" | "warm" | "violet";

export type StoryPage = {
  id: string;
  year: string;
  chapter: string;
  label: string;
  title: string;
  description: string;
  category: StoryCategory;
  theme: StoryTheme;
};

export type StoryProfile = {
  owner: string;
  headline: string;
  introduction: string;
  pages: StoryPage[];
};
