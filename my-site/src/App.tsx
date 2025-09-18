import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Github, Mail, Camera, Code2, Gamepad2, UtensilsCrossed, Briefcase } from "lucide-react";

// --- Utility: simple scroll-to-section ---
function useScrollRefs<T extends string>(ids: T[]) {
  const refs = useMemo(() => new Map<T, React.RefObject<HTMLDivElement>>(), []);
  ids.forEach(id => {
    if (!refs.has(id)) refs.set(id, useRef<HTMLDivElement>(null));
  });
  const scrollTo = (id: T) => refs.get(id)?.current?.scrollIntoView({ behavior: "smooth" });
  return { refs, scrollTo } as const;
}

// --- Image Gallery with client-side filters + local imports ---
type Photo = { src: string; alt?: string; tag?: string };
function ImageGallery({ title, photos, tags }: { title: string; photos: Photo[]; tags: string[] }) {
  const [active, setActive] = useState<string>("All");
  const [items, setItems] = useState<Photo[]>(photos);

  const filtered = active === "All" ? items : items.filter(p => p.tag === active);

  const onAddFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || []);
    const newOnes: Photo[] = files.map(f => ({ src: URL.createObjectURL(f), alt: f.name, tag: active === "All" ? undefined : active }));
    // Note: these URLs live until refresh; good enough for local tinkering
    setItems(prev => [...newOnes, ...prev]);
  };

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {["All", ...tags].map(t => (
            <button key={t} onClick={() => setActive(t)}
              className={`px-3 py-1 rounded-full border text-sm ${active===t?"bg-white text-black":"border-zinc-700 hover:bg-zinc-800"}`}>
              {t}
            </button>
          ))}
          <label className="cursor-pointer px-3 py-1 rounded-full border border-dashed hover:bg-zinc-800 text-sm">
            + Add Images
            <input type="file" multiple accept="image/*" className="hidden" onChange={onAddFiles} />
          </label>
        </div>
      </div>

      <motion.div layout className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {filtered.map((p, i) => (
            <motion.figure key={p.src} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              whileHover={{ y: -4 }} className="overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800">
              <img src={p.src} alt={p.alt || "photo"} className="w-full h-48 object-cover" />
              {p.alt && <figcaption className="p-2 text-xs opacity-70 truncate">{p.alt}</figcaption>}
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

// --- Section Shell ---
function Section({ icon, title, blurb, children }: { icon: React.ReactNode; title: string; blurb?: string; children?: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="py-14 border-t border-zinc-800"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
            {icon}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        </div>
        {blurb && <p className="max-w-3xl text-zinc-300 mb-6">{blurb}</p>}
        {children}
      </div>
    </motion.section>
  );
}

// --- Badges ---
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sm">{children}</span>;
}

export default function PersonalSite() {
  const sections = ["home","gallery","code","projects","games","food","travel","resume"] as const;
  const { refs, scrollTo } = useScrollRefs(sections);

  // Starter demo images (replace with your own!).
  const starterPhotos: Photo[] = [
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200", alt: "Night city", tag: "Travel" },
    { src: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200", alt: "Laptop", tag: "Coding" },
    { src: "https://images.unsplash.com/photo-1466979939565-131c4b39a51a?w=1200", alt: "Mountains", tag: "Travel" },
    { src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200", alt: "Ramen", tag: "Food" },
    { src: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=1200", alt: "Controller", tag: "Games" },
    { src: "https://images.unsplash.com/photo-1514511542834-2c7d65b85732?w=1200", alt: "Burger", tag: "Food" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/60 bg-black/80 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="font-semibold tracking-wide">Albert Chen</button>
          <nav className="hidden md:flex gap-3 text-sm">
            {sections.filter(s => s!=="home").map(s => (
              <button key={s} onClick={() => scrollTo(s)} className="px-3 py-1 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 capitalize">
                {s}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div ref={refs.get("home")} className="relative overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Hi, I’m Albert —
            <span className="block text-zinc-300 text-2xl md:text-3xl mt-3">I build software, travel, and take too many photos.</span>
          </h1>
          <p className="mt-6 text-zinc-300 max-w-2xl">This is my tiny corner of the internet. Scroll for photos from my camera roll and sections for code, projects, games, food, and travel.</p>
          <div className="mt-8 flex gap-3">
            <a href="#" className="px-4 py-2 rounded-xl bg-white text-black font-medium">Contact</a>
            <a href="#" className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-900">GitHub</a>
          </div>
        </motion.div>
      </div>

      {/* GALLERY */}
      <div ref={refs.get("gallery")}>
        <Section icon={<Camera className="w-5 h-5" />} title="Photos" blurb="Drop in your camera roll. Filter by category, add images locally, and make it yours.">
          <ImageGallery title="Gallery" photos={starterPhotos} tags={["Travel","Food","Games","Coding"]} />
        </Section>
      </div>

      {/* CODE / STACK */}
      <div ref={refs.get("code")}>
        <Section icon={<Code2 className="w-5 h-5" />} title="Coding Languages">
          <div className="flex flex-wrap gap-2">
            {"TypeScript, Python, Racket, C, C++, Flask, MongoDB".split(", ").map(x => <Badge key={x}>{x}</Badge>)}
          </div>
        </Section>
      </div>

      {/* PROJECTS */}
      <div ref={refs.get("projects")}>
        <Section icon={<Briefcase className="w-5 h-5" />} title="Projects" blurb="A few things I’ve built or am tinkering with.">
          <div className="grid gap-4 md:grid-cols-2">
            {[1,2,3,4].map(i => (
              <motion.div key={i} whileHover={{ y: -4 }} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h3 className="font-semibold mb-1">Project {i}</h3>
                <p className="text-sm text-zinc-300">Short one-liner about what it does and why it’s cool.</p>
                <div className="mt-3 flex gap-2">
                  <a className="text-sm underline" href="#">Demo</a>
                  <a className="text-sm underline" href="#">Code</a>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      </div>

      {/* GAMES */}
      <div ref={refs.get("games")}>
        <Section icon={<Gamepad2 className="w-5 h-5" />} title="Games I Play">
          <div className="flex flex-wrap gap-2">
            {"Valorant, LoL, Elden Ring, Rocket League".split(", ").map(x => <Badge key={x}>{x}</Badge>)}
          </div>
        </Section>
      </div>

      {/* FOOD */}
      <div ref={refs.get("food")}>
        <Section icon={<UtensilsCrossed className="w-5 h-5" />} title="Food Log (highlights)">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {["Tonkotsu Ramen","Smash Burger","Beef Noodle Soup"].map(d => (
              <div key={d} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="text-sm opacity-80 mb-2">{d}</div>
                <div className="h-32 rounded-xl bg-zinc-800/60" />
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* TRAVEL */}
      <div ref={refs.get("travel")}>
        <Section icon={<MapPin className="w-5 h-5" />} title="Travel Map" blurb="Pin the places you’ve been or want to go. Replace this embed with your own map (Google My Maps or MapLibre).">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-800">
            <iframe
              title="World Map"
              className="w-full h-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-179.99%2C-85%2C179.99%2C85&layer=mapnik"
              loading="lazy"
            />
          </div>
        </Section>
      </div>

      {/* RESUME */}
      <div ref={refs.get("resume")}>
        <Section icon={<Github className="w-5 h-5" />} title="Resume & Links">
          <div className="flex flex-wrap gap-3">
            <a className="px-4 py-2 rounded-xl bg-white text-black font-medium" href="#">Download Resume (PDF)</a>
            <a className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-900" href="#">GitHub</a>
            <a className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-900" href="#">LinkedIn</a>
            <a className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-900" href="mailto:albert@example.com"><Mail className="inline w-4 h-4 mr-1"/>Email</a>
          </div>
        </Section>
      </div>

      {/* FOOTER */}
      <footer className="py-10 border-t border-zinc-800 text-center text-sm text-zinc-400">
        <p>© {new Date().getFullYear()} Albert Chen. Built with React + Tailwind + Framer Motion.</p>
      </footer>
    </div>
  );
}
