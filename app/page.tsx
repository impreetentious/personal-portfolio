import type { Metadata } from "next";
import { Hero }         from "@/components/Hero";
import { Experience }   from "@/components/Experience";
import { Skills }       from "@/components/Skills";
import { Metrics }      from "@/components/Metrics";
import { Achievements } from "@/components/Achievements";
import { Education }    from "@/components/Education";
import { Writing }      from "@/components/Writing";
import { Contact }      from "@/components/Contact";
import { Footer }       from "@/components/Footer";

import { siteConfig }   from "@/lib/config";

export const metadata: Metadata = {
  title      : 'Sidakpreet Singh | Portfolio',
  description: "Sidakpreet Singh's interactive portfolio",
};

export default function Home() {
  return (
    <div id="main-content" className="relative flex flex-col">
      <Hero data={null} />
      <Experience />
      <Skills />
      <Metrics />
      <Achievements />
      <Education />
      
      {/* ── Feature Flag Toggle ── */}
      {siteConfig.features.showWriting && <Writing />}
      
      <Contact />
      <Footer />
    </div>
  );
}