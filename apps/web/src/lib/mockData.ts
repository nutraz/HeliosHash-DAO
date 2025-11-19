// Shared mock data for dashboard and gallery
export const nftCollection = [
  { id: '1', name: "Solar Bitcoin Mining Hub", image: "https://api.dicebear.com/7.x/shapes/svg?seed=bitcoin&backgroundColor=10b981", projectId: '1', community: "Green Energy Collective" },
  { id: '2', name: "EV Charging Network", image: "https://api.dicebear.com/7.x/shapes/svg?seed=ev&backgroundColor=eab308", projectId: '2', community: "Sustainable Transport DAO" },
  { id: '3', name: "Data Center Green Power", image: "https://api.dicebear.com/7.x/shapes/svg?seed=data&backgroundColor=f97316", projectId: '3', community: "Tech Infrastructure Hub" },
  { id: '4', name: "Temple Community Solar", image: "https://api.dicebear.com/7.x/shapes/svg?seed=temple&backgroundColor=3b82f6", projectId: '4', community: "Community Power Network" },
  { id: '5', name: "School Solar Initiative", image: "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=6366f1", projectId: '5', community: "Education Energy Alliance" },
  { id: '6', name: "Urban Rooftop Solar", image: "https://api.dicebear.com/7.x/shapes/svg?seed=rooftop&backgroundColor=8b5cf6", community: "Urban Solar Collective" },
  { id: '7', name: "Agricultural Solar Pumps", image: "https://api.dicebear.com/7.x/shapes/svg?seed=farm&backgroundColor=ec4899", community: "Agri-Energy Network" },
  { id: '8', name: "Coastal Wind Project", image: "https://api.dicebear.com/7.x/shapes/svg?seed=wind&backgroundColor=14b8a6", community: "Renewable Coast Alliance" }
];

export const projects = [
  { id: 1, name: "Solar Bitcoin Mining Hub", stage: "functioning", color: "green", size: "5 MW", energySupply: "Bitcoin Mining Operation", surplus: "School & Hospital", completion: 100, funding: "₹2.5 Cr", opportunities: [ { type: "Security Guard", positions: 2 }, { type: "Electrical Inspector", positions: 1 }, { type: "Maintenance Tech", positions: 3 } ] },
  { id: 2, name: "EV Charging Network", stage: "tech-setup", color: "yellow", size: "2 MW", energySupply: "EV Charging Stations", surplus: "Community Center", completion: 65, funding: "₹1.2 Cr", opportunities: [ { type: "Civil Engineer", positions: 1 }, { type: "Funding Required", amount: "₹30L" }, { type: "Supplier - Charging Units", positions: 1 } ] },
  { id: 3, name: "Data Center Green Power", stage: "solar-setup", color: "orange", size: "10 MW", energySupply: "Data Center", surplus: "Hospital", completion: 45, funding: "₹5 Cr", opportunities: [ { type: "Solar Panel Supplier", positions: 1 }, { type: "Civil Contractor", positions: 1 }, { type: "Project Auditor", positions: 1 } ] },
  { id: 4, name: "Temple Community Solar", stage: "civil-works", color: "blue", size: "500 KW", energySupply: "Temple & Community", surplus: "Local Residents", completion: 30, funding: "₹60L", opportunities: [ { type: "Electrical Contractor", positions: 2 }, { type: "NFT Art Creator", positions: 1 }, { type: "Tech Support", positions: 1 } ] },
  { id: 5, name: "School Solar Initiative", stage: "applied", color: "grey", size: "300 KW", energySupply: "School Campus", surplus: "Students & Staff", completion: 5, funding: "₹40L", opportunities: [ { type: "Funding Required", amount: "₹40L" }, { type: "Land Survey", positions: 1 }, { type: "Community Manager", positions: 1 } ] }
];

// no default export to satisfy lint rules; use named imports
