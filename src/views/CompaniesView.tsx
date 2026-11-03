import React, { useState } from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  CheckCircle2
} from 'lucide-react';
import { COMPANIES_DATA, PRODUCTS_DATA } from '../data/platformData';
import { ProductItem } from '../types';
import { SafeImage } from '../components/SafeImage';

interface CompaniesViewProps {
  selectedCompanyId?: string;
  onSelectProduct: (product: ProductItem) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  selectedCompanyId,
  onSelectProduct,
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedCompanyId || 'tesla');

  const selectedCompany = COMPANIES_DATA.find((c) => c.id === activeTab) || COMPANIES_DATA[0];
  const relatedProducts = PRODUCTS_DATA.filter((p) => 
    p.company.toLowerCase().includes(selectedCompany.name.toLowerCase().split(' ')[0])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12 bg-black text-white">
      
      {/* Directory Header */}
      <div className="border-b border-zinc-800 pb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>INDEPENDENT ENTERPRISE DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          COMPANY DIRECTORY
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Comprehensive directory of groundbreaking aerospace, automotive, clean energy, neurotechnology, and artificial intelligence enterprises.
        </p>
      </div>

      {/* Company Selector Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {COMPANIES_DATA.map((company) => {
          const isActive = company.id === activeTab;
          return (
            <button
              key={company.id}
              onClick={() => setActiveTab(company.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-extrabold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <span>{company.name}</span>
              {company.isHistorical && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  Historical
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Company Showcase Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Banner with Meta Overlays */}
        <div className="relative h-72 sm:h-96 w-full bg-zinc-950 overflow-hidden">
          <SafeImage
            src={selectedCompany.bannerImage}
            alt={selectedCompany.name}
            className="w-full h-full object-cover opacity-75 grayscale contrast-125"
            fallbackText={selectedCompany.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {selectedCompany.isHistorical ? (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700 backdrop-blur-sm">
                    HISTORICAL VENTURE (MERGED INTO TESLA)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-black font-extrabold">
                    OPERATIONAL ENTERPRISE
                  </span>
                )}
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {selectedCompany.name}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-1">
                {selectedCompany.tagline}
              </p>
            </div>

            <a
              href={selectedCompany.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shrink-0 shadow-lg cursor-pointer"
            >
              <span>VISIT OFFICIAL SITE</span>
              <ExternalLink className="w-3.5 h-3.5 text-black" />
            </a>
          </div>
        </div>

        {/* Company Overview & Key Data */}
        <div className="p-6 sm:p-10 space-y-10 bg-zinc-900">
          
          {/* Historical Alert Note if SolarCity */}
          {selectedCompany.isHistorical && (
            <div className="p-4 rounded-xl bg-black border border-zinc-800 text-zinc-300 text-xs leading-relaxed space-y-1 font-mono">
              <span className="font-bold text-white block uppercase tracking-wider text-[11px]">
                HISTORICAL VENTURE CLARIFICATION:
              </span>
              <p className="text-[11px] text-zinc-400">
                SolarCity was founded in 2006 and backed by Elon Musk. In 2016, Tesla acquired SolarCity for $2.6 billion, folding its residential solar panel and roof tile installations directly into Tesla Energy. Note: Companies across this platform operate under distinct corporate and legal entities.
              </p>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-black border border-zinc-800 flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-white" />
              <div>
                <div className="text-[9px] text-zinc-500 uppercase font-mono">Founded</div>
                <div className="text-xs font-bold text-white font-mono">{selectedCompany.founded}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-zinc-800 flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-white" />
              <div>
                <div className="text-[9px] text-zinc-500 uppercase font-mono">Headquarters</div>
                <div className="text-xs font-bold text-white">{selectedCompany.headquarters}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-zinc-800 flex items-center space-x-3">
              <ShieldCheck className="w-4 h-4 text-white" />
              <div>
                <div className="text-[9px] text-zinc-500 uppercase font-mono">Status</div>
                <div className="text-xs font-bold text-white font-mono">
                  {selectedCompany.isHistorical ? 'Merged' : 'Global Operations'}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              COMPANY PROFILE & MISSION
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {selectedCompany.description}
            </p>
          </div>

          {/* Key Statistics */}
          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-3">
              KEY MILESTONES & OPERATING METRICS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {selectedCompany.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black border border-zinc-800 space-y-1"
                >
                  <div className="text-2xl font-black text-white font-mono">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Technologies & Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-zinc-800">
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white mb-3">
                CORE ARCHITECTURAL INNOVATIONS
              </h3>
              <ul className="space-y-2">
                {selectedCompany.keyTechnologies.map((tech, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                    <div className="w-4 h-4 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0 mt-0.5 border border-zinc-700">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white mb-3">
                KEY PRODUCTS & VEHICLES
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedCompany.keyProducts.map((prod, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-black border border-zinc-800 text-[11px] text-zinc-200 font-mono"
                  >
                    {prod}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related Marketplace Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                  PRODUCTS IN MARKETPLACE ({relatedProducts.length})
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">Click to inspect specs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="p-3 rounded-2xl bg-black hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center space-x-3 transition-all group"
                  >
                    <SafeImage
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-800 bg-zinc-950"
                      fallbackText={p.name.slice(0, 3)}
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate">{p.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
