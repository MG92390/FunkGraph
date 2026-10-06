const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateScore,
  getCountedResults,
  calculateMaxScore,
  formatTimeInMs,
  updateBestRecord,
} = require('./scoring');

test('score thresholds match the new millisecond barème', () => {
  assert.equal(calculateScore(0.8), 10);
  assert.equal(calculateScore(0.9), 5);
  assert.equal(calculateScore(1.0), 3);
  assert.equal(calculateScore(1.2), 2);
  assert.equal(calculateScore(1.4), 1);
});

test('the final timeout is excluded from accuracy and maximum score', () => {
  const results = [
    { correct: true, points: 10 },
    { correct: false, points: 0, counted: false },
  ];

  const countedResults = getCountedResults(results);

  assert.equal(countedResults.length, 1);
  assert.equal(calculateMaxScore(countedResults.length), 10);
});

test('elapsed time is formatted in milliseconds for the round summary', () => {
  assert.equal(formatTimeInMs(1.25), '1250 ms');
  assert.equal(formatTimeInMs(0.5), '500 ms');
});

test('best record is tracked independently for each level', () => {
  const currentRecords = { troisieme: 12, seconde: 8 };

  assert.deepEqual(updateBestRecord(currentRecords, 'troisieme', 15), {
    troisieme: 15,
    seconde: 8,
  });
  assert.deepEqual(updateBestRecord(currentRecords, 'troisieme', 10), currentRecords);
  assert.deepEqual(updateBestRecord(currentRecords, 'premiere', 7), {
    troisieme: 12,
    seconde: 8,
    premiere: 7,
  });
});