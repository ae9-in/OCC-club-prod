"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Dumbbell, Music, Users } from "lucide-react";
import PublicPageGrid from "@/components/PublicPageGrid";
import SiteContainer from "@/components/SiteContainer";

const opportunityItems = [
  { title: "Gigs", body: "Apply to real opportunities, get selected, and unlock the details once you are approved." },
  { title: "Projects", body: "Step into collaborations that move beyond college routine and into actual execution." },
  { title: "Earn", body: "Use OCC to contribute, build, and turn your skills into paid momentum." },
];

const lifestyleItems = [
  { title: "Events", body: "Find clubs, meetups, and gatherings that turn new people into real connections.", icon: Users },
  { title: "Fitness", body: "Join routines, challenges, and wellness circles that keep student life moving.", icon: Dumbbell },
  { title: "Culture", body: "Music, fashion, football, and beyond. OCC connects you to people who actually show up.", icon: Music },
];

const ecosystemItems = [
  {
    title: "What We Do",
    body: "We bring together communities and opportunities into one ecosystem so students do more than just join. They participate.",
  },
  {
    title: "The Experience",
    body: "Events, meetups, conversations, and collaborations are built to move you out of passive college life and into real experiences.",
  },
  {
    title: "The Idea",
    body: "College gives you structure. OCC gives you everything else: people, culture, ambition, and room to build beyond campus.",
  },
];

export default function AboutPageContent() {
  return (
    <PublicPageGrid className="min-h-screen bg-brutal-gray">
      <section className="border-b-8 border-black bg-white py-20 md:py-28">
        <SiteContainer className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p
              className="mb-5 font-black uppercase tracking-[0.26em] text-brutal-blue animate-slideDown"
              style={{ animationDelay: "80ms", animationFillMode: "both" }}
            >
              About OCC
            </p>
            <h1
              className="text-6xl font-black uppercase leading-[0.82] tracking-tighter md:text-8xl animate-slideUp"
              style={{ animationDelay: "150ms", animationFillMode: "both" }}
            >
              Work. Build. Play.
            </h1>
            <p
              className="mt-8 max-w-2xl border-l-8 border-black bg-brutal-gray p-6 pl-8 text-xl font-bold shadow-[6px_6px_0_0_#000] animate-fadeIn"
              style={{ animationDelay: "260ms", animationFillMode: "both" }}
            >
              OCC is where college life expands beyond the campus. It is a space for students who want more people, more experiences, and more opportunities all in one ecosystem.
            </p>
          </div>
          <div
            className="border-4 border-black bg-black p-8 text-white shadow-[10px_10px_0_0_#1d2cf3] animate-fadeIn"
            style={{ animationDelay: "340ms", animationFillMode: "both" }}
          >
            <p className="text-sm font-black uppercase tracking-[0.24em] text-white/60">Built for momentum</p>
            <p className="mt-4 text-2xl font-black leading-snug">
              Community, culture, and ambition in one place. Not just join. Participate.
            </p>
          </div>
        </SiteContainer>
      </section>

      <SiteContainer as="section" className="py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {ecosystemItems.map((item, index) => (
            <div
              key={item.title}
              className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000] animate-fadeIn"
              style={{ animationDelay: `${140 + index * 90}ms`, animationFillMode: "both" }}
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] text-brutal-blue">{item.title}</p>
              <p className="mt-4 text-lg font-bold text-gray-700">{item.body}</p>
            </div>
          ))}
        </div>
      </SiteContainer>

      <SiteContainer as="section" className="py-20">
        <div
          className="mb-10 flex items-center gap-3 text-brutal-blue animate-slideUp"
          style={{ animationDelay: "140ms", animationFillMode: "both" }}
        >
          <BriefcaseBusiness className="h-6 w-6" />
          <span className="font-black uppercase tracking-[0.24em]">Opportunities</span>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {opportunityItems.map((item, index) => (
            <div
              key={item.title}
              className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000] animate-fadeIn"
              style={{ animationDelay: `${180 + index * 90}ms`, animationFillMode: "both" }}
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter">{item.title}</h2>
              <p className="mt-4 text-lg font-bold text-gray-700">{item.body}</p>
            </div>
          ))}
        </div>
      </SiteContainer>

      <section className="border-y-8 border-black bg-brutal-blue py-20 text-white">
        <SiteContainer>
          <p
            className="mb-5 font-black uppercase tracking-[0.24em] text-white/70 animate-slideUp"
            style={{ animationDelay: "140ms", animationFillMode: "both" }}
          >
            Lifestyle
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {lifestyleItems.map(({ title, body, icon: Icon }, index) => (
              <div
                key={title}
                className="border-4 border-black bg-white p-8 text-black shadow-[8px_8px_0_0_#000] animate-fadeIn"
                style={{ animationDelay: `${180 + index * 90}ms`, animationFillMode: "both" }}
              >
                <div className="mb-5 inline-flex border-2 border-black bg-brutal-gray p-3"><Icon className="h-6 w-6" /></div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">{title}</h2>
                <p className="mt-4 text-lg font-bold text-gray-700">{body}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>

      <SiteContainer as="section" className="py-20">
        <div
          className="border-4 border-black bg-white p-10 shadow-[10px_10px_0_0_#000] md:flex md:items-center md:justify-between animate-fadeIn"
          style={{ animationDelay: "140ms", animationFillMode: "both" }}
        >
          <div>
            <p className="font-black uppercase tracking-[0.24em] text-brutal-blue">Ready to move?</p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-tighter md:text-5xl">Join OCC or Explore Opportunities</h2>
            <p className="mt-4 max-w-2xl text-lg font-bold text-gray-700">
              Be part of something that goes beyond your campus.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 md:mt-0">
            <Link href="/register" className="border-4 border-black bg-black px-8 py-4 font-black uppercase text-white shadow-[6px_6px_0_0_#1d2cf3] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Join OCC
            </Link>
            <Link href="/gigs" className="border-4 border-black bg-white px-8 py-4 font-black uppercase text-black shadow-[6px_6px_0_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              <span className="flex items-center gap-2">Explore Opportunities <ArrowRight className="h-4 w-4" /></span>
            </Link>
          </div>
        </div>
      </SiteContainer>
    </PublicPageGrid>
  );
}
