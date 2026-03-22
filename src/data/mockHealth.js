export const mockHealthData = {
  heartRate: { avg: 78, min: 52, max: 142, zone: 'Cardio' },
  sleep: { hours: 7, minutes: 20, score: 82, quality: 'Good' },
  hrv: { value: 68, unit: 'ms', status: 'Above average' },
  recovery: { value: 82, unit: '%', status: 'Ready to play' },
  today: {
    calories: { value: 1840, unit: 'kcal', pct: 73 },
    steps: { value: 9240, unit: '', pct: 92 },
    active: { value: 52, unit: 'min', pct: 87 },
  },
}

export const mockHealth = {
  recoveryScore: mockHealthData.recovery.value,
}
