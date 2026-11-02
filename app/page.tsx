import Link from 'next/link';
import { 
  Image, 
  Brain, 
  Sparkles, 
  HelpCircle, 
  ArrowRight 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FCFDFD] text-[#0F172A] font-sans antialiased selection:bg-[#486851] selection:text-white">
      {/* 1. Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-[#0F172A]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#486851] flex items-center justify-center text-white font-serif italic text-lg sm:text-xl font-bold leading-none select-none shrink-0">
            ∫
          </div>
          <span className="truncate">LearnMaths</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/login"
            className="px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] hover:text-[#486851] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#486851] hover:bg-[#3b5542] rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-20">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
          Learn Mathematics the way it's meant to be learned.
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl font-normal mb-6 sm:mb-8">
          A dedicated teaching environment powered by structured explanations, full visual figure references, and rigorous step-by-step derivations.
        </p>
        <div>
          <Link
            href="/signup"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#486851] hover:bg-[#3b5542] rounded-lg transition-colors shadow-md"
          >
            Start Learning Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Core Teaching Methodology Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-slate-100">
        <div className="mb-10 sm:mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-3">
            Designed for genuine mathematical clarity.
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            No skipped steps, generic formulas, or shallow shortcuts. Every topic is taught using formal logic and clean visual context.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#486851] text-white flex items-center justify-center shadow-sm">
              <Image className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
              Visual Reference Diagrams
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Explore geometric figures, coordinate graphs, and visual proofs alongside detailed text explanations.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#486851] text-white flex items-center justify-center shadow-sm">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
              First-Principles Derivations
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Learn the exact logical "why" behind every formula, building an intuitive understanding that lasts.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#486851] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
              Structured Problem Sets
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              Work through curated proofs and step-by-step solutions formatted in clean LaTeX and KaTeX notation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Curriculum Journey Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-slate-100">
        <div className="mb-10 sm:mb-12 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-3">
            The Learning Process
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            How concepts are structured inside the platform to guide you from foundational principles to complete mastery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100">
            <span className="text-xs sm:text-sm font-bold text-[#486851] uppercase tracking-wider">Phase 1</span>
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mt-2 mb-2">Core Concepts & Visuals</h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Examine the fundamental definitions, axiom breakdowns, and visual reference models for each topic.
            </p>
          </div>

          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100">
            <span className="text-xs sm:text-sm font-bold text-[#486851] uppercase tracking-wider">Phase 2</span>
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mt-2 mb-2">Guided Steps & Proofs</h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Follow comprehensive step-by-step logical derivations with exact mathematical notation.
            </p>
          </div>

          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100">
            <span className="text-xs sm:text-sm font-bold text-[#486851] uppercase tracking-wider">Phase 3</span>
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mt-2 mb-2">Active Practice</h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Test your understanding against structured practice questions and verified step-by-step solutions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-slate-100">
        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Everything you need to know about the LearnMaths curriculum.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2 flex items-start sm:items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#486851] shrink-0 mt-0.5 sm:mt-0" />
              How are topics presented in LearnMaths?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm sm:pl-7">
              Lessons combine detailed textual explanations with precise visual diagrams, geometric graphs, and step-by-step LaTeX equations.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2 flex items-start sm:items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#486851] shrink-0 mt-0.5 sm:mt-0" />
              What subjects are covered?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm sm:pl-7">
              The platform focuses on secondary and higher secondary mathematics, including foundational algebra, geometry, precalculus, functions, and calculus concepts.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-2 flex items-start sm:items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#486851] shrink-0 mt-0.5 sm:mt-0" />
              Why focus on first-principles learning?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm sm:pl-7">
              Memorizing formulas leads to roadblocks when facing complex problems. First-principles teaching ensures you understand the core logic and can solve novel problems with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Call To Action (CTA) Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-10 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-3 sm:mb-4">
            Ready to master mathematics?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-xl mx-auto">
            Access structured lessons, clear visual references, and first-principles derivations today.
          </p>
          <Link
            href="/signup"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3.5 sm:py-4 text-base font-semibold text-white bg-[#486851] hover:bg-[#3b5542] rounded-xl transition-colors shadow-md"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-[#486851] text-white py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/20 pb-8 mb-6 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-serif italic text-xl font-bold leading-none select-none">
              ∫
            </div>
            <span className="text-xl font-bold tracking-tight">LearnMaths</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center md:text-left text-xs sm:text-sm text-white/60">
          
          Developed by Bilal Baloch
        </div>
      </footer>
    </div>
  );
}