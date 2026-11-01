import React from 'react';
import { Rocket, Shield, ExternalLink } from 'lucide-react';
import { COMPANIES_DATA } from '../data/platformData';

interface FooterProps {
  setCurrentView: (view: string) => void;
  onSelectCompany: (companyId: string) => void;
  onOpenFriendModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentView,
  onSelectCompany,
}) => {
  return (
    <footer className="bg-black border-t border-[#1f1f1f] text-white/50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-[#1f1f1f]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] border border-[#222222] flex items-center justify-center text-white">
                <Rocket className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black tracking-widest text-white text-base">ELON MUSK</span>
                <span className="font-extrabold tracking-widest text-white/80 text-base">SPACE</span>
              </div>
            </div>

            <p className="text-[11px] text-white/60 leading-relaxed max-w-sm">
              Explore Innovation. Discover Technology. Connect with the Future. An independent technology marketplace, aerospace directory, space capital syndicate, and verified private community platform.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/20 text-white text-[10px] font-mono">
              <Shield className="w-3 h-3 text-white" />
              <span>VERIFIED INDEPENDENT COMMUNITY</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase mb-4">
              PLATFORM
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-white transition-colors text-white/60"
                >
                  Homepage
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('investment')}
                  className="hover:text-white transition-colors text-white font-semibold flex items-center space-x-1"
                >
                  <span>Investment for the Space</span>
                  <span className="text-[8px] bg-white text-black font-extrabold px-1 rounded">NEW</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('companies')}
                  className="hover:text-white transition-colors text-white/60"
                >
                  Company Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('products')}
                  className="hover:text-white transition-colors text-white/60"
                >
                  Technology Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('technology')}
                  className="hover:text-white transition-colors text-white/60"
                >
                  Engineering Deep-Dives
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('community')}
                  className="hover:text-white transition-colors text-white/60"
                >
                  Community & Friend Network
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('messages')}
                  className="hover:text-white transition-colors text-white/60"
                >
                  Private 1:1 Messaging
                </button>
              </li>
            </ul>
          </div>

          {/* Company Profiles */}
          <div>
            <h4 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase mb-4">
              COMPANIES
            </h4>
            <ul className="space-y-2 text-[11px]">
              {COMPANIES_DATA.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelectCompany(c.id)}
                    className="hover:text-white text-white/60 transition-colors"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onSelectCompany('solarcity')}
                  className="hover:text-white text-white/40 transition-colors text-[10px] font-mono"
                >
                  SolarCity (Historical)
                </button>
              </li>
            </ul>
          </div>

          {/* Official External Links */}
          <div>
            <h4 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase mb-4">
              OFFICIAL WEBSITES
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="https://www.spacex.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-white/60 flex items-center space-x-1 transition-colors"
                >
                  <span>SpaceX.com</span>
                  <ExternalLink className="w-2.5 h-2.5 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tesla.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-white/60 flex items-center space-x-1 transition-colors"
                >
                  <span>Tesla.com</span>
                  <ExternalLink className="w-2.5 h-2.5 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.starlink.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-white/60 flex items-center space-x-1 transition-colors"
                >
                  <span>Starlink.com</span>
                  <ExternalLink className="w-2.5 h-2.5 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://x.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-white/60 flex items-center space-x-1 transition-colors"
                >
                  <span>xAI.com</span>
                  <ExternalLink className="w-2.5 h-2.5 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-white/60 flex items-center space-x-1 transition-colors"
                >
                  <span>X.com</span>
                  <ExternalLink className="w-2.5 h-2.5 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://neuralink.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-white/60 flex items-center space-x-1 transition-colors"
                >
                  <span>Neuralink.com</span>
                  <ExternalLink className="w-2.5 h-2.5 text-white/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.boringcompany.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-white/60 flex items-center space-x-1 transition-colors"
                >
                  <span>TheBoringCompany.com</span>
                  <ExternalLink className="w-2.5 h-2.5 text-white/40" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Mandatory Legal Disclaimer & Statement */}
        <div className="pt-8 space-y-4">
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] text-[10px] leading-relaxed text-white/50 font-mono">
            <span className="font-bold text-white block mb-0.5">
              INDEPENDENT EDITORIAL AND COMMUNITY DISCLAIMER:
            </span>
            "ELON MUSK SPACE is an independent technology information and community platform. It is not officially affiliated with Elon Musk or his companies." Trademarks, logos, and product names (including Tesla, SpaceX, Starlink, xAI, X, Neuralink, and The Boring Company) are the property of their respective owners and are referenced solely for nominative and educational purposes.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 pt-2 font-mono">
            <div>
              © {new Date().getFullYear()} ELON MUSK SPACE. All rights reserved.
            </div>
            <div className="flex items-center space-x-3 mt-2 sm:mt-0 text-[10px]">
              <span>Monochrome High-Contrast</span>
              <span>•</span>
              <span>Firestore Real-Time</span>
              <span>•</span>
              <span>Multiplanetary Fleet</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
