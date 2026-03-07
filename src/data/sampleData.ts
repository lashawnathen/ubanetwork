export const samplePlayer = {
  id: "1",
  name: "Marcus Cole",
  position: "PG",
  archetype: "Playmaking Shot Creator",
  team: "Chicago Titans",
  overall: 87,
  season: 4,
  ucBalance: 12450,
  level: 42,
  avatarUrl: "",
  dailyStreak: 7,
  lastClaim: "2026-03-06",
};

export const attributes = [
  { name: "3 Point Shot", value: 85, category: "Shooting" },
  { name: "Mid Range", value: 88, category: "Shooting" },
  { name: "Driving Dunk", value: 72, category: "Finishing" },
  { name: "Standing Dunk", value: 45, category: "Finishing" },
  { name: "Layup", value: 90, category: "Finishing" },
  { name: "Ball Handle", value: 92, category: "Playmaking" },
  { name: "Pass Accuracy", value: 89, category: "Playmaking" },
  { name: "Speed with Ball", value: 86, category: "Physical" },
  { name: "Speed", value: 88, category: "Physical" },
  { name: "Agility", value: 85, category: "Physical" },
  { name: "Strength", value: 62, category: "Physical" },
  { name: "Vertical", value: 75, category: "Physical" },
  { name: "Stamina", value: 90, category: "Physical" },
  { name: "Perimeter Defense", value: 78, category: "Defense" },
  { name: "Interior Defense", value: 55, category: "Defense" },
  { name: "Steal", value: 80, category: "Defense" },
  { name: "Block", value: 40, category: "Defense" },
  { name: "Offensive Rebound", value: 35, category: "Rebounding" },
  { name: "Defensive Rebound", value: 50, category: "Rebounding" },
  { name: "Playmaking IQ", value: 91, category: "Mental" },
  { name: "Help Defense IQ", value: 74, category: "Mental" },
];

export const badges = [
  { name: "Ankle Breaker", level: "HOF", category: "Playmaking" },
  { name: "Dimer", level: "Gold", category: "Playmaking" },
  { name: "Floor General", level: "Gold", category: "Playmaking" },
  { name: "Quick First Step", level: "HOF", category: "Playmaking" },
  { name: "Catch & Shoot", level: "Silver", category: "Shooting" },
  { name: "Deadeye", level: "Gold", category: "Shooting" },
  { name: "Green Machine", level: "Silver", category: "Shooting" },
  { name: "Range Extender", level: "Gold", category: "Shooting" },
  { name: "Acrobat", level: "Gold", category: "Finishing" },
  { name: "Giant Slayer", level: "Silver", category: "Finishing" },
  { name: "Clamps", level: "Silver", category: "Defense" },
  { name: "Pick Pocket", level: "Gold", category: "Defense" },
  { name: "Intimidator", level: "Bronze", category: "Defense" },
];

export const tendencies = [
  { name: "Driving Tendency", value: 78 },
  { name: "Pull Up 3", value: 65 },
  { name: "Spot Up 3", value: 82 },
  { name: "Mid Range Pull Up", value: 70 },
  { name: "Dish to Open Man", value: 88 },
  { name: "Flashy Pass", value: 55 },
  { name: "Alley Oop Pass", value: 45 },
  { name: "ISO Tendency", value: 72 },
  { name: "Post Up", value: 15 },
  { name: "Crash Boards", value: 25 },
];

export const transactions = [
  { id: "1", type: "earned" as const, amount: 500, reason: "Daily Reward Claim", date: "2026-03-06" },
  { id: "2", type: "spent" as const, amount: -1200, reason: "Attribute Upgrade: Ball Handle 90→92", date: "2026-03-05" },
  { id: "3", type: "earned" as const, amount: 2000, reason: "Game Reward: 32pts 11ast", date: "2026-03-05" },
  { id: "4", type: "spent" as const, amount: -800, reason: "Badge Upgrade: Dimer → Gold", date: "2026-03-04" },
  { id: "5", type: "earned" as const, amount: 500, reason: "Daily Reward Claim", date: "2026-03-04" },
  { id: "6", type: "spent" as const, amount: -2500, reason: "Attribute Upgrade: 3pt Shot 82→85", date: "2026-03-03" },
  { id: "7", type: "earned" as const, amount: 1000, reason: "Admin Adjustment", date: "2026-03-02" },
  { id: "8", type: "earned" as const, amount: 1500, reason: "Game Reward: 28pts 9ast", date: "2026-03-01" },
];

export const standings = [
  { rank: 1, team: "Chicago Titans", wins: 28, losses: 6, pct: ".824" },
  { rank: 2, team: "LA Vipers", wins: 25, losses: 9, pct: ".735" },
  { rank: 3, team: "NY Empire", wins: 23, losses: 11, pct: ".676" },
  { rank: 4, team: "Houston Blaze", wins: 21, losses: 13, pct: ".618" },
  { rank: 5, team: "Miami Storm", wins: 20, losses: 14, pct: ".588" },
  { rank: 6, team: "Detroit Pistons", wins: 18, losses: 16, pct: ".529" },
  { rank: 7, team: "ATL Hawks", wins: 15, losses: 19, pct: ".441" },
  { rank: 8, team: "Boston Celtics", wins: 12, losses: 22, pct: ".353" },
];

export const topPlayers = [
  { rank: 1, name: "Marcus Cole", overall: 87, position: "PG", team: "Chicago Titans" },
  { rank: 2, name: "DeShawn Williams", overall: 86, position: "SG", team: "LA Vipers" },
  { rank: 3, name: "Tyrone Jackson", overall: 85, position: "SF", team: "NY Empire" },
  { rank: 4, name: "Andre Mitchell", overall: 84, position: "PF", team: "Houston Blaze" },
  { rank: 5, name: "Chris Brown", overall: 83, position: "C", team: "Miami Storm" },
];

export const recentNews = [
  { title: "Season 4 Patch Notes Released", date: "2026-03-06", excerpt: "New badge system and attribute caps adjusted for competitive balance." },
  { title: "All-Star Voting Opens", date: "2026-03-05", excerpt: "Vote for your favorite players to represent in the S4 All-Star Game." },
  { title: "Trade Deadline Approaching", date: "2026-03-04", excerpt: "Teams have until March 15th to finalize roster moves." },
  { title: "New Gear Drop: Elite Series", date: "2026-03-03", excerpt: "Exclusive court gear now available in the shop." },
];

export const dailyRewards = [
  { day: 1, reward: "200 UC", claimed: true },
  { day: 2, reward: "300 UC", claimed: true },
  { day: 3, reward: "250 UC", claimed: true },
  { day: 4, reward: "400 UC", claimed: true },
  { day: 5, reward: "350 UC", claimed: true },
  { day: 6, reward: "500 UC", claimed: true },
  { day: 7, reward: "1000 UC + Badge Token", claimed: false },
];
