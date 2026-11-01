import React from 'react';
import { X, ExternalLink, ShieldCheck, Check, Sparkles, Info } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0a0a0a] border border-[#222222] rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white/60 hover:text-white transition-all border border-[#262626]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover grayscale opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                  {product.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white/70 border border-white/20">
                  {product.company}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                {product.name}
              </h2>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Description */}
            <div>
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2">
                OVERVIEW
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications Grid */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white mb-3 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>TECHNICAL SPECIFICATIONS</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-[#111111] border border-[#222222]"
                    >
                      <div className="text-[9px] uppercase font-mono text-white/40 tracking-wider mb-1">
                        {key}
                      </div>
                      <div className="text-xs font-bold text-white font-mono">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features List */}
            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-3">
                  KEY INNOVATIONS & ENGINEERING
                </h4>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-white/70">
                      <div className="w-3.5 h-3.5 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Availability & Official Link Note */}
            <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-white mb-1 font-mono">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Availability Status:</span>
                  <span className="text-white/80 font-normal">{product.availability}</span>
                </div>
                <p className="text-[10px] text-white/40 font-mono">
                  Official specifications and manufacturer inquiry channels.
                </p>
              </div>

              <a
                href={product.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center space-x-2 shrink-0 transition-all shadow-md"
              >
                <span>OFFICIAL SPECIFICATION</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Platform Notice */}
            <div className="flex items-start space-x-2 text-[10px] text-white/40 pt-2 border-t border-[#1f1f1f] font-mono">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/50" />
              <span>
                ELON MUSK SPACE is an independent technology platform. Purchases and reservations occur directly with the respective official manufacturers.
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
