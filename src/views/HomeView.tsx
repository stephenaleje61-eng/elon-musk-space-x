import React from 'react';
import { 
  Rocket, 
  Car, 
  Cpu, 
  Wifi, 
  Bot, 
  ChevronRight, 
  ShieldCheck, 
  MessageSquare, 
  ExternalLink, 
  UserPlus, 
  ArrowUpRight, 
  TrendingUp, 
  Zap,
  Sparkles
} from 'lucide-react';
import { COMPANIES_DATA, PRODUCTS_DATA } from '../data/platformData';
import { ProductItem } from '../types';
import { SafeImage } from '../components/SafeImage';

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
    <div className="space-y-24 pb-20 bg-black text-white">
      
      {/* 1. CINEMATIC HERO SECTION - TESLA & SPACEX PREMIUM DARK AESTHETIC */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-20 bg-black border-b border-zinc-900">
        
        {/* Cinematic Backdrop Image with Dark Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <SafeImage
            src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1920&q=80"
            alt="SpaceX Starship Orbital Launch"
            fallbackText="STARSHIP"
            className="w-full h-full object-cover object-center opacity-30 grayscale scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-25"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Verified Community Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-200 uppercase">
              VERIFIED COMMUNITY PLATFORM
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[11px] text-zinc-400 font-mono">REAL-TIME MESSENGER</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-white leading-none uppercase">
              ELON MUSK SPACE
            </h1>

            <p className="text-xs sm:text-sm font-medium tracking-widest text-zinc-400 uppercase max-w-2xl mx-auto font-mono">
              Explore Innovation. Discover Technology. Connect with the Future.
            </p>
          </div>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            An independent technology platform, aerospace directory, and direct private 1-on-1 messaging channel with the website administrator. Messages are synchronized in real time via Cloud Firestore.
          </p>

          {/* PROMINENT PRIMARY HERO ACTION: CHAT NOW */}
          <div className="pt-4 pb-2 max-w-xl mx-auto w-full flex flex-col items-center">
            <button
              onClick={() => setCurrentView('messages')}
              className="w-full sm:w-auto min-w-[300px] sm:min-w-[340px] px-8 py-4.5 bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all font-black text-base uppercase tracking-widest rounded-2xl flex items-center justify-center space-x-3 shadow-2xl cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-ping"></span>
              </div>
              <span className="font-extrabold tracking-wider">CHAT NOW</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-white font-bold ml-1">
                1-ON-1
              </span>
            </button>

            {/* Subtitle / Transparency note */}
            <div className="pt-3 text-[11px] text-zinc-400 font-mono flex items-center justify-center space-x-2 text-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Direct 1-on-1 Private Messaging • Administrator Responds Personally • No Registration Required</span>
            </div>
          </div>

          {/* Secondary Action Buttons (SpaceX/Tesla style transparent border) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('investment')}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 backdrop-blur-md cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-white" />
              <span>INVESTMENT FOR SPACE</span>
            </button>

            <button
              onClick={() => setCurrentView('products')}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 backdrop-blur-md cursor-pointer"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>EXPLORE TECHNOLOGY</span>
            </button>

            <button
              onClick={() => setCurrentView('companies')}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 backdrop-blur-md cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-white" />
              <span>COMPANIES</span>
            </button>

            <button
              onClick={onOpenFriendModal}
              className="w-full sm:w-auto px-6 py-3 bg-transparent hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-zinc-300" />
              <span>CONNECT</span>
            </button>
          </div>

          {/* Independent Notice */}
          <div className="pt-4 max-w-xl mx-auto">
            <p className="text-[11px] text-zinc-500 font-mono">
              "ELON MUSK SPACE is an independent technology information and community platform. It is not officially affiliated with Elon Musk or his companies."
            </p>
          </div>

        </div>
      </section>

      {/* 2. DEDICATED SPACE INVESTMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
                <span>VENTURE CAPITAL & ALLOCATIONS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                INVESTMENT FOR THE SPACE
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                Deploy capital alongside accredited syndicates into the multiplanetary infrastructure powering orbital reusability, lunar logistics, and the commercial satellite internet mesh.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('investment')}
              className="px-6 py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-colors shrink-0 flex items-center space-x-2 shadow-sm cursor-pointer"
            >
              <span>ACCESS INVESTMENT PORTAL</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-black border border-zinc-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">SECTOR 01</span>
              <h4 className="font-bold text-white uppercase text-sm">Starship Orbital Mass Scale</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Series expansion of Starship heavy lift stages and Mechazilla launch towers, reducing launch costs from thousands of dollars to under $100 per kilogram.
              </p>
            </div>

            <div className="p-5 bg-black border border-zinc-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">SECTOR 02</span>
              <h4 className="font-bold text-white uppercase text-sm">Starlink Direct-to-Cell Expansion</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Multi-billion dollar annual revenue generation from orbital satellite broadband and unmodified cellular handset telecom partnerships worldwide.
              </p>
            </div>

            <div className="p-5 bg-black border border-zinc-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">SECTOR 03</span>
              <h4 className="font-bold text-white uppercase text-sm">Artemis Moon & Mars ISRU Depots</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                In-situ resource utilization, orbital propellant depots, and autonomous lunar transport logistics for government and sovereign scientific programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ENTERPRISES DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-zinc-800 pb-4">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
              INNOVATION ECOSYSTEM
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              FEATURED ENTERPRISES
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('companies')}
            className="mt-2 sm:mt-0 text-xs font-bold text-zinc-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
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
              className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 rounded-xl overflow-hidden mb-4 bg-black border border-zinc-800">
                  <SafeImage
                    src={company.bannerImage}
                    alt={company.name}
                    fallbackText={company.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {company.isHistorical ? (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-zinc-800/90 text-zinc-300 border border-zinc-700">
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
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">
                  {company.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>{company.stats[0]?.label}:</span>
                <span className="font-bold text-white">{company.stats[0]?.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS MARKETPLACE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-zinc-800 pb-4">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
              TECHNOLOGY CATALOG
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              FEATURED INNOVATIONS
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('products')}
            className="mt-2 sm:mt-0 text-xs font-bold text-zinc-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
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
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-md"
            >
              <div className="relative h-52 overflow-hidden bg-black">
                <SafeImage
                  src={product.imageUrl}
                  alt={product.name}
                  fallbackText={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-3 left-3 flex space-x-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-black/80 text-white border border-zinc-700 backdrop-blur-md">
                    {product.company}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-zinc-800/80 text-zinc-300 border border-zinc-700 backdrop-blur-md">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Specs Preview */}
                <div className="pt-2 grid grid-cols-2 gap-2 border-t border-zinc-800">
                  {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
                    <div key={k} className="text-[10px]">
                      <span className="text-zinc-500 block font-mono uppercase">{k}</span>
                      <span className="font-bold text-zinc-200 truncate block font-mono">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
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
        <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center space-x-3 mb-2">
            <Car className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">
              ELECTRIC VEHICLE COLLECTION
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl mb-6">
            Next-generation powertrains, 800V architectures, cold-rolled stainless steel exoskeleton design, and pure vision neural net autonomy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {evProducts.slice(0, 3).map((car) => (
              <div
                key={car.id}
                onClick={() => onSelectProduct(car)}
                className="bg-black rounded-2xl border border-zinc-800 hover:border-zinc-700 p-4 cursor-pointer group transition-all shadow-md"
              >
                <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-zinc-950">
                  <SafeImage
                    src={car.imageUrl}
                    alt={car.name}
                    fallbackText={car.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h4 className="text-xs font-bold text-white">
                  {car.name}
                </h4>
                <div className="mt-1 text-[11px] text-zinc-400 font-mono">
                  0-60: {car.specs['0-60 mph']}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SPACE EXPLORATION & MULTIPLANETARY FLEET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              <Rocket className="w-3.5 h-3.5 text-white" />
              <span>SPACEX MULTIPLANETARY FLEET</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">
              MAKING LIFE MULTIPLANETARY
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              From Falcon 9 re-flights to Starship’s mechanical chopstick catches at Starbase, rapid reusability is dramatically lowering the cost of space transportation to enable permanent civilization on Mars.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-black rounded-2xl border border-zinc-800">
                <div className="text-xl font-black text-white font-mono">380+</div>
                <div className="text-[10px] text-zinc-500 uppercase font-mono">Successful Missions</div>
              </div>
              <div className="p-4 bg-black rounded-2xl border border-zinc-800">
                <div className="text-xl font-black text-white font-mono">16.7M lbs</div>
                <div className="text-[10px] text-zinc-500 uppercase font-mono">Starship Thrust</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentView('investment')}
                className="px-6 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-zinc-200 cursor-pointer shadow-md"
              >
                INVEST IN SPACE
              </button>
              <button
                onClick={() => onSelectCompany('spacex')}
                className="px-6 py-3 bg-transparent border border-zinc-700 text-white hover:bg-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                SPACEX FLEET
              </button>
            </div>
          </div>

          <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-lg">
            <SafeImage
              src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80"
              alt="Starship Rocket Launch"
              fallbackText="STARSHIP"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. ARTIFICIAL INTELLIGENCE & ROBOTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Cpu className="w-5 h-5 text-white" />
              <h3 className="text-base font-bold text-white uppercase">xAI & FRONTIER REASONING</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Trained on the Colossus 100K+ liquid-cooled GPU supercluster in Memphis, Grok models pursue mathematical truth and real-time world comprehension.
            </p>
            <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-500">
                <span>Cluster Scale:</span>
                <span className="font-bold text-white">100,000+ Liquid-Cooled H100/H200s</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Reasoning Engine:</span>
                <span className="font-bold text-white">Grok Frontier MoE</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Bot className="w-5 h-5 text-white" />
              <h3 className="text-base font-bold text-white uppercase">TESLA OPTIMUS & HUMANOID ROBOTICS</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              General-purpose bi-pedal autonomous robotics trained directly on end-to-end vision neural networks, performing repetitive tasks inside Gigafactories.
            </p>
            <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-500">
                <span>Degrees of Freedom:</span>
                <span className="font-bold text-white">11-DOF Sensory Tactile Hands</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Architecture:</span>
                <span className="font-bold text-white">End-to-End Vision Foundation</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. SATELLITE BROADBAND & GLOBAL MESH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              <Wifi className="w-3.5 h-3.5 text-white" />
              <span>ORBITAL CONSTELLATION INFRASTRUCTURE</span>
            </div>
            <h3 className="text-xl font-bold text-white uppercase">
              HIGH-SPEED SATELLITE BROADBAND ANYWHERE ON EARTH
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Starlink delivers low-latency connectivity across remote regions, aircraft, maritime vessels, and mobile users via space laser optical crosslinks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('investment')}
              className="px-6 py-3 bg-white text-black font-bold text-xs uppercase rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              INVEST IN STARLINK
            </button>
            <a
              href="https://www.starlink.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-transparent border border-zinc-700 text-white hover:bg-zinc-800 text-xs font-bold uppercase rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <span>STARLINK.COM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 9. COMMUNITY & CHAT NOW PROMO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white text-black mx-auto flex items-center justify-center shadow-lg">
            <MessageSquare className="w-7 h-7 text-black" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>DIRECT PLATFORM CHANNEL • REAL-TIME FIRESTORE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              CHAT WITH ELON MUSK SPACE
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connect 1-on-1 directly with the website owner and administrator. Send technical inquiries, discuss space investment syndicates, or explore rocket propulsion breakthroughs. Messages are stored permanently in Firestore and are answered personally.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('messages')}
              className="px-8 py-3.5 bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-black" />
              <span>CHAT NOW</span>
            </button>

            <button
              onClick={onOpenFriendModal}
              className="px-7 py-3.5 bg-transparent hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>REQUEST VERIFIED BADGE</span>
            </button>
          </div>

          <div className="pt-2 text-[10px] text-zinc-500 font-mono">
            Personal platform chat managed directly by website administrator (elonmusk241@gmail.com). Not an official Elon Musk account. No bots or automated responders.
          </div>
        </div>
      </section>

      {/* Floating CHAT NOW Quick Trigger */}
      <aside aria-label="Quick Actions" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setCurrentView('messages')}
          className="group flex items-center space-x-3 px-6 py-3.5 bg-white text-black hover:bg-zinc-200 text-xs font-black tracking-widest uppercase rounded-full shadow-2xl hover:scale-105 transition-all cursor-pointer border border-white"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"></span>
          </div>
          <span className="font-extrabold">CHAT NOW</span>
        </button>
      </aside>

    </div>
  );
};
