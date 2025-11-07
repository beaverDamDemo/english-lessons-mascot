export function progressTracker() {
  let correct = 0;
  let wrong = 0;
  let streak = 0;
  return {
    incrementCorrect: () => {
      correct++;
      streak++;
    },
    incrementWrong: () => {
      wrong++;
      streak = 0;
    },
    decreaseWrong: () => {
      if (wrong > 0) wrong--;
    },
    adjustFromWrongToCorrect() {
      if (wrong > 0) wrong--;
      correct++;
      streak++;
    },
    adjustFromCorrectToWrong() {
      correct--;
      wrong++;
      streak = 0;
    },
    resetStreak() {
      streak = 0;
    },
    reset() {
      correct = 0;
      wrong = 0;
      streak = 0;
    },
    getStats() {
      return { correct, wrong, streak };
    },
  };
}

export const progress = progressTracker();
