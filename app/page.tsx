import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { Metrics } from "@/components/Metrics";
import { Achievements } from "@/components/Achievements";
import { Education } from "@/components/Education";
import { Writing } from "@/components/Writing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sidakpreet Singh — Strategy & Product",
  description:
    "Corporate strategy and product professional. Building at the intersection of technology and business.",
};

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="relative bg-background">
        <Hero data={null} />
        <Experience />
        <Skills />
        <Metrics />
        <Achievements />
        <Education />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}