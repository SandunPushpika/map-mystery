export type Guess = {
  year?: number;
  lat: number;
  lng: number;
};

export type Answer = {
  year: number;
  lat: number;
  lng: number;
};

function calculateYearScore(guessedYear: number, correctYear: number): number {
  const MAX_YEAR_DIFF = 100;

  const diff = Math.abs(guessedYear - correctYear);
  const score = 100 * (1 - diff / MAX_YEAR_DIFF);

  return Math.max(0, Math.round(score));
}

function calculateLocationScore(distanceKm: number): number {
  const MAX_DISTANCE = 5000;

  const score = 100 * (1 - distanceKm / MAX_DISTANCE);
  return Math.max(0, Math.round(score));
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

export function calculateFinalScore(
  guess: Guess,
  answer: Answer,
  isLocationOnly: boolean = false,
): {
  total: number;
  yearScore: number;
  locationScore: number;
  distanceKm: number;
  yearDiff: number;
} {
  const distanceKm = haversineDistance(
    guess.lat,
    guess.lng,
    answer.lat,
    answer.lng,
  );

  const yearDiff = isLocationOnly
    ? 0
    : Math.abs((guess.year as number) - answer.year);

  const locationScore = calculateLocationScore(distanceKm);
  const yearScore = isLocationOnly
    ? 0
    : calculateYearScore(guess.year as number, answer.year);

  const total = Math.round(locationScore * 0.7 + yearScore * 0.3);

  return {
    total,
    yearScore,
    locationScore,
    distanceKm: Math.round(distanceKm),
    yearDiff,
  };
}
