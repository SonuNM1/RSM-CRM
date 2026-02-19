export interface Lead {
  id: string;
  name: string;
  email: string;
  website: string;
  submittedBy: string;
  submittedDate: string;
  status: "New" | "Assigned";
}

const emailTeam = [
  "Sarah Mitchell", "James Rodriguez", "Priya Sharma", "Michael Chen",
  "Emily Watson", "David Kim", "Aisha Patel", "Robert Johnson",
  "Lisa Chang", "Carlos Mendez", "Nina Petrov", "Alex Turner",
  "Fatima Al-Hassan", "Tom Bradley", "Yuki Tanaka",
];

const bdeTeam = [
  "Amanda Foster", "Brian Hughes", "Catherine Lee", "Derek Williams",
  "Elena Garcia", "Frank Morrison", "Grace Liu", "Henry Thompson",
  "Isabella Martinez", "Jack Robinson", "Karen Nakamura", "Liam O'Brien",
  "Maya Singh", "Nathan Wright", "Olivia Bennett",
];

const companies = [
  "Acme Corp", "TechNova Inc", "Blue Horizon", "Summit Digital",
  "Pinnacle Systems", "CloudSync Ltd", "DataBridge Co", "Vertex Labs",
  "NexGen Solutions", "Ironclad Security", "BrightPath Media",
  "Quantum Analytics", "SwiftScale AI", "GreenLeaf Energy",
  "PureLogic Software", "AeroVista Inc", "CrystalNet", "EchoWave",
  "FusionTech", "HarborView", "InnoSpark", "KeyMetrics",
  "LunarEdge", "MapleSoft", "NovaCore", "OptiFlow",
  "PulsePoint", "RedShift Labs",
];

const domains = [
  "acmecorp.com", "technova.io", "bluehorizon.co", "summitdigital.com",
  "pinnaclesys.com", "cloudsync.io", "databridge.co", "vertexlabs.ai",
  "nexgensol.com", "ironcladsec.com", "brightpath.media",
  "quantumanalytics.io", "swiftscale.ai", "greenleaf.energy",
  "purelogic.dev", "aerovista.com", "crystalnet.io", "echowave.co",
  "fusiontech.dev", "harborview.com", "innospark.io", "keymetrics.co",
  "lunaredge.ai", "maplesoft.dev", "novacore.io", "optiflow.co",
  "pulsepoint.io", "redshiftlabs.com",
];

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split("T")[0];
}

function firstName(company: string): string {
  const firstNames = [
    "John", "Jane", "Mark", "Anna", "Chris", "Laura", "Steve", "Emma",
    "Dan", "Rachel", "Kevin", "Sophie", "Paul", "Megan", "Ryan",
    "Tina", "Oscar", "Lily", "Victor", "Nora", "Ian", "Clara",
    "Hugo", "Diana", "Felix", "Gina", "Leo", "Vera",
  ];
  return firstNames[companies.indexOf(company)] || "Alex";
}

function lastName(company: string): string {
  const lastNames = [
    "Smith", "Doe", "Brown", "Taylor", "Wilson", "Moore", "Clark", "Hall",
    "Adams", "Green", "Baker", "Hill", "Scott", "King", "Young",
    "Allen", "Wright", "Lopez", "Walker", "Lewis", "Robinson", "Martin",
    "White", "Harris", "Jackson", "Thomas", "Anderson", "Davis",
  ];
  return lastNames[companies.indexOf(company)] || "Rivera";
}

export const mockLeads: Lead[] = companies.map((company, i) => ({
  id: `lead-${i + 1}`,
  name: `${firstName(company)} ${lastName(company)}`,
  email: `${firstName(company).toLowerCase()}@${domains[i]}`,
  website: `https://${domains[i]}`,
  submittedBy: emailTeam[i % emailTeam.length],
  submittedDate: randomDate(new Date("2025-12-01"), new Date("2026-02-18")),
  status: "New" as const,
}));

export const bdeEmployees = bdeTeam;
export const emailEmployees = emailTeam;
