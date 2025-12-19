"use client";

import Logo from "@/components/Logo";
import Link from "next/link";
// FeatureCard is defined locally below

function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 rounded-[24px] bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 transition-colors">
      <h3 className="font-bold mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono text-xs">{desc}</p>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white dark:bg-black font-[family-name:var(--font-inter)] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

      {/* Navbar Placeholder */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center max-w-5xl">
        <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
          <Logo className="w-6 h-6" />
          KeepAlive
        </div>
        <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
          Login
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 max-w-4xl space-y-12 pt-20 pb-20">

        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-block border border-black/10 dark:border-white/10 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wide">
            Open Source Reliability
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter max-w-2xl mx-auto leading-[0.9]">
            Never let your side project die.
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto pt-4">
            Free-tier databases sleep after 7 days of inactivity. <br className="hidden sm:block" />
            KeepAlive prevents silent pauses with legitimate health checks.
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/login" className="h-12 px-8 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center">
            Get Started
          </Link>
          <button className="h-12 px-8 rounded-full border border-neutral-200 dark:border-neutral-800 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-200">
            View on GitHub
          </button>
        </div>

        {/* Squircle Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 w-full text-left">
          <FeatureCard
            title="Decentralized"
            desc="A simple GitHub Action lives in your repo. No shared credentials."
          />
          <FeatureCard
            title="Free Forever"
            desc="Designed for free tiers (Supabase, Render, Neon). Runs on free GitHub Actions."
          />
          <FeatureCard
            title="Invisible"
            desc="Runs quietly twice a week. You only hear from us if something breaks."
          />
        </div>

      </main>

      <footer className="w-full text-center text-neutral-500 text-sm font-mono py-12">
        © 2025 KeepAlive. Built for builders.
      </footer>
    </div>
  );
}
