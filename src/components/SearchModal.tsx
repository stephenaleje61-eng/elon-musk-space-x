import React, { useState, useMemo } from 'react';
import { Search, X, ChevronRight, Rocket, Car, Cpu, Globe, Zap, ArrowRight, TrendingUp, Sparkles, Building2, Layers } from 'lucide-react';
import { PRODUCTS_DATA, COMPANIES_DATA, TECH_DEEP_DIVES } from '../data/platformData';
import { ProductItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectCompany: (companyId: string) => void;
  onNavigate: (view: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCompany,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PRODUCTS' | 'COMPANIES' | 'TECH' | 'INVESTMENT'>('ALL');

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return PRODUCTS_DATA.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.company.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return COMPANIES_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.tagline.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredTech = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return TECH_DEEP_DIVES.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.subtitle.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Check if search query matches space investment keywords
  const matchesInvestment = useMemo(() => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    const keywords = ['invest', 'space', 'capital', 'syndicate', 'tier', 'starship', 'allocation', 'fund', 'starlink', 'valuation', 'round'];
    return keywords.some((k) => term.includes(k) || k.includes(term));
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#222222] rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]">
        
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#222222] bg-black">
          <Search className="w-4 h-4 text-white/50 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Starship, Space Investment, Cybertruck, Grok, Starlink..."
            className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-white/40 hover:text-white mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] px-2 py-0.5 bg-[#141414] text-white/50 hover:text-white rounded border border-[#262626] font-mono shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-[#1f1f1f] bg-[#0c0c0c] flex items-center space-x-1.5 overflow-x-auto scrollbar-thin">
          {[
            { id: 'ALL', label: 'ALL' },
            { id: 'PRODUCTS', label: `PRODUCTS (${filteredProducts.length})` },
            { id: 'COMPANIES', label: `COMPANIES (${filteredCompanies.length})` },
            { id: 'TECH', label: `TECH CONCEPTS (${filteredTech.length})` },
            { id: 'INVESTMENT', label: 'SPACE INVESTMENTS' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id as any)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase whitespace-nowrap transition-colors ${
                activeFilter === cat.id
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#141414] text-white/60 hover:text-white border border-[#222222]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto divide-y divide-[#1f1f1f]">
          {!searchTerm.trim() ? (
            <div className="py-8 text-center text-xs text-white/40 space-y-3 font-mono">
              <p>Type keywords to search across products, aerospace vehicles, space investments, and technical specs.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['Starship', 'Investment', 'Cybertruck', 'Optimus', 'Grok', 'Starlink'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (tag === 'Investment') {
                        onNavigate('investment');
                        onClose();
                      } else {
                        setSearchTerm(tag);
                      }
                    }}
                    className="px-2.5 py-1 rounded bg-[#111111] border border-[#262626] text-[10px] text-white/70 hover:text-white hover:border-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Space Investment Highlight if applicable */}
              {(activeFilter === 'ALL' || activeFilter === 'INVESTMENT') && matchesInvestment && (
                <div
                  onClick={() => {
                    onNavigate('investment');
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/20 hover:border-white cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-white transition-colors flex items-center space-x-2">
                        <span>SPACE INVESTMENT & CAPITAL ALLOCATION PORTAL</span>
                        <span className="text-[8px] bg-white text-black font-extrabold px-1 rounded">ACCELERATED</span>
                      </div>
                      <div className="text-[10px] text-white/60 font-mono">
                        Direct allocation tiers ($50K - $1M+) • Starship Launch Economics Calculator
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </div>
              )}

              {/* Products Match */}
              {(activeFilter === 'ALL' || activeFilter === 'PRODUCTS') && filteredProducts.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold tracking-wider text-white/40 uppercase mb-2">
                    PRODUCTS & HARDWARE ({filteredProducts.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-transparent hover:border-[#333333] cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded object-cover border border-[#222222] grayscale"
                          />
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-white transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-white/40 font-mono">
                              {p.company} • {p.category}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies Match */}
              {(activeFilter === 'ALL' || activeFilter === 'COMPANIES') && filteredCompanies.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold tracking-wider text-white/40 uppercase mb-2">
                    COMPANIES ({filteredCompanies.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredCompanies.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelectCompany(c.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-transparent hover:border-[#333333] cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-white transition-colors flex items-center space-x-2">
                            <span>{c.name}</span>
                            {c.isHistorical && (
                              <span className="text-[8px] font-mono px-1 py-0.2 bg-white/10 text-white/60 border border-white/20 rounded">
                                Historical
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/40 line-clamp-1">
                            {c.tagline}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Deep Dives Match */}
              {(activeFilter === 'ALL' || activeFilter === 'TECH') && filteredTech.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold tracking-wider text-white/40 uppercase mb-2">
                    TECHNOLOGY CONCEPTS ({filteredTech.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredTech.map((t, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onNavigate('technology');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] border border-transparent hover:border-[#333333] cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-white transition-colors">
                            {t.title}
                          </div>
                          <div className="text-[10px] text-white/40 font-mono">{t.subtitle}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 && filteredCompanies.length === 0 && filteredTech.length === 0 && !matchesInvestment && (
                <div className="py-12 text-center text-xs text-white/40 font-mono">
                  No results found matching "{searchTerm}".
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
