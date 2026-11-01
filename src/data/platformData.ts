import { CompanyInfo, ProductItem, CommunityDiscussion } from '../types';

export const COMPANIES_DATA: CompanyInfo[] = [
  {
    id: 'tesla',
    name: 'Tesla',
    tagline: 'Accelerating the world’s transition to sustainable energy',
    founded: '2003',
    headquarters: 'Austin, Texas, USA',
    officialUrl: 'https://www.tesla.com/',
    logo: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=80',
    description: 'Tesla designs and manufactures electric vehicles, battery energy storage from home to grid-scale, solar panels and solar roof tiles, as well as related products and services.',
    isHistorical: false,
    keyProducts: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Tesla Semi', 'Powerwall', 'Megapack', 'Solar Roof'],
    keyTechnologies: ['Full Self-Driving (Supervised)', 'Tesla Vision End-to-End Neural Nets', '4680 Structural Battery Architecture', 'Megacasting & Die Cast Innovations'],
    stats: [
      { label: 'Annual EV Deliveries', value: '1.8M+' },
      { label: 'Supercharger Network', value: '55,000+ stalls' },
      { label: 'Energy Storage Deployed', value: '15+ GWh/yr' }
    ]
  },
  {
    id: 'spacex',
    name: 'SpaceX',
    tagline: 'Making humanity multiplanetary through reusable rocket innovation',
    founded: '2002',
    headquarters: 'Starbase, Boca Chica, Texas / Hawthorne, CA',
    officialUrl: 'https://www.spacex.com/',
    logo: 'https://images.unsplash.com/photo-1517976487502-5731f4786762?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1600&q=80',
    description: 'Space Exploration Technologies Corp. is an American aerospace manufacturer, provider of space transportation services, and satellite communications corporation. SpaceX created the world’s first orbital class reusable rocket.',
    isHistorical: false,
    keyProducts: ['Falcon 9', 'Falcon Heavy', 'Starship & Super Heavy', 'Dragon Spacecraft', 'Raptor Engines'],
    keyTechnologies: ['Full Rapid Reusability', 'Methane/LOX Staged Combustion Raptor Engine', 'Autonomous Drone Ship Landing', 'Starbase Orbital Launch Mount & Mechazilla Chopsticks'],
    stats: [
      { label: 'Successful Launches', value: '380+' },
      { label: 'First Stage Landings', value: '340+' },
      { label: 'Astronauts Flown', value: '50+' }
    ]
  },
  {
    id: 'starlink',
    name: 'Starlink',
    tagline: 'High-speed, low-latency broadband internet across the globe',
    founded: '2019 (Operational)',
    headquarters: 'Hawthorne, California, USA',
    officialUrl: 'https://www.starlink.com/',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    description: 'Engineered by SpaceX, Starlink uses the world’s largest constellation of highly advanced satellites operating in low Earth orbit to deliver broadband internet capable of supporting streaming, online gaming, video calls and more.',
    isHistorical: false,
    keyProducts: ['Starlink Standard Kit', 'Starlink Mini', 'Starlink Flat High Performance', 'Direct to Cell Satellite Links'],
    keyTechnologies: ['Optical Space Laser Crosslinks', 'Phased Array Electronic Steering Antennas', 'Krypton & Argon Ion Thrusters', 'Autonomous Orbital Collision Avoidance'],
    stats: [
      { label: 'Satellites in Orbit', value: '6,400+' },
      { label: 'Active Subscribers', value: '4M+' },
      { label: 'Countries Covered', value: '100+' }
    ]
  },
  {
    id: 'xai',
    name: 'xAI',
    tagline: 'Understand the true nature of the universe through frontier AI',
    founded: '2023',
    headquarters: 'San Francisco, California / Memphis, TN',
    officialUrl: 'https://x.ai/',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80',
    description: 'xAI is an American artificial intelligence startup founded by Elon Musk. Its mission is to build artificial general intelligence focused on scientific discovery, mathematical truth, and honest understanding.',
    isHistorical: false,
    keyProducts: ['Grok-2', 'Grok-3', 'Colossus Supercomputer Cluster', 'xAI API Platform'],
    keyTechnologies: ['100,000+ Liquid-Cooled GPU Cluster in Memphis', 'Deep Reasoning & Multimodal World Models', 'Real-Time Knowledge Synthesis', 'Safe Grounded Alignment'],
    stats: [
      { label: 'Supercomputer H100s', value: '100,000+' },
      { label: 'Cluster Setup Time', value: '122 Days' },
      { label: 'Context Window', value: '128K+ Tokens' }
    ]
  },
  {
    id: 'x',
    name: 'X (formerly Twitter)',
    tagline: 'The global digital town square for free speech and real-time news',
    founded: '2006 (Acquired 2022)',
    headquarters: 'Bastrop, Texas, USA',
    officialUrl: 'https://x.com/',
    logo: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    description: 'X is the global digital town square where people communicate in real time, consume breaking news, watch live video streams, participate in Spaces audio conversations, and monetize creative content.',
    isHistorical: false,
    keyProducts: ['X App', 'X Premium', 'Grok Assistant on X', 'Creator Revenue Sharing', 'X Payments (Upcoming)'],
    keyTechnologies: ['Open-Source Recommendation Algorithm', 'Peer-to-Peer Encrypted DMs', 'Real-time Audio Spaces', 'Live High-Resolution Video Broadcasting'],
    stats: [
      { label: 'Daily Active Users', value: '250M+' },
      { label: 'Daily Video Views', value: '8B+' },
      { label: 'Creator Payouts', value: '$45M+' }
    ]
  },
  {
    id: 'neuralink',
    name: 'Neuralink',
    tagline: 'Developing ultra-high bandwidth brain-computer interfaces to restore autonomy',
    founded: '2016',
    headquarters: 'Fremont, California / Austin, Texas',
    officialUrl: 'https://neuralink.com/',
    logo: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80',
    description: 'Neuralink creates ultra-high bandwidth brain-computer interfaces to connect human brains to computers, aiming to help people with paralysis regain motor freedom and restore vision to those without sight.',
    isHistorical: false,
    keyProducts: ['The N1 Implant', 'R1 Surgical Robot', 'Neuralink Telepathy User Interface', 'Blindsight Neural Array'],
    keyTechnologies: ['1,024 High-Density Electrodes Across 64 Threads', 'Hermetically Sealed Bio-Compatible Packaging', 'Sub-Micron Precision Robotic Micro-Needle Insertion', 'Wireless Inductive Charging & Bluetooth Telemetry'],
    stats: [
      { label: 'Electrodes per Chip', value: '1,024' },
      { label: 'Thread Thickness', value: '5 Microns' },
      { label: 'Human Trial Milestones', value: 'Active FDA IDE' }
    ]
  },
  {
    id: 'boring',
    name: 'The Boring Company',
    tagline: 'Solving traffic congestion through fast, cost-efficient 3D tunnel infrastructure',
    founded: '2016',
    headquarters: 'Bastrop, Texas, USA',
    officialUrl: 'https://www.boringcompany.com/',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=1600&q=80',
    description: 'The Boring Company constructs all-electric public transit and utility tunnels, rapidly lowering tunnelling costs through high-power continuous electric boring machines like Prufrock.',
    isHistorical: false,
    keyProducts: ['Vegas Loop', 'Prufrock Tunnel Boring Machine', 'Utility & Freight Conduits'],
    keyTechnologies: ['Continuous Mining & Lining Architecture', 'Zero-Emission All-Electric Drive', 'Surface-Launching Prufrock TBM', 'Autonomous Guided Electric Transit Vehicles'],
    stats: [
      { label: 'Vegas Loop Passengers', value: '2M+' },
      { label: 'TBM Speed Multiplier', value: '4x Standard' },
      { label: 'Approved Vegas Stations', value: '90+ Stations' }
    ]
  },
  {
    id: 'solarcity',
    name: 'SolarCity (Historical Retrospective)',
    tagline: 'Pioneered widespread distributed rooftop solar energy prior to integration into Tesla',
    founded: '2006 (Acquired 2016)',
    headquarters: 'San Mateo, California (Historical)',
    officialUrl: 'https://www.tesla.com/energy',
    logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=1600&q=80',
    description: 'SolarCity was founded in 2006 by Lyndon and Peter Rive, with Elon Musk serving as chairman and providing initial backing. It pioneered zero-down solar leases in the US. In 2016, Tesla acquired SolarCity for $2.6 billion, seamlessly merging residential solar installation and storage into what is today Tesla Energy.',
    isHistorical: true,
    historicalNote: 'HISTORICAL VENTURE: Acquired by Tesla in November 2016. Operations, intellectual property, and gigafactory manufacturing now power the Tesla Solar Roof and Powerwall division.',
    keyProducts: ['Residential Solar Leases (Historical)', 'Commercial Solar Microgrids', 'Buffalo Gigafactory 2 Foundation'],
    keyTechnologies: ['Distributed Grid Photovoltaics', 'Turnkey Financing Model', 'Integrated Inverter Interconnects'],
    stats: [
      { label: 'Acquisition Value', value: '$2.6 Billion' },
      { label: 'Year of Integration', value: '2016' },
      { label: 'Status', value: 'Merged into Tesla Energy' }
    ]
  }
];

export const PRODUCTS_DATA: ProductItem[] = [
  // Electric Vehicles
  {
    id: 'tesla-model-s-plaid',
    name: 'Tesla Model S Plaid',
    category: 'Electric Vehicles',
    company: 'Tesla',
    description: 'The pinnacle of electric luxury sedan performance. Powered by a tri-motor all-wheel drive platform with carbon-sleeved rotors producing over 1,020 peak horsepower.',
    specs: {
      '0-60 mph': '1.99 seconds',
      'Top Speed': '200 mph',
      'Range (EPA)': '359 miles',
      'Powertrain': 'Tri-Motor All-Wheel Drive',
      'Peak Power': '1,020 hp',
      'Supercharging Max': '250 kW'
    },
    features: [
      'Carbon-sleeved rotor technology',
      '17-inch cinematic touchscreen with gaming rig',
      'Yoke or round steering wheel selection',
      'Tri-zone climate control with HEPA filtration',
      'Sub-0.208 drag coefficient'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/models',
    availability: 'Verified Production / Active Global Order Delivery',
    featured: true
  },
  {
    id: 'tesla-cybertruck-cyberbeast',
    name: 'Tesla Cybertruck Cyberbeast',
    category: 'Electric Vehicles',
    company: 'Tesla',
    description: 'Engineered for any planet. Built with an ultra-hard 30X cold-rolled stainless steel exoskeleton, shatter-resistant armor glass, and full drive-by-wire 4-wheel steering.',
    specs: {
      '0-60 mph': '2.6 seconds (Beast Mode)',
      'Towing Capacity': '11,000 lbs',
      'Payload': '2,500 lbs',
      'Ground Clearance': 'Up to 17.4 inches',
      'Steering': 'Steer-by-Wire & 4-Wheel Steering',
      'Electrical Architecture': '800V High-Voltage'
    },
    features: [
      'Ultra-hard 30X stainless steel skin',
      'Shatter-resistant acoustic armor glass',
      'Powershare bi-directional vehicle-to-home power output',
      'Lockable vault bed with motorized tonneau cover',
      'Sub-meter turning radius tighter than most sedans'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/cybertruck',
    availability: 'Active Production / Available Across North America',
    featured: true
  },
  {
    id: 'tesla-model-3-performance',
    name: 'Tesla Model 3 Performance',
    category: 'Electric Vehicles',
    company: 'Tesla',
    description: 'The updated Model 3 performance edition with adaptive damping, forged staggered 20" wheels, track mode V3, and bespoke sports bucket seats.',
    specs: {
      '0-60 mph': '2.9 seconds',
      'Top Speed': '163 mph',
      'Range (EPA)': '303 miles',
      'Chassis': 'Adaptive Damping Suspension',
      'Wheel Diameter': '20-inch Forged Warp Wheels'
    },
    features: [
      'All-new Performance 4DU drive unit',
      'Track Mode V3 with customized thermal management',
      'Acoustic 360-degree glass for silent cruising',
      'Ventilated front performance bucket seats'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/model3',
    availability: 'Worldwide Delivery Available',
    featured: false
  },
  {
    id: 'tesla-model-x-plaid',
    name: 'Tesla Model X Plaid',
    category: 'Electric Vehicles',
    company: 'Tesla',
    description: 'The quickest-accelerating SUV on the planet with dual Falcon Wing doors that open in tight parking spots with millimeter ultrasonic and vision precision.',
    specs: {
      '0-60 mph': '2.5 seconds',
      'Quarter Mile': '9.9 seconds',
      'Seating': 'Up to 7 Adults',
      'Towing Capacity': '5,000 lbs',
      'Power': '1,020 peak hp'
    },
    features: [
      'Signature automated Falcon Wing doors',
      'Panoramic windshield extending overhead',
      'Tri-motor all-wheel drive with torque vectoring',
      'Active noise cancellation interior acoustic tech'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/modelx',
    availability: 'Active Global Delivery',
    featured: false
  },
  {
    id: 'tesla-model-y-long-range',
    name: 'Tesla Model Y Long Range',
    category: 'Electric Vehicles',
    company: 'Tesla',
    description: 'The best-selling vehicle worldwide in 2023 and 2024. Maximum utility, 76 cubic feet of cargo space, all-weather dual motor AWD, and 5-star NHTSA safety in every category.',
    specs: {
      '0-60 mph': '4.8 seconds',
      'Range (EPA)': '310 miles',
      'Cargo Volume': '76.2 cu ft',
      'Drivetrain': 'Dual Motor AWD',
      'Safety': '5-Star NHTSA Overall'
    },
    features: [
      'Dual motor AWD with independent digital torque distribution',
      'Fold-flat rear seats for versatile camping and hauling',
      'Standard Autopilot with Full Self-Driving capability option',
      'Over-the-air software updates expanding range and capability'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1538592116845-119a3974c958?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/modely',
    availability: 'Immediate Delivery Worldwide',
    featured: false
  },
  {
    id: 'tesla-semi',
    name: 'Tesla Semi Commercial Class 8',
    category: 'Electric Vehicles',
    company: 'Tesla',
    description: 'The future of heavy freight logistics. All-electric Class 8 truck capable of hauling 82,000 lbs gross combination weight for 500 miles on a single charge.',
    specs: {
      'Range (Full Load)': '500 miles at 82,000 lbs GCW',
      'Energy Consumption': 'Less than 2 kWh per mile',
      'Acceleration (0-60 loaded)': '20 seconds',
      'Gradeability': 'Maintains 60 mph on 5% grade',
      'Megawatt Charging': 'Up to 70% in 30 minutes'
    },
    features: [
      'Central driver seating position for supreme visibility',
      'Independent motors on two rear axles for anti-jackknife traction control',
      'Huge fuel savings compared to traditional diesel operations',
      'Fleet telematics and automated fleet maintenance monitoring'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/semi',
    availability: 'Fleet Deliveries (PepsiCo, Frito-Lay) & Scaling Production',
    featured: true
  },

  // Energy
  {
    id: 'tesla-powerwall-3',
    name: 'Tesla Powerwall 3',
    category: 'Energy',
    company: 'Tesla',
    description: 'The ultimate home energy storage system with integrated high-efficiency solar inverter, providing seamless backup during grid outages and maximizing solar self-consumption.',
    specs: {
      'Energy Capacity': '13.5 kWh',
      'On-Grid Power': '11.5 kW continuous',
      'Backup Power': '11.5 kW continuous (loads up to 185 LRA)',
      'Integrated Inverter': '6 Solar MPPT inputs',
      'Operating Temp': '-4°F to 122°F'
    },
    features: [
      'Integrated solar inverter eliminates separate inverter hardware',
      'Storm Watch automated pre-charging during severe weather alerts',
      'Time-of-Use rate optimization saving electricity costs',
      'Scaleable up to 4 units per home for 46 kW continuous power'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/powerwall',
    availability: 'Order Directly via Tesla Energy & Certified Installers',
    featured: true
  },
  {
    id: 'tesla-megapack-2xl',
    name: 'Tesla Megapack 2XL Utility Storage',
    category: 'Energy',
    company: 'Tesla',
    description: 'Massive utility-scale lithium-iron-phosphate battery energy storage designed to stabilize electrical grids, store renewable energy, and prevent peaker plant emissions.',
    specs: {
      'Energy Capacity': '3.9 MWh per unit',
      'Duration': '2-hour or 4-hour discharge configurations',
      'Interconnect': 'Bi-directional medium-voltage transformer included',
      'Cooling': 'Integrated liquid thermal management',
      'Footprint': 'Pre-assembled containerized turnkey module'
    },
    features: [
      'Autonomous Powerhub and Autobidder trading software integration',
      'Fast 10x installation compared to traditional battery projects',
      'LFP chemistry designed for extreme thermal stability and longevity',
      'Deployed at massive scale in California, Texas, Australia, and UK'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/megapack',
    availability: 'Commercial & Utility Project Contracting via Tesla Energy',
    featured: false
  },
  {
    id: 'tesla-solar-roof',
    name: 'Tesla Solar Roof Glass Tiles',
    category: 'Energy',
    company: 'Tesla',
    description: 'Beautiful architectural glass roofing tiles integrated with solar photovoltaic cells. Replaces standard shingles while producing clean solar power for decades.',
    specs: {
      'Tile Warranty': '25 Years',
      'Wind Rating': 'Class F (up to 166 mph)',
      'Hail Rating': 'Class 4 (highest industry standard)',
      'Fire Rating': 'Class A (best rating)',
      'Aesthetic': 'Seamless textured black glass tiles'
    },
    features: [
      'Triple durability of conventional roofing materials',
      'Combines solar and non-solar glass tiles for uniform roof look',
      'Pairs with Powerwall for 24/7 self-sufficient microgrid',
      'Monitored 24/7 via Tesla mobile app'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/solarroof',
    availability: 'Custom Roof Quotations Available',
    featured: false
  },

  // Space Technology
  {
    id: 'spacex-starship-superheavy',
    name: 'SpaceX Starship & Super Heavy Booster',
    category: 'Space Technology',
    company: 'SpaceX',
    description: 'The largest, most powerful rocket ever flown in human history. A fully reusable transportation system designed to carry both crew and cargo to Earth orbit, the Moon, Mars, and beyond.',
    specs: {
      'Height': '121 meters (397 feet)',
      'Diameter': '9 meters (29.5 feet)',
      'Thrust': '16.7 Million lbs (74 Meganewtons)',
      'Engines': '33 Raptor 3 engines on Super Heavy + 6 on Starship',
      'Payload to LEO': '150-250 metric tons (fully reusable)',
      'Propellant': 'Sub-cooled Liquid Methane (CH4) & Liquid Oxygen (LOX)'
    },
    features: [
      'Full reusability of both Booster and Ship stages',
      'Caught mid-air at the launch tower with mechanical chopstick arms',
      'Selected by NASA for the Artemis III and IV Lunar Human Landing System',
      'On-orbit cryogenic propellant transfer capabilities for deep space voyages'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.spacex.com/vehicles/starship/',
    availability: 'In Active Flight Testing at Starbase Boca Chica / NASA Artemis Partner',
    featured: true
  },
  {
    id: 'spacex-falcon-9-block-5',
    name: 'SpaceX Falcon 9 Block 5',
    category: 'Space Technology',
    company: 'SpaceX',
    description: 'The workhorse of commercial spaceflight. The world’s first orbital class rocket capable of launching, landing vertically on autonomous drone ships, and re-flying with rapid turnaround.',
    specs: {
      'Height': '70 meters (229.6 ft)',
      'Stages': '2-Stage Two-Engine System',
      'First Stage Engines': '9 Merlin 1D engines',
      'First Stage Reusability': 'Demonstrated 20+ flights per booster booster',
      'Payload to LEO': '22,800 kg',
      'Payload to GTO': '8,300 kg'
    },
    features: [
      'Autonomous precision landing on land (LZ-1/4) or offshore autonomous droneships',
      'Carbon-fiber grid fins for hypersonic descent steering',
      'Deployable carbon-composite landing legs with aluminum honeycomb crush cores',
      'Over 99.5% mission success rate across 350+ orbital flights'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517976487502-5731f4786762?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.spacex.com/vehicles/falcon-9/',
    availability: 'Active Commercial Launch Services & Rideshare Program',
    featured: false
  },
  {
    id: 'spacex-dragon-2-crew',
    name: 'SpaceX Crew Dragon 2 Spacecraft',
    category: 'Space Technology',
    company: 'SpaceX',
    description: 'Autonomous human-rated orbital spacecraft designed to fly up to 7 crew members to and from the International Space Station and commercial low Earth orbit destinations.',
    specs: {
      'Crew Capacity': 'Up to 7 Astronauts (NASA standard 4)',
      'Launch Vehicle': 'Falcon 9',
      'Docking': 'Autonomous NASA Docking System (NDS)',
      'Launch Escape': '8 SuperDraco abort engines integrated into hull',
      'Recovery': 'Water splashdown with parachutes in Atlantic / Gulf of Mexico'
    },
    features: [
      'Touchscreen glass cockpit avionics rated for space suits and gloves',
      'Integrated emergency abort capability from launch pad all the way to orbit',
      'Demonstrated 45+ human flights without a single casualty',
      'Custom cupola dome variant for private missions (Inspiration4, Polaris Dawn)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.spacex.com/vehicles/dragon/',
    availability: 'Operational with NASA Commercial Crew & Private Axiom Flights',
    featured: false
  },

  // Robotics & Automation
  {
    id: 'tesla-optimus-gen-2',
    name: 'Tesla Optimus Gen 2 Humanoid Robot',
    category: 'Robotics',
    company: 'Tesla',
    description: 'General-purpose, bi-pedal autonomous humanoid robot capable of performing unsafe, repetitive, or boring tasks. Powered by Tesla Vision neural nets and custom electromechanical actuators.',
    specs: {
      'Height': '5 ft 8 in (173 cm)',
      'Weight': '125 lbs (56 kg)',
      'Walking Speed': '30% faster gait with articulated toe geometry',
      'Hands & Fingers': '11-DOF tactile fingers with sensory feedback',
      'Actuators': 'Custom Tesla designed planetary & rotary actuators',
      'Brain': 'Tesla SoC Running Real-Time Vision Foundation Models'
    },
    features: [
      'Tactile finger-tip sensors capable of manipulating fragile objects like eggs',
      'End-to-end trained neural networks from visual input directly to joint torque',
      'Integrated 2.3 kWh battery pack designed for full day operation',
      'Currently testing automated battery cell sorting inside Fremont and Giga Texas'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/AI',
    availability: 'Internal Deployment at Tesla Gigafactories / Commercial Rollout Roadmap',
    featured: true
  },

  // Satellite Internet
  {
    id: 'starlink-standard-v4-kit',
    name: 'Starlink Standard Kit (Gen 3 / V4)',
    category: 'Internet',
    company: 'Starlink',
    description: 'Next-generation electronic phased array user terminal with ultra-wide 110-degree field of view, Wi-Fi 6 router, and weatherproof IP67 chassis for residential & business internet.',
    specs: {
      'Antenna': 'Electronic Phased Array',
      'Field of View': '110 Degrees',
      'Wi-Fi Standard': 'Wi-Fi 6 (802.11ax) Tri-band',
      'Download Speeds': '150 - 250+ Mbps',
      'Latency': '20 - 40 ms',
      'Environmental Rating': 'IP67 with snow-melt heating up to 1.5 in/hr'
    },
    features: [
      'No motorized moving parts for ultimate durability in extreme weather',
      'Included kickstand mount and pipe adapter compatibility',
      'Wi-Fi 6 tri-band router with dual gigabit Ethernet ports',
      'Setup in under 5 minutes with Starlink AR mobile application'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.starlink.com/residential',
    availability: 'Available to Order in 100+ Countries via Starlink.com',
    featured: true
  },
  {
    id: 'starlink-mini-portable',
    name: 'Starlink Mini Ultra-Portable Terminal',
    category: 'Internet',
    company: 'Starlink',
    description: 'Backpack-sized, all-in-one satellite terminal with integrated Wi-Fi 6 router that operates on USB-C PD power banks for hikers, nomads, and emergency responders.',
    specs: {
      'Weight': '2.5 lbs (1.1 kg)',
      'Dimensions': '11.75 x 10.2 x 1.45 inches',
      'Power Consumption': 'Average 25 - 40 Watts',
      'Power Input': '100W USB-C PD or DC Barrel Jack',
      'Download Speeds': 'Over 100 Mbps anywhere with sky view'
    },
    features: [
      'Fits inside a standard backpack or laptop sleeve',
      'Built-in Wi-Fi router eliminates separate cable bundles',
      'Powers directly from 100W portable USB-C power bank for 3-5 hours',
      'Roaming and global standby mode for off-grid expeditions'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.starlink.com/roam',
    availability: 'Active Delivery for Roam & Residential Add-on Subscribers',
    featured: false
  },

  // Artificial Intelligence
  {
    id: 'xai-grok-3-frontier',
    name: 'xAI Grok AI Reasoning Engine',
    category: 'Artificial Intelligence',
    company: 'xAI',
    description: 'Frontier AI reasoning system engineered by xAI. Built with a commitment to mathematical truth, unbiased curiosity, and real-time world understanding.',
    specs: {
      'Trained On': 'Colossus 100K+ NVIDIA H100/H200 Tensor GPU Cluster',
      'Architecture': 'Mixture-of-Experts (MoE) Frontier Multimodal Transformer',
      'Context Length': '128,000+ Tokens with native vision understanding',
      'Grounding': 'Real-time live news and social data stream indexing',
      'Benchmarks': 'Top-tier performance in HumanEval, GSM8K, and Math Olympic challenges'
    },
    features: [
      'Real-time information access via continuous live indexing',
      'Uncensored scientific curiosity mode with deep reasoning chains',
      'Integrated image generation with state-of-the-art spatial consistency',
      'Accessible on X Premium and via enterprise developer API'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://x.ai/',
    availability: 'Available on X Premium / API Console Access for Developers',
    featured: true
  },
  {
    id: 'tesla-fsd-hardware-4',
    name: 'Tesla Full Self-Driving Computer HW4',
    category: 'Artificial Intelligence',
    company: 'Tesla',
    description: 'Custom automotive-grade AI neural network supercomputer installed in all modern Tesla vehicles, processing pure visual input to drive autonomously.',
    specs: {
      'Silicon': 'Dual redundant custom Tesla FSD neural processors',
      'Processing Power': 'Up to 300-500 Teraflops per second',
      'Camera Inputs': '8 high-resolution 5-megapixel cameras at 60 fps',
      'Redundancy': 'Dual independent power and compute channels',
      'Model Type': 'End-to-End Neural Network replacing 300,000 lines of heuristic C++ code'
    },
    features: [
      'Processes raw photons to control vehicle steering, braking, and acceleration',
      'Continuous fleet learning through billions of real-world driving miles',
      'Supervised autonomous highway, city street, and parking navigation',
      'Zero reliance on expensive HD maps or fragile LiDAR sensors'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    officialUrl: 'https://www.tesla.com/autopilot',
    availability: 'Standard Equipment on all New Tesla Model S, 3, X, Y, and Cybertruck',
    featured: false
  }
];

export const COMMUNITY_DISCUSSIONS: CommunityDiscussion[] = [
  {
    id: 'disc-1',
    author: 'AeroEngineer_Mark',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mark89',
    badge: 'VERIFIED COMMUNITY',
    companyTag: 'SpaceX',
    title: 'Starship Flight 7 Mechazilla Booster Catch Analysis & Heat Shield Upgrades',
    snippet: 'The precision of the grid-fin aerodynamic guidance during the final transonic deceleration was mind-blowing. The thermal tiles on the ship’s leeward side held up with near zero damage...',
    likes: 342,
    replies: 58,
    timeAgo: '2 hours ago'
  },
  {
    id: 'disc-2',
    author: 'EV_Technica',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=EVTech',
    badge: 'VERIFIED COMMUNITY',
    companyTag: 'Tesla',
    title: 'End-to-End Neural Net V12.5 Driving Observations Across 5,000 Miles',
    snippet: 'The reduction in intervention rates is noticeable in complex construction zones. Natural human-like nudging around double-parked delivery vans feels genuinely seamless now...',
    likes: 289,
    replies: 44,
    timeAgo: '5 hours ago'
  },
  {
    id: 'disc-3',
    author: 'QuantumOrbit',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Orbit33',
    badge: 'VERIFIED COMMUNITY',
    companyTag: 'Starlink',
    title: 'Direct-to-Cell Satellite Testing with Unmodified Smartphones in T-Mobile Trial',
    snippet: 'Sending text messages directly to a rocket-launched satellite without a dish is wild. Looking into how the beam-forming Doppler shift compensation works at LEO velocities...',
    likes: 198,
    replies: 31,
    timeAgo: '8 hours ago'
  },
  {
    id: 'disc-4',
    author: 'NeuralPioneer',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeuroP',
    badge: 'VERIFIED COMMUNITY',
    companyTag: 'Neuralink',
    title: 'PRIME Study Patient Alex Playing Counter-Strike and CAD Software via Telepathy',
    snippet: 'The bandwidth jump between early Utah arrays and 1,024 flexible microthreads cannot be overstated. 10 bits/sec cursor speed with zero wired transcutaneous infection risk...',
    likes: 412,
    replies: 79,
    timeAgo: '1 day ago'
  }
];

export const TECH_DEEP_DIVES = [
  {
    title: 'Rapid Rocket Reusability & The Chopstick Catch',
    subtitle: 'SpaceX Orbital Mechanics',
    description: 'Replacing heavy landing gear with launch tower arms that catch the 250-ton Super Heavy booster mid-air. Reduces stage dry mass and enables re-flight turnaround in hours rather than months.',
    icon: 'Rocket',
    highlights: ['Zero landing gear mass penalty', 'Hypersonic hot-gas attitude thrusters', 'Sub-millimeter tower dampening hydraulics']
  },
  {
    title: 'End-to-End Vision AI & Foundation Driving Models',
    subtitle: 'Tesla Autopilot Architecture',
    description: 'A single multi-million parameter foundation model trained directly on raw video tokens. Completely eliminates hand-written C++ heuristics, motion planning graphs, and bounding boxes.',
    icon: 'Cpu',
    highlights: ['300,000 lines of heuristic C++ replaced', 'Temporal video token transformer', 'Photon-level camera dynamic range']
  },
  {
    title: 'Colossus Supercluster: 100K GPU Compute Architecture',
    subtitle: 'xAI Memphis Training Facility',
    description: 'Built in only 122 days, the world’s most concentrated AI training cluster links over 100,000 liquid-cooled GPUs on an RDMA RoCE mesh network to train frontier multimodal models.',
    icon: 'Zap',
    highlights: ['Liquid cold-plate thermal dissipation', 'Single collision-free InfiniBand/RoCE fabric', 'Real-time checkpointing without pipeline stalls']
  },
  {
    title: 'Space Laser Optical Inter-Satellite Mesh',
    subtitle: 'Starlink Orbital Constellation',
    description: 'Thousands of satellites communicating across space using laser optical transceivers at 100 Gbps per link. Creates a low-latency orbital internet backhaul faster than submarine fiber cables.',
    icon: 'Wifi',
    highlights: ['Speed of light in vacuum is 47% faster than fiber', 'Polar orbit and ocean coverage without ground gateways', 'Sub-milliradian precision optical tracking']
  },
  {
    title: '1,024-Channel Microthread Brain-Computer Interface',
    subtitle: 'Neuralink N1 Architecture',
    description: 'Flexible polyimide threads smaller than human red blood cells inserted by a robotic surgical needle with micron accuracy, reading cortical action potentials without damaging vascular capillaries.',
    icon: 'Activity',
    highlights: ['1,024 bio-compatible electrode sites', '64 flexible microthreads', 'Inductive wireless skull-embedded charging']
  },
  {
    title: 'Prufrock Continuous Electric Tunneling',
    subtitle: 'The Boring Company Transit Loop',
    description: 'Prufrock tunnels continuously while simultaneously erecting pre-cast concrete segmental rings. Designed to "porpoise" directly from surface level without expensive vertical launch pits.',
    icon: 'Layers',
    highlights: ['Continuous mining and ring-building', 'Surface launch & recovery', 'Zero diesel exhaust emissions']
  }
];
