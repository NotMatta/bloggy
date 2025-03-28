import { Button } from "@/components/ui/button";
import { ChevronRight, Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-4">
      <h1 className="text-5xl md:text-6xl 2xl:text-8xl font-extrabold tracking-widest text-[#DC2626] text-center">Write and Share Your Stories.</h1>
      <p className="text-center md:text-xl">Create your own blog posts using simple Markdown. Experience a clean, distraction-free writing environment and share your thoughts with the world.</p>
      <div className="flex gap-2">
        <Link href="https://github.com/NotMatta/bloggy/tree/main" target="_blank"><Button variant="outline">Source Code <Github/></Button></Link>
        <Link href="/login"><Button>Get Started <ChevronRight/></Button></Link>
      </div>
    </div>
  );
}
