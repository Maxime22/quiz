export function calculateTimeSpent(timerStart = null) {
  if (timerStart) {
    let endTime = Date.now();
    let timeSpent = ((endTime - timerStart) / 1000).toFixed(2); // Temps en secondes avec 2 décimales
    return parseFloat(timeSpent); // Convertir en nombre si nécessaire
  }
  return 0;
}

export function calculateScoreInPercentage(
  totalCountOfWordsForCurrentLesson,
  unknownWordsForCurrentLesson,
) {
  return Math.round(
    ((totalCountOfWordsForCurrentLesson - unknownWordsForCurrentLesson.length) /
      totalCountOfWordsForCurrentLesson) *
      100,
  );
}
