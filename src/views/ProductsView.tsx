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
import { SafeImage } from '../components/SafeImage';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-10 bg-black text-white">
      
      {/* Marketplace Header */}
      <div className="border-b border-zinc-800 pb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>INDEPENDENT TECHNOLOGY MARKETPLACE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          HARDWARE & VEHICLES
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Explore specifications, engineering breakthroughs, and verified availability of electric vehicles, energy storage, orbital spacecraft, satellite systems, and humanoid robotics.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Model S, Starship, Grok, Optimus..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-extrabold shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800'
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
        <div className="py-20 text-center text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 font-mono">
          No products found matching your current filter. Try selecting a different category or clearing search terms.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              <div>
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden bg-black">
                  <SafeImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    fallbackText={product.name.slice(0, 4)}
                  />
                  <div className="absolute top-3 left-3 flex space-x-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-md border border-zinc-800">
                      {product.company}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-zinc-900/90 text-zinc-300 backdrop-blur-md border border-zinc-700">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-200 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Specifications Preview */}
                  <div className="pt-3 grid grid-cols-2 gap-2 border-t border-zinc-800">
                    {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
                      <div key={k} className="text-[10px]">
                        <span className="text-zinc-500 block font-mono uppercase">{k}</span>
                        <span className="font-bold text-white truncate block font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Availability */}
              <div className="px-5 pb-5 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs bg-zinc-950/60">
                <span className="text-[10px] text-zinc-400 font-mono flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span className="truncate max-w-[130px]">{product.availability.split('/')[0]}</span>
                </span>
                
                <span className="text-xs font-bold text-white flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Specs</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informational Marketplace Disclaimer */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-3 text-[10px] text-zinc-400 leading-relaxed font-mono">
        <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
        <span>
          <strong className="text-white">MARKETPLACE NOTICE:</strong> ELON MUSK SPACE operates strictly as an independent information, analysis, and community hub. This platform does not sell vehicles, tickets, or equipment directly. Orders and reservations are placed solely through official manufacturer domains.
        </span>
      </div>

    </div>
  );
};
