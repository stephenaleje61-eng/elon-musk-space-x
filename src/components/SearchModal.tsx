import React, { useState, useMemo } from 'react';
import { Search, X, ChevronRight, TrendingUp, ArrowRight } from 'lucide-react';
import { PRODUCTS_DATA, COMPANIES_DATA, TECH_DEEP_DIVES } from '../data/platformData';
import { ProductItem } from '../types';
import { SafeImage } from './SafeImage';

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]">
        
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 bg-zinc-900">
          <Search className="w-4 h-4 text-zinc-500 shrink-0 mr-3" />
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
              className="p-1 text-zinc-400 hover:text-white mr-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] px-2 py-0.5 bg-black text-zinc-400 hover:text-white rounded-lg border border-zinc-800 font-mono shrink-0 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-950 flex items-center space-x-1.5 overflow-x-auto scrollbar-thin">
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
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto divide-y divide-zinc-800 bg-zinc-900">
          {!searchTerm.trim() ? (
            <div className="py-8 text-center text-xs text-zinc-400 space-y-3 font-mono">
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
                    className="px-2.5 py-1 rounded-lg bg-black border border-zinc-800 text-[10px] text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
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
                  className="p-3.5 rounded-2xl bg-black border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center space-x-2">
                        <span>SPACE INVESTMENT & CAPITAL ALLOCATION PORTAL</span>
                        <span className="text-[8px] bg-white text-black font-bold px-1 rounded">ACCELERATED</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        Direct allocation tiers ($50K - $1M+) • Starship Launch Economics Calculator
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </div>
              )}

              {/* Products Match */}
              {(activeFilter === 'ALL' || activeFilter === 'PRODUCTS') && filteredProducts.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase mb-2">
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
                        className="p-2.5 rounded-xl bg-black hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <SafeImage
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-zinc-800 bg-zinc-950"
                            fallbackText={p.name.slice(0, 2)}
                          />
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              {p.company} • {p.category}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies Match */}
              {(activeFilter === 'ALL' || activeFilter === 'COMPANIES') && filteredCompanies.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase mb-2">
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
                        className="p-2.5 rounded-xl bg-black hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors flex items-center space-x-2">
                            <span>{c.name}</span>
                            {c.isHistorical && (
                              <span className="text-[8px] font-mono px-1 py-0.2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded">
                                Historical
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-400 line-clamp-1">
                            {c.tagline}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Deep Dives Match */}
              {(activeFilter === 'ALL' || activeFilter === 'TECH') && filteredTech.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase mb-2">
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
                        className="p-2.5 rounded-xl bg-black hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                            {t.title}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">{t.subtitle}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 && filteredCompanies.length === 0 && filteredTech.length === 0 && !matchesInvestment && (
                <div className="py-12 text-center text-xs text-zinc-500 font-mono">
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
