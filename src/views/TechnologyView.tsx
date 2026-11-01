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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-16 bg-black">
      
      {/* Header */}
      <div className="border-b border-[#222222] pb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-white" />
          <span>ENGINEERING FOUNDATIONS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          TECHNOLOGY ARCHITECTURES
        </h1>
        <p className="text-xs sm:text-sm text-white/60 max-w-3xl leading-relaxed">
          Deep technical analysis of the engineering principles, physics breakthroughs, and silicon architectures driving next-generation aerospace, artificial intelligence, and neuroengineering.
        </p>
      </div>

      {/* Deep Dives Grid */}
      <div className="space-y-8">
        {TECH_DEEP_DIVES.map((item, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] hover:border-white/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
          >
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                <span>SYSTEM 0{idx + 1}: {item.subtitle}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
                {item.title}
              </h2>
              <p className="text-xs text-white/70 leading-relaxed">
                {item.description}
              </p>

              {/* Highlights */}
              <div className="pt-2">
                <h4 className="text-[10px] font-mono uppercase text-white/40 mb-2 tracking-wider">
                  PHYSICS & ARCHITECTURE SPECIFICATIONS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#111111] border border-[#222222] text-[11px] text-white/70 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Icon Box */}
            <div className="h-full min-h-[160px] rounded-2xl bg-[#111111] border border-[#222222] p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
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
                <span className="text-[9px] text-white/40 font-mono">
                  First Principles Scale
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Physics First Principles Callout */}
      <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-white" />
          <span>THE FIRST PRINCIPLES METHODOLOGY</span>
        </h3>
        <p className="text-xs text-white/60 leading-relaxed max-w-4xl font-mono text-[11px]">
          "Boil things down to their fundamental truths and reason up from there, as opposed to reasoning by analogy." Across rocket reusability (material cost vs launch price), battery cell chemistry, and autonomous robotics, first principles reasoning drives every major breakthrough.
        </p>
      </div>

    </div>
  );
};
