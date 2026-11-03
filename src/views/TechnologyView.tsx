import React from 'react';
import { 
  Rocket, 
  Cpu, 
  Wifi, 
  Activity, 
  Layers, 
  Zap, 
  Sparkles, 
  CheckCircle 
} from 'lucide-react';
import { TECH_DEEP_DIVES } from '../data/platformData';

export const TechnologyView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-16 bg-black text-white">
      
      {/* Header */}
      <div className="border-b border-zinc-800 pb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>ENGINEERING FOUNDATIONS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          TECHNOLOGY ARCHITECTURES
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Deep technical analysis of the engineering principles, physics breakthroughs, and silicon architectures driving next-generation aerospace, artificial intelligence, and neuroengineering.
        </p>
      </div>

      {/* Deep Dives Grid */}
      <div className="space-y-8">
        {TECH_DEEP_DIVES.map((item, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center shadow-xl"
          >
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                <span>SYSTEM 0{idx + 1}: {item.subtitle}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
                {item.title}
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {item.description}
              </p>

              {/* Highlights */}
              <div className="pt-2">
                <h4 className="text-[10px] font-mono uppercase text-zinc-500 mb-2 tracking-wider">
                  PHYSICS & ARCHITECTURE SPECIFICATIONS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-black border border-zinc-800 text-[11px] text-zinc-300 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Icon Box */}
            <div className="h-full min-h-[160px] rounded-2xl bg-black border border-zinc-800 p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                {idx === 0 && <Rocket className="w-7 h-7" />}
                {idx === 1 && <Cpu className="w-7 h-7" />}
                {idx === 2 && <Zap className="w-7 h-7" />}
                {idx === 3 && <Wifi className="w-7 h-7" />}
                {idx === 4 && <Activity className="w-7 h-7" />}
                {idx === 5 && <Layers className="w-7 h-7" />}
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block font-mono">
                  {item.subtitle}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">
                  First Principles Scale
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Physics First Principles Callout */}
      <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-white" />
          <span>THE FIRST PRINCIPLES METHODOLOGY</span>
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-4xl font-mono text-[11px]">
          "Boil things down to their fundamental truths and reason up from there, as opposed to reasoning by analogy." Across rocket reusability (material cost vs launch price), battery cell chemistry, and autonomous robotics, first principles reasoning drives every major breakthrough.
        </p>
      </div>

    </div>
  );
};
