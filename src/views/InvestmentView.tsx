import React, { useState } from 'react';
import { 
  Rocket, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Globe, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Sliders, 
  FileText, 
  Sparkles 
} from 'lucide-react';
import { submitInvestmentInquiry } from '../firebase/services';
import { useAuth } from '../firebase/authContext';

export const InvestmentView: React.FC = () => {
  const { user, profile } = useAuth();

  // Form State
  const [investorName, setInvestorName] = useState(profile?.displayName || '');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [investorType, setInvestorType] = useState<
    'Individual Accredited' | 'Family Office' | 'Venture Fund' | 'Institutional Syndicate' | 'Sovereign Fund'
  >('Individual Accredited');
  const [targetSector, setTargetSector] = useState('Starship Fleet & Starbase Logistics');
  const [targetAmount, setTargetAmount] = useState('$100,000 - $250,000');
  const [timeline, setTimeline] = useState('Immediate / Q1 Allocation');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Starship Launch Economics Calculator State
  const [annualFlights, setAnnualFlights] = useState<number>(100);
  const [payloadPerFlight, setPayloadPerFlight] = useState<number>(150); // tons

  // Calculate Starship launch cost per kg: base dry cost amortized over flights + propellant ($500K)
  const totalAnnualPayloadKg = annualFlights * payloadPerFlight * 1000;
  const estimatedCostPerFlight = Math.max(1.8, (50 / annualFlights) + 1.2); // $ millions per flight
  const costPerKg = Math.round((estimatedCostPerFlight * 1000000) / (payloadPerFlight * 1000));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorName.trim() || !email.trim()) {
      setErrorMsg('Please specify your name and direct correspondence email.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessId(null);

    try {
      const id = await submitInvestmentInquiry({
        investorName: investorName.trim(),
        organization: organization.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        investorType,
        targetSector,
        targetAmount,
        timeline,
        notes: notes.trim() || undefined,
      });

      setSuccessId(id);
      setNotes('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Transmission failed. Please verify connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const investmentTiers = [
    {
      tier: 'TIER I',
      name: 'Orbital Logistics Syndicate',
      range: '$50,000 – $250,000',
      description: 'Co-investment vehicle focused on commercial satellite deployment, Starlink mobile ground terminals, and near-term launch rideshares.',
      specs: [
        'Accredited individual & angel syndication',
        'Direct access to quarterly launch telemetry',
        'Secondary market valuation liquidity options',
        'Priority access to Starlink Direct-to-Cell allocations'
      ]
    },
    {
      tier: 'TIER II',
      name: 'Deep Space & Lunar Infrastructure Fund',
      range: '$250,000 – $1,000,000',
      description: 'Capital deployment for Starship tanker orbital refueling, NASA Artemis Moon lander supply chains, and cryogenic propellant depots.',
      specs: [
        'Family offices & qualified institutional syndicates',
        'Dedicated aerospace engineer briefings',
        'Hardware prototype facility inspection access',
        'Long-term multi-vehicle orbital equity positioning'
      ]
    },
    {
      tier: 'TIER III',
      name: 'Multiplanetary Mars Foundation Allocation',
      range: '$1,000,000+',
      description: 'Sovereign and enterprise capital for autonomous Martian propellant synthesis (ISRU), planetary habitats, and multiplanetary transport fleets.',
      specs: [
        'Institutional, sovereign & strategic venture partners',
        'Bespoke co-investment vehicles & private advisory',
        'Direct connection to senior aerospace syndicate directors',
        'Permanent sovereign planetary development tier'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-16 bg-black text-white">
      
      {/* 1. Header Section */}
      <div className="border-b border-zinc-800 pb-8 space-y-3">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-zinc-400 border border-zinc-800 px-2.5 py-1 rounded bg-zinc-900">
          <Rocket className="w-3.5 h-3.5 text-white" />
          <span>SPACE CAPITAL ALLOCATION & MULTIPLANETARY SYNDICATE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          INVESTMENT FOR THE SPACE
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Accredited and institutional capital deployment into deep space transportation, reusable orbital logistics, Starlink global satellite infrastructure, and multiplanetary settlement.
        </p>
      </div>

      {/* 2. Key Space Financial Benchmarks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">SpaceX Enterprise Benchmark</span>
          <div className="text-2xl font-black text-white tracking-tight font-mono">$350B+</div>
          <span className="text-[10px] text-zinc-500 block font-mono">Secondary Tender Valuation</span>
        </div>

        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Starship Cost Inflection</span>
          <div className="text-2xl font-black text-white tracking-tight font-mono">&lt; $100 / kg</div>
          <span className="text-[10px] text-zinc-500 block font-mono">Vs $20,000/kg Legacy Expendables</span>
        </div>

        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Starlink Run Rate</span>
          <div className="text-2xl font-black text-white tracking-tight font-mono">$6.6B+ / yr</div>
          <span className="text-[10px] text-zinc-500 block font-mono">Free Cash Flow Inflection</span>
        </div>

        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Annual Launch Cadence</span>
          <div className="text-2xl font-black text-white tracking-tight font-mono">140+ Flights</div>
          <span className="text-[10px] text-zinc-500 block font-mono">90%+ of Global Orbital Mass</span>
        </div>
      </div>

      {/* 3. Space Investment Pillars */}
      <div className="space-y-6">
        <div className="border-b border-zinc-800 pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">PRIMARY CAPITAL VECTORS</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            INFRASTRUCTURE ALLOCATION VECTORS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">VECTOR 01</span>
              <h3 className="text-sm font-bold text-white uppercase">Starship Rapid Fleet Scale & Mechazilla Pads</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Funding full-rate series production of Starship upper stages and Super Heavy boosters at Starbase and Cape Canaveral. Mechazilla catch towers eliminate landing gear mass, enabling hourly re-flight cadence and massive dry-mass amortization.
            </p>
            <div className="pt-2 text-[10px] font-mono text-zinc-400 border-t border-zinc-800 flex justify-between">
              <span>Target Payload to Orbit:</span>
              <span className="text-white font-bold">150 - 250 Metric Tons</span>
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">VECTOR 02</span>
              <h3 className="text-sm font-bold text-white uppercase">Starlink Direct-to-Cell & Space Laser Mesh</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Expanding orbital satellite constellation to 12,000+ laser cross-linked spacecraft in Low Earth Orbit. Delivering cellular voice, data, and emergency communications directly to unmodified 4G/5G mobile smartphones globally.
            </p>
            <div className="pt-2 text-[10px] font-mono text-zinc-400 border-t border-zinc-800 flex justify-between">
              <span>Constellation Capacity:</span>
              <span className="text-white font-bold">4M+ Active Subscribers in 100+ Nations</span>
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">VECTOR 03</span>
              <h3 className="text-sm font-bold text-white uppercase">Lunar Artemis & Martian Sabatier Propellant Bases</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Developing on-orbit cryogenic liquid methane and liquid oxygen propellant transfer technologies, enabling human deep space exploration to the Moon under NASA Artemis III/IV and self-sustaining permanent bases on Mars.
            </p>
            <div className="pt-2 text-[10px] font-mono text-zinc-400 border-t border-zinc-800 flex justify-between">
              <span>Deep Space Architecture:</span>
              <span className="text-white font-bold">In-Situ Resource Utilization (ISRU)</span>
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">VECTOR 04</span>
              <h3 className="text-sm font-bold text-white uppercase">Orbital AI Supercomputing & In-Space Manufacturing</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Deploying zero-gravity semiconductor fabrication, advanced pharmaceutical crystal growth, and orbital AI compute nodes powered by limitless solar irradiance outside Earth's atmosphere.
            </p>
            <div className="pt-2 text-[10px] font-mono text-zinc-400 border-t border-zinc-800 flex justify-between">
              <span>Microgravity Advantage:</span>
              <span className="text-white font-bold">Purity & 24/7 Continuous Solar Energy</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Starship Orbital Economics Calculator */}
      <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">DYNAMIC LAUNCH VALUATION MODEL</span>
            <h3 className="text-lg font-bold text-white">STARSHIP RAPID REUSABILITY ECONOMICS CALCULATOR</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 font-mono block">Estimated Cost per Kilogram:</span>
            <span className="text-2xl font-black text-white font-mono">${costPerKg} / kg</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Annual Launch Cadence:</span>
                <span className="font-bold text-white font-mono">{annualFlights} flights / year</span>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                step={10}
                value={annualFlights}
                onChange={(e) => setAnnualFlights(Number(e.target.value))}
                className="w-full accent-white bg-zinc-800 h-2 rounded cursor-pointer"
              />
              <div className="flex items-center space-x-1.5 mt-2">
                {[
                  { label: 'Trial (30/yr)', val: 30 },
                  { label: 'Fleet Cadence (100/yr)', val: 100 },
                  { label: 'Megascale (300/yr)', val: 300 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setAnnualFlights(preset.val)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-mono border transition-colors cursor-pointer ${
                      annualFlights === preset.val
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-zinc-500 block mt-1">From early orbital trials to daily fleet cadence</span>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Usable Payload Mass per Starship:</span>
                <span className="font-bold text-white font-mono">{payloadPerFlight} tons ({payloadPerFlight * 1000} kg)</span>
              </div>
              <input
                type="range"
                min={100}
                max={250}
                step={25}
                value={payloadPerFlight}
                onChange={(e) => setPayloadPerFlight(Number(e.target.value))}
                className="w-full accent-white bg-zinc-800 h-2 rounded cursor-pointer"
              />
              <div className="flex items-center space-x-1.5 mt-2">
                {[
                  { label: 'Starship V2 (150t)', val: 150 },
                  { label: 'Starship V3 (200t)', val: 200 },
                  { label: 'Heavy Cargo (250t)', val: 250 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setPayloadPerFlight(preset.val)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-mono border transition-colors cursor-pointer ${
                      payloadPerFlight === preset.val
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-zinc-500 block mt-1">Full reusable cargo configuration</span>
            </div>
          </div>

          <div className="p-5 bg-black border border-zinc-800 rounded-2xl space-y-3 font-mono text-[11px] shadow-inner">
            <div className="flex justify-between text-zinc-400">
              <span>Total Annual Payload:</span>
              <span className="text-white font-bold">{(totalAnnualPayloadKg / 1000).toLocaleString()} metric tons</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Estimated Cost per Flight:</span>
              <span className="text-white font-bold">${estimatedCostPerFlight.toFixed(2)} Million</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Starship Fleet $/kg:</span>
              <span className="text-white font-bold">${costPerKg} / kg</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 leading-relaxed font-sans">
              Compare with traditional single-use rockets ($15,000 - $25,000/kg) and Falcon 9 ($2,600/kg). Rapid reusability brings orbital delivery into true commercial commodity territory.
            </div>
          </div>
        </div>
      </div>

      {/* 5. Three Investment Tiers */}
      <div className="space-y-6">
        <div className="border-b border-zinc-800 pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">CAPITAL STRUCTURE</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ACCREDITED ALLOCATION TIERS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investmentTiers.map((t, idx) => (
            <div
              key={idx}
              className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {t.tier}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{t.range}</span>
                </div>
                <h3 className="text-sm font-bold text-white uppercase">{t.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{t.description}</p>
                
                <ul className="space-y-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-300">
                  {t.specs.map((s, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1.5"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#inquiry-form"
                className="w-full py-2.5 bg-white text-black text-center font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors block cursor-pointer"
              >
                REQUEST ALLOCATION
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Capital Allocation Inquiry Form (Direct Firestore Integration) */}
      <div id="inquiry-form" className="p-6 sm:p-10 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-8 shadow-2xl">
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">CONFIDENTIAL TRANSMISSION</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            SPACE CAPITAL ALLOCATION INQUIRY
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Submit your confidential capital interest for space infrastructure, Starship orbital logistics, or Starlink expansion. Inquiries are stored securely in Firestore and reviewed by the syndicate administrator.
          </p>
        </div>

        {successId ? (
          <div className="p-6 bg-black border border-zinc-800 rounded-2xl space-y-3 text-center max-w-lg mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white uppercase">Inquiry Successfully Transmitted</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your space allocation inquiry reference <code className="text-white font-mono font-bold">{successId}</code> has been logged in Firestore. The administrator will contact your designated correspondence channel.
            </p>
            <button
              onClick={() => setSuccessId(null)}
              className="mt-2 px-5 py-2 bg-white text-black text-xs font-bold uppercase rounded-xl hover:bg-zinc-200 cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 font-bold">
                  Investor / Principal Name *
                </label>
                <input
                  type="text"
                  required
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 font-bold">
                  Entity / Fund / Family Office
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Apex Orbital Capital"
                  className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 font-bold">
                  Direct Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@domain.com"
                  className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 font-bold">
                  Telephone / Secure Signal
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 font-bold">
                  Investor Classification *
                </label>
                <select
                  value={investorType}
                  onChange={(e: any) => setInvestorType(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Individual Accredited">Individual Accredited Investor</option>
                  <option value="Family Office">Family Office</option>
                  <option value="Venture Fund">Venture Fund / Syndicate</option>
                  <option value="Institutional Syndicate">Institutional Syndicate</option>
                  <option value="Sovereign Fund">Sovereign / Government Fund</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 font-bold">
                  Target Allocation Range *
                </label>
                <select
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="$50,000 - $100,000">$50,000 – $100,000 (Tier I Entry)</option>
                  <option value="$100,000 - $250,000">$100,000 – $250,000 (Tier I Standard)</option>
                  <option value="$250,000 - $500,000">$250,000 – $500,000 (Tier II)</option>
                  <option value="$500,000 - $1,000,000">$500,000 – $1,000,000 (Tier II Full)</option>
                  <option value="$1,000,000 - $5,000,000">$1,000,000 – $5,000,000 (Tier III Institutional)</option>
                  <option value="$5,000,000+">$5,000,000+ (Sovereign / Strategic)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 font-bold">
                  Primary Sector Focus *
                </label>
                <select
                  value={targetSector}
                  onChange={(e) => setTargetSector(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Starship Fleet & Starbase Logistics">Starship Fleet & Starbase Logistics</option>
                  <option value="Starlink Direct-to-Cell Constellation">Starlink Direct-to-Cell Constellation</option>
                  <option value="Lunar Artemis Propellant Depots">Lunar Artemis Propellant Depots</option>
                  <option value="Mars Terraforming & ISRU Infrastructure">Mars Terraforming & ISRU Infrastructure</option>
                  <option value="Orbital AI Compute Clusters">Orbital AI Compute Clusters</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 font-bold">
                  Target Deployment Horizon
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Immediate / Q1 Allocation">Immediate / Active Syndicate</option>
                  <option value="3 - 6 Months Horizon">3 – 6 Months Horizon</option>
                  <option value="Strategic 12-Month Deployment">Strategic 12-Month Deployment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 font-bold">
                Strategic Notes & Co-Investment Criteria (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify any strategic co-investment terms, previous aerospace investments, or value-add capabilities..."
                className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none resize-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center space-x-2 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-black" />
                  <span>TRANSMITTING ALLOCATION INQUIRY...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-black" />
                  <span>TRANSMIT ALLOCATION INQUIRY TO FIRESTORE</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* 7. Regulatory Disclosures */}
        <div className="pt-6 border-t border-zinc-800 text-[10px] text-zinc-400 leading-relaxed space-y-1 font-mono">
          <p>
            <strong className="text-white">REGULATORY NOTICE & QUALIFICATION DISCLAIMER:</strong> ELON MUSK SPACE operates as an independent technological analysis and community clearinghouse. This interface does not constitute an offer to buy or sell securities. Private aerospace and infrastructure allocations are subject to accredited investor verification under Regulation D Rule 506(c) of the U.S. Securities Act. Past performance and valuation multiples do not guarantee future orbital or financial results.
          </p>
        </div>
      </div>

    </div>
  );
};
