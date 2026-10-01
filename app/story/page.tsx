import { redirect } from "next/navigation";

export default function StoryPage() {
  redirect("/storyframe/index.html?view=read");
}
