import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Info 
} from 'lucide-react';
import { PRODUCTS_DATA } from '../data/platformData';
import { ProductItem } from '../types';

interface ProductsViewProps {
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onSelectProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Electric Vehicles',
    'Energy',
    'Space Technology',
    'Robotics',
    'Internet',
    'Artificial Intelligence'
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-10 bg-black">
      
      {/* Marketplace Header */}
      <div className="border-b border-[#222222] pb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-white" />
          <span>INDEPENDENT TECHNOLOGY MARKETPLACE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          HARDWARE & VEHICLES
        </h1>
        <p className="text-xs sm:text-sm text-white/60 max-w-3xl leading-relaxed">
          Explore specifications, engineering breakthroughs, and verified availability of electric vehicles, energy storage, orbital spacecraft, satellite systems, and humanoid robotics.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Model S, Starship, Grok, Optimus..."
            className="w-full bg-[#0a0a0a] border border-[#222222] focus:border-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-black font-extrabold'
                    : 'bg-[#0a0a0a] text-white/60 hover:text-white border border-[#222222] hover:bg-[#141414]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-xs text-white/40 bg-[#0a0a0a] border border-[#222222] rounded-2xl p-8 font-mono">
          No products found matching your current filter. Try selecting a different category or clearing search terms.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-[#0a0a0a] border border-[#222222] hover:border-white/40 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden bg-black">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3 flex space-x-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-md border border-white/20">
                      {product.company}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/80 text-white/60 backdrop-blur-md border border-white/10">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Specifications Preview */}
                  <div className="pt-3 grid grid-cols-2 gap-2 border-t border-[#1f1f1f]">
                    {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
                      <div key={k} className="text-[10px]">
                        <span className="text-white/40 block font-mono uppercase">{k}</span>
                        <span className="font-bold text-white truncate block font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Availability */}
              <div className="px-5 pb-5 pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-xs">
                <span className="text-[10px] text-white/60 font-mono flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span className="truncate max-w-[130px]">{product.availability.split('/')[0]}</span>
                </span>
                
                <span className="text-xs font-bold text-white flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informational Marketplace Disclaimer */}
      <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] flex items-start space-x-3 text-[10px] text-white/50 leading-relaxed font-mono">
        <Info className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
        <span>
          <strong>MARKETPLACE NOTICE:</strong> ELON MUSK SPACE operates strictly as an independent information, analysis, and community hub. This platform does not sell vehicles, tickets, or equipment directly. Orders and reservations are placed solely through official manufacturer domains.
        </span>
      </div>

    </div>
  );
};
