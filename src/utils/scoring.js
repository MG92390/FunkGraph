/**
 * Scoring utilities for the graph recognition quiz.
 *
 * Scoring rules:
 * - Each correct answer awards a base score plus a time bonus.
 * - The faster the user answers, the more bonus points they earn.
 * - Wrong answers and timeouts award 0 points.
 */

const BASE_POINTS = 10;
const ROUND_TIME_SECONDS = 30;

/**
 * Calculate the score for a correct answer based on response time.
 *
 * @param {number} timeElapsed - Seconds elapsed since the question was shown.
 * @returns {number} The total points for this answer.
 */
function calculateScore(timeElapsed) {
  const elapsedMs = Math.max(0, Number(timeElapsed) || 0) * 1000;

  if (elapsedMs < 850) return 10;
  if (elapsedMs < 950) return 5;
  if (elapsedMs < 1120) return 3;
  if (elapsedMs < 1280) return 2;
  return 1;
}

/**
 * Calculate the total score from an array of round results.
 *
 * @param {Array<{correct: boolean, timeElapsed: number}>} results
 * @returns {number} The total score.
 */
function calculateTotalScore(results) {
  return results.reduce((total, result) => {
    if (result.correct && result.counted !== false) {
      return total + calculateScore(result.timeElapsed);
    }
    return total;
  }, 0);
}

/**
 * Return results that count toward the final accuracy and maximum score.
 * The final timeout ends the quiz and is deliberately excluded.
 *
 * @param {Array<{counted?: boolean}>} results
 * @returns {Array} Counted results.
 */
function getCountedResults(results) {
  return results.filter((result) => result.counted !== false);
}

/**
 * Calculate the maximum possible score for a given number of questions.
 *
 * @param {number} numQuestions - The number of questions in the quiz.
 * @returns {number} The maximum possible score.
 */
function calculateMaxScore(numQuestions) {
  return numQuestions * BASE_POINTS;
}

function formatTimeInMs(timeElapsed) {
  const milliseconds = Math.round((Number(timeElapsed) || 0) * 1000);
  return `${milliseconds} ms`;
}

module.exports = {
  BASE_POINTS,
  ROUND_TIME_SECONDS,
  calculateScore,
  calculateTotalScore,
  getCountedResults,
  calculateMaxScore,
  formatTimeInMs,
};
