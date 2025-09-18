import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Github, Mail, Camera, Code2, Gamepad2, Briefcase } from "lucide-react";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

/* ---------- Section ---------- */
function Section({
  icon,
  title,
  blurb,
  children,
  bgUrl,
  innerClassName = "",
  sectionId,
  onActivate,
  animateIn = true,
}: {
  icon?: React.ReactNode;
  title?: string;
  blurb?: string;
  children?: React.ReactNode;
  bgUrl: string;                           // <-- required string
  innerClassName?: string;
  sectionId: string;
  onActivate?: (url: string) => void;      // <-- takes a string
  animateIn?: boolean;
}) {
  return (
    <motion.section
      id={sectionId}
      initial={animateIn ? { opacity: 0, y: 12 } : false}
      whileInView={animateIn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: false, amount: 0.55 }}
      onViewportEnter={() => onActivate?.(bgUrl)}  // <-- always passes a string
      className="relative w-full min-h-screen"
    >
      <div className={`relative flex min-h-screen items-center px-4 md:px-8 ${innerClassName}`}>
        <div className="w-full">
          {(icon || title) && (
            <div className="mb-6 flex items-center gap-3">
              {icon && <div className="p-2 rounded-xl bg-zinc-900/70 border border-zinc-800">{icon}</div>}
              {title && <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>}
            </div>
          )}
          {blurb && <p className="text-zinc-300 mb-6 max-w-3xl">{blurb}</p>}
          {children}
        </div>
      </div>
    </motion.section>
  );
}

/* ---------- Small UI ---------- */
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-sm">{children}</span>;
}

/* ---------- Gallery ---------- */
type Photo = { src: string; alt?: string; tag?: string };

function ImageGallery({ title, photos, tags }: { title: string; photos: Photo[]; tags: string[] }) {
  const [active, setActive] = useState<string>("All");
  const [items, setItems] = useState<Photo[]>(photos);
  const filtered = active === "All" ? items : items.filter((p) => p.tag === active);

  const onAddFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || []);
    const newOnes: Photo[] = files.map((f) => ({
      src: URL.createObjectURL(f),
      alt: f.name,
      tag: active === "All" ? undefined : active,
    }));
    setItems((prev) => [...newOnes, ...prev]);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {["All", ...tags].map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-3 py-1 rounded-full border text-sm ${
                active === t ? "bg-white text-black" : "border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              {t}
            </button>
          ))}
          <label className="cursor-pointer px-3 py-1 rounded-full border border-dashed hover:bg-zinc-800 text-sm">
            + Add Images
            <input type="file" multiple accept="image/*" className="hidden" onChange={onAddFiles} />
          </label>
        </div>
      </div>

      <motion.div layout className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        <AnimatePresence>
          {filtered.map((p) => (
            <motion.figure
              key={p.src}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-2xl bg-zinc-900/80 border border-zinc-800"
            >
              <img src={p.src} alt={p.alt || "photo"} className="w-full h-64 object-cover" />
              {p.alt && <figcaption className="p-2 text-xs opacity-70 truncate">{p.alt}</figcaption>}
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ---------- Code Playground ---------- */
function CodePlayground({ languages }: { languages: string[] }) {
  const [active, setActive] = useState<string>(languages[0] || "TypeScript");
  const samples: Record<string, string> = {
    Python: `print("Welcome to my website!")`,
    C: `#include <stdio.h>\nint main(){\n\tprintf("Welcome to my website!\\n");\n\treturn 0;\n}`,
    Java: `class Main {\n\tpublic static void main(String[] args){\n\t\tSystem.out.println("Welcome to my website!");\n\t}\n}`,
    Assembly: `.data\nmsg: .asciiz "Welcome to my website!"\n\n.text\n.globl main\nmain:\n\tli $v0,4\n\tla $a0,msg\n\tsyscall\n\tli $v0,10\n\tsyscall`,
    Bash: `echo "Welcome to my website!"`,
    Ruby: `puts "Welcome to my website!"`,
    OCaml: `print_endline "Welcome to my website!";`,
    Rust: `fn main(){\n\tprintln!("Welcome to my website!");\n}`,
    TypeScript: `console.log("Welcome to my website!");`,
    R: `print("Welcome to my website!")`,
    Matlab: `disp("Welcome to my website!")`,
    Racket: `#lang racket\n(displayln "Welcome to my website!")`,
  };

  const full = samples[active] ?? `console.log("Welcome to my website!");`;
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 8);
    return () => clearInterval(id);
  }, [active, full]);

  return (
    <div className="w-full md:max-w-3xl">
      {/* chips, left-aligned, vertically centered in top half */}
      <div className="min-h-[50vh] flex items-center">
        <div>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActive(lang)}
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  active === lang ? "bg-white text-black" : "border-zinc-700 hover:bg-zinc-800"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* code window directly below */}
      <div className="mt-6 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/90 w-full">
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500/70" />
            <span className="size-3 rounded-full bg-yellow-500/70" />
            <span className="size-3 rounded-full bg-green-500/70" />
          </div>
          <div className="ml-2 text-xs uppercase tracking-wider opacity-80">{active}</div>
          <div />
        </div>
        <pre className="p-4 overflow-auto text-sm leading-6 min-h-[12rem]">
          <code className="whitespace-pre text-zinc-200">
            {typed}
            <span className="inline-block w-[8px] h-[1.1em] align-[-0.2em] bg-zinc-200 ml-0.5 animate-pulse" />
          </code>
        </pre>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const sections = ["home", "code", "projects", "games", "travel", "gallery", "resume"] as const;

  // Safe default so bg is never empty/black
  const [bgUrl, setBgUrl] = useState<string>(asset("main.jpg"));
  const setBg = (u: string) => setBgUrl(u);         // <-- wrapper fixes the TS mismatch

  const starterPhotos: Photo[] = [
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2000", alt: "Night city", tag: "Travel" },
    { src: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=2000", alt: "Laptop", tag: "Coding" },
    { src: "https://images.unsplash.com/photo-1466979939565-131c4b39a51a?w=2000", alt: "Mountains", tag: "Travel" },
    { src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=2000", alt: "Ramen", tag: "Food" },
    { src: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=2000", alt: "Controller", tag: "Games" },
    { src: "https://images.unsplash.com/photo-1514511542834-2c7d65b85732?w=2000", alt: "Burger", tag: "Food" },
  ];

  const HEADER_H = 56; // h-14
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_H;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full text-white">
      <style>{`html{scrollbar-gutter:stable}`}</style>

      {/* Background (behind everything) */}
      <div aria-hidden className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          {bgUrl && (
            <motion.img
              key={bgUrl}
              src={bgUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/60 bg-black/80 border-b border-zinc-800 px-4">
        <div className="w-full h-14 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="font-semibold tracking-wide">
            Albert Chen
          </button>
          <nav className="hidden md:flex gap-3 text-sm">
            {sections.filter((s) => s !== "home").map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="px-3 py-1 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 capitalize"
              >
                {s}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 pt-14">
        <Section
          sectionId="home"
          onActivate={setBg}
          bgUrl={asset("main.jpg")}
          animateIn={false}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Hi, I’m Albert —
            <span className="block text-zinc-200 text-2xl md:text-3xl mt-3">
              coder, doomscroller, eater, answerer, and video game enjoyer.
            </span>
          </h1>
          <p className="mt-6 text-zinc-200/90 max-w-2xl">Scroll to learn more about me.</p>
        </Section>

        <Section
          sectionId="code"
          onActivate={setBg}
          icon={<Code2 className="w-5 h-5" />}
          title="Coding Languages"
          bgUrl={asset("mac.jpg")}
          innerClassName="items-start"
        >
          <CodePlayground
            languages={
              "Python, C, Java, Assembly, Bash, Ruby, OCaml, Rust, TypeScript, R, Matlab, Racket".split(", ")
            }
          />
        </Section>

        <Section
          sectionId="projects"
          onActivate={setBg}
          icon={<Briefcase className="w-5 h-5" />}
          title="Projects"
          blurb="A few things I’ve built or am tinkering with."
          bgUrl="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=2400"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                <h3 className="font-semibold mb-1">Project {i}</h3>
                <p className="text-sm text-zinc-200">Short one-liner about what it does and why it’s cool.</p>
                <div className="mt-3 flex gap-2">
                  <a className="text-sm underline" href="#">Demo</a>
                  <a className="text-sm underline" href="#">Code</a>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section
          sectionId="games"
          onActivate={setBg}
          icon={<Gamepad2 className="w-5 h-5" />}
          title="Games I Play"
          bgUrl="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=2400"
        >
          <div className="flex flex-wrap gap-2">
            {"Valorant, LoL, Elden Ring, Rocket League".split(", ").map((x) => (
              <Badge key={x}>{x}</Badge>
            ))}
          </div>
        </Section>

        <Section
          sectionId="travel"
          onActivate={setBg}
          icon={<MapPin className="w-5 h-5" />}
          title="Travel Map"
          blurb="Pin the places you’ve been or want to go. Replace this embed with your own map (Google My Maps or MapLibre)."
          bgUrl="https://images.unsplash.com/photo-1466979939565-131c4b39a51a?w=2400"
        >
          <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-800">
            <iframe
              title="World Map"
              className="w-full h-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-179.99%2C-85%2C179.99%2C85&layer=mapnik"
              loading="lazy"
            />
          </div>
        </Section>

        <Section
          sectionId="gallery"
          onActivate={setBg}
          icon={<Camera className="w-5 h-5" />}
          title="Photos"
          blurb="Drop in your camera roll. Filter by category, add images locally, and make it yours."
          bgUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2400"
        >
          <ImageGallery
            title="Gallery"
            photos={starterPhotos}
            tags={["Travel", "Food", "Games", "Coding"]}
          />
        </Section>

        <Section
          sectionId="resume"
          onActivate={setBg}
          icon={<Github className="w-5 h-5" />}
          title="Resume & Links"
          bgUrl="https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=2400"
        >
          <div className="flex flex-wrap gap-3">
            <a className="px-4 py-2 rounded-xl bg-white text-black font-medium" href="#">Download Resume (PDF)</a>
            <a className="px-4 py-2 rounded-xl border border-zinc-300/40 hover:bg-zinc-900" href="#">GitHub</a>
            <a className="px-4 py-2 rounded-xl border border-zinc-300/40 hover:bg-zinc-900" href="#">LinkedIn</a>
            <a className="px-4 py-2 rounded-xl border border-zinc-300/40 hover:bg-zinc-900" href="mailto:albert@example.com">
              <Mail className="inline w-4 h-4 mr-1" />Email
            </a>
          </div>
        </Section>

        <footer className="py-20 text-center text-sm text-zinc-300">
          © {new Date().getFullYear()} Albert Chen. Built with React + Tailwind + Framer Motion.
        </footer>
      </main>
    </div>
  );
}
