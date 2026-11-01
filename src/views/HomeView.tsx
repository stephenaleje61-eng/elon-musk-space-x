import React from 'react';
import { 
  Rocket, 
  Car, 
  Cpu, 
  Wifi, 
  Layers, 
  Zap, 
  Bot, 
  ChevronRight, 
  ShieldCheck, 
  MessageSquare, 
  ExternalLink, 
  UserPlus, 
  ArrowUpRight, 
  Flame, 
  TrendingUp, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import { COMPANIES_DATA, PRODUCTS_DATA, COMMUNITY_DISCUSSIONS, TECH_DEEP_DIVES } from '../data/platformData';
import { ProductItem } from '../types';

interface HomeViewProps {
  setCurrentView: (view: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectCompany: (companyId: string) => void;
  onOpenFriendModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentView,
  onSelectProduct,
  onSelectCompany,
  onOpenFriendModal,
}) => {
  const evProducts = PRODUCTS_DATA.filter((p) => p.category === 'Electric Vehicles');

  return (
    <div className="space-y-24 pb-20 bg-black">
      
      {/* 1. MAIN HERO BANNER (Strictly Black & Small White) */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517976487502-5731f4786762?auto=format&fit=crop&w=2000&q=85"
            alt="Space Launch in Night Sky"
            className="w-full h-full object-cover object-center grayscale contrast-125 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/70"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Verified Community Monochrome Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/20 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-white uppercase">
              VERIFIED COMMUNITY PLATFORM
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[10px] text-white/50 font-mono">INDEPENDENT NETWORK</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none uppercase">
              WELCOME TO <br className="hidden sm:inline" />
              <span>ELON MUSK SPACE</span>
            </h1>

            <p className="text-sm sm:text-base font-light tracking-widest text-white/70 uppercase">
              Explore Innovation. Discover Technology. Connect with the Future.
            </p>
          </div>

          {/* Small White Description */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-white/60 leading-relaxed font-normal">
            Discover groundbreaking aerospace technologies, explore multiplanetary enterprises, review futuristic hardware specifications, inspect space investment syndicates, and communicate across a verified technology community.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('investment')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:bg-zinc-200 flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-4 h-4 text-black" />
              <span>INVESTMENT FOR SPACE</span>
            </button>

            <button
              onClick={() => setCurrentView('products')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#111111] hover:bg-[#1a1a1a] border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>EXPLORE TECHNOLOGY</span>
            </button>

            <button
              onClick={() => setCurrentView('companies')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#222222] text-white/80 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <Rocket className="w-4 h-4 text-white/70" />
              <span>COMPANIES</span>
            </button>

            <button
              onClick={onOpenFriendModal}
              className="w-full sm:w-auto px-7 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-white/30 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>CONNECT</span>
            </button>
          </div>

          {/* Independent Notice */}
          <div className="pt-2 max-w-xl mx-auto">
            <p className="text-[10px] text-white/40 font-mono">
              "ELON MUSK SPACE is an independent technology information and community platform. It is not officially affiliated with Elon Musk or his companies."
            </p>
          </div>

        </div>
      </section>

      {/* 2. DEDICATED SPACE INVESTMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1f1f1f] pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
                <span>VENTURE CAPITAL & ALLOCATIONS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                INVESTMENT FOR THE SPACE
              </h2>
              <p className="text-xs text-white/60 max-w-xl leading-relaxed">
                Deploy capital alongside accredited syndicates into the multiplanetary infrastructure powering orbital reusability, lunar logistics, and the commercial satellite internet mesh.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('investment')}
              className="px-6 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-colors shrink-0 flex items-center space-x-2"
            >
              <span>ACCESS INVESTMENT PORTAL</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-[#111111] border border-[#222222] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-white/40 uppercase block">SECTOR 01</span>
              <h4 className="font-bold text-white uppercase text-sm">Starship Orbital Mass Scale</h4>
              <p className="text-white/60 leading-relaxed text-[11px]">
                Series expansion of Starship heavy lift stages and Mechazilla launch towers, reducing launch costs from thousands of dollars to under $100 per kilogram.
              </p>
            </div>

            <div className="p-5 bg-[#111111] border border-[#222222] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-white/40 uppercase block">SECTOR 02</span>
              <h4 className="font-bold text-white uppercase text-sm">Starlink Direct-to-Cell Expansion</h4>
              <p className="text-white/60 leading-relaxed text-[11px]">
                Multi-billion dollar annual revenue generation from orbital satellite broadband and unmodified cellular handset telecom partnerships worldwide.
              </p>
            </div>

            <div className="p-5 bg-[#111111] border border-[#222222] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-white/40 uppercase block">SECTOR 03</span>
              <h4 className="font-bold text-white uppercase text-sm">Artemis Moon & Mars ISRU Depots</h4>
              <p className="text-white/60 leading-relaxed text-[11px]">
                In-situ resource utilization, orbital propellant depots, and autonomous lunar transport logistics for government and sovereign scientific programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COMPANIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-[#222222] pb-4">
          <div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
              INNOVATION ECOSYSTEM
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              FEATURED ENTERPRISES
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('companies')}
            className="mt-2 sm:mt-0 text-xs font-bold text-white/60 hover:text-white flex items-center space-x-1 transition-colors"
          >
            <span>VIEW ALL 8 VENTURES</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPANIES_DATA.slice(0, 8).map((company) => (
            <div
              key={company.id}
              onClick={() => onSelectCompany(company.id)}
              className="group bg-[#0a0a0a] border border-[#222222] hover:border-white/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 rounded-xl overflow-hidden mb-4 bg-black">
                  <img
                    src={company.bannerImage}
                    alt={company.name}
                    className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                  
                  {company.isHistorical ? (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/10 text-white/70 border border-white/20">
                      Historical
                    </span>
                  ) : (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white text-black font-mono">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-white transition-colors flex items-center justify-between">
                  <span>{company.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-xs text-white/60 mt-1.5 line-clamp-2">
                  {company.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-[10px] text-white/40 font-mono">
                <span>{company.stats[0]?.label}:</span>
                <span className="font-bold text-white">{company.stats[0]?.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS MARKETPLACE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-[#222222] pb-4">
          <div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
              TECHNOLOGY CATALOG
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              FEATURED INNOVATIONS
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('products')}
            className="mt-2 sm:mt-0 text-xs font-bold text-white/60 hover:text-white flex items-center space-x-1 transition-colors"
          >
            <span>ENTER FULL MARKETPLACE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS_DATA.filter((p) => p.featured).slice(0, 6).map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-[#0a0a0a] border border-[#222222] hover:border-white/40 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden bg-black">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 flex space-x-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-black/80 text-white backdrop-blur-md border border-white/20">
                    {product.company}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/80 text-white/60 backdrop-blur-md border border-white/10">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Specs Preview */}
                <div className="pt-2 grid grid-cols-2 gap-2 border-t border-[#1f1f1f]">
                  {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
                    <div key={k} className="text-[10px]">
                      <span className="text-white/40 block font-mono uppercase">{k}</span>
                      <span className="font-bold text-white truncate block">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-white/60 font-mono flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>Verified Hardware</span>
                  </span>
                  <span className="text-white text-xs font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>View Specs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ELECTRIC VEHICLE COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222]">
          <div className="flex items-center space-x-3 mb-2">
            <Car className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">
              ELECTRIC VEHICLE COLLECTION
            </h2>
          </div>
          <p className="text-xs text-white/60 max-w-2xl mb-6">
            Next-generation powertrains, 800V architectures, cold-rolled stainless steel exoskeleton design, and pure vision neural net autonomy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {evProducts.slice(0, 3).map((car) => (
              <div
                key={car.id}
                onClick={() => onSelectProduct(car)}
                className="bg-[#111111] rounded-xl border border-[#222222] hover:border-white/40 p-4 cursor-pointer group transition-all"
              >
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="w-full h-40 object-cover rounded-lg mb-3 grayscale opacity-85 group-hover:opacity-100"
                />
                <h4 className="text-xs font-bold text-white">
                  {car.name}
                </h4>
                <div className="mt-1 text-[11px] text-white/60 font-mono">
                  0-60: {car.specs['0-60 mph']}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SPACE EXPLORATION & MULTIPLANETARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#0a0a0a] border border-[#222222] rounded-3xl p-8 sm:p-12">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest">
              <Rocket className="w-3.5 h-3.5 text-white" />
              <span>SPACEX MULTIPLANETARY FLEET</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">
              MAKING LIFE MULTIPLANETARY
            </h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              From Falcon 9 re-flights to Starship’s mechanical chopstick catches at Starbase, rapid reusability is dramatically lowering the cost of space transportation to enable permanent civilization on Mars.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-[#111111] rounded-xl border border-[#222222]">
                <div className="text-xl font-black text-white font-mono">380+</div>
                <div className="text-[10px] text-white/40 uppercase font-mono">Successful Missions</div>
              </div>
              <div className="p-4 bg-[#111111] rounded-xl border border-[#222222]">
                <div className="text-xl font-black text-white font-mono">16.7M lbs</div>
                <div className="text-[10px] text-white/40 uppercase font-mono">Starship Thrust</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentView('investment')}
                className="px-6 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                INVEST IN SPACE
              </button>
              <button
                onClick={() => onSelectCompany('spacex')}
                className="px-6 py-3 bg-[#111111] border border-[#222222] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                SPACEX FLEET
              </button>
            </div>
          </div>

          <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#222222] bg-black">
            <img
              src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80"
              alt="Starship Rocket Launch"
              className="w-full h-full object-cover grayscale opacity-80"
            />
          </div>
        </div>
      </section>

      {/* 7. ARTIFICIAL INTELLIGENCE & ROBOTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Cpu className="w-5 h-5 text-white" />
              <h3 className="text-base font-bold text-white uppercase">xAI & FRONTIER REASONING</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Trained on the Colossus 100K+ liquid-cooled GPU supercluster in Memphis, Grok models pursue mathematical truth and real-time world comprehension.
            </p>
            <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-white/50">
                <span>Cluster Scale:</span>
                <span className="font-bold text-white">100,000+ Liquid-Cooled H100/H200s</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Reasoning Engine:</span>
                <span className="font-bold text-white">Grok Frontier MoE</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Bot className="w-5 h-5 text-white" />
              <h3 className="text-base font-bold text-white uppercase">TESLA OPTIMUS & HUMANOID ROBOTICS</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              General-purpose bi-pedal autonomous robotics trained directly on end-to-end vision neural networks, performing repetitive tasks inside Gigafactories.
            </p>
            <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-white/50">
                <span>Degrees of Freedom:</span>
                <span className="font-bold text-white">11-DOF Sensory Tactile Hands</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Architecture:</span>
                <span className="font-bold text-white">End-to-End Vision Foundation</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. SATELLITE BROADBAND & GLOBAL MESH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0a0a0a] border border-[#222222] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest">
              <Wifi className="w-3.5 h-3.5 text-white" />
              <span>ORBITAL CONSTELLATION INFRASTRUCTURE</span>
            </div>
            <h3 className="text-xl font-bold text-white uppercase">
              HIGH-SPEED SATELLITE BROADBAND ANYWHERE ON EARTH
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Starlink delivers low-latency connectivity across remote regions, aircraft, maritime vessels, and mobile users via space laser optical crosslinks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('investment')}
              className="px-6 py-3 bg-white text-black font-bold text-xs uppercase rounded-xl"
            >
              INVEST IN STARLINK
            </button>
            <a
              href="https://www.starlink.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#111111] border border-[#222222] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center space-x-2"
            >
              <span>STARLINK.COM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 9. COMMUNITY & PRIVATE MESSAGING NETWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a] border border-[#222222] text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-white">
            <MessageSquare className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">
              VERIFIED PRIVATE MESSAGING NETWORK
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Direct, 1-on-1 private messaging network powered by real-time Firestore synchronization and image uploads for verified community connections.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setCurrentView('messages')}
              className="px-7 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              OPEN PRIVATE MESSAGES
            </button>

            <button
              onClick={onOpenFriendModal}
              className="px-7 py-3 bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              TRANSMIT FRIEND REQUEST
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
