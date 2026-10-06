const test = require('node:test');
const assert = require('node:assert/strict');
const {
  LEVELS,
  getLevelById,
  generateQuestionForLevel,
} = require('./functions');

test('levels are defined with the expected educational progression', () => {
  assert.ok(Array.isArray(LEVELS) && LEVELS.length >= 5);

  const troisieme = getLevelById('troisieme');
  assert.ok(troisieme);
  assert.ok(troisieme.functions.some((f) => f.id === 'identity'));
  assert.ok(troisieme.functions.some((f) => f.id === 'neg_identity'));
  assert.ok(troisieme.functions.some((f) => f.id === 'quadratic'));
  assert.ok(troisieme.functions.some((f) => f.id === 'reciprocal'));
});

test('quiz generation uses only functions from the chosen level', () => {
  const { answer, choices } = generateQuestionForLevel('premiere');

  assert.ok(answer);
  assert.equal(choices.length, 4);
  assert.ok(choices.every((choice) => choice.levelId === 'premiere'));
  assert.ok(answer.levelId === 'premiere');
});
