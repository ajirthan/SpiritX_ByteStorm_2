// lib/computeStats.ts

export interface RawStats {
  runs: number;
  ballsFaced: number;
  inningsPlayed: number;
  wickets: number;
  oversBowled: number;
  runsConceded: number;
}

export interface ComputedStats {
  battingAverage: number;
  battingStrikeRate: number;
  bowlingEconomy: number;
  bowlingStrikeRate: number;
  playerPoints: number;
  playerValue: number;
}

export function computeStats({
  runs,
  ballsFaced,
  inningsPlayed,
  wickets,
  oversBowled,
  runsConceded,
}: RawStats): ComputedStats {
  // Batting calculations
  const battingAverage = inningsPlayed > 0 ? runs / inningsPlayed : 0;
  const battingStrikeRate = ballsFaced > 0 ? (runs / ballsFaced) * 100 : 0;

  // Bowling calculations
  const bowlingEconomy = oversBowled > 0 ? runsConceded / oversBowled : 0;
  const bowlingStrikeRate = wickets > 0 ? (oversBowled * 6) / wickets : 0;

  // Points calculation
  const battingPoints = battingStrikeRate / 5 + battingAverage * 0.8;
  let bowlingPoints = 0;
  if (bowlingStrikeRate > 0) {
    bowlingPoints += 500 / bowlingStrikeRate;
  }
  if (bowlingEconomy > 0) {
    bowlingPoints += 140 / bowlingEconomy;
  }
  const playerPoints = battingPoints + bowlingPoints;

  // Player value: Multiply points by 1000, then round to the nearest 50,000
  const rawValue = playerPoints * 1000;
  const playerValue = Math.round(rawValue / 50000) * 50000;

  return {
    battingAverage,
    battingStrikeRate,
    bowlingEconomy,
    bowlingStrikeRate,
    playerPoints,
    playerValue,
  };
}
