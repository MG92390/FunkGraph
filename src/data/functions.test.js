const test = require('node:test');
const assert = require('node:assert/strict');
const {
  LEVELS,
  getLevelById,
  generateQuestionForLevel,
} = require('./functions');

test('levels follow the Scholaria curriculum mapping', () => {
  assert.deepEqual(
    LEVELS.map((level) => level.id),
    ['troisieme', 'seconde', 'premiere', 'terminale', 'expert']
  );

  const troisieme = getLevelById('troisieme');
  assert.ok(troisieme);
  assert.ok(troisieme.functions.some((f) => f.id === 'identity'));
  assert.ok(troisieme.functions.some((f) => f.id === 'neg_identity'));
  assert.ok(troisieme.functions.some((f) => f.id === 'quadratic'));
  assert.ok(troisieme.functions.some((f) => f.id === 'reciprocal'));

  assert.equal(getLevelById('expert').id, 'expert');
  assert.ok(getLevelById('expert').functions.some((func) => func.id === 'step_function'));
});

test('quiz generation uses only functions from the chosen level', () => {
  const { answer, choices } = generateQuestionForLevel('premiere');

  assert.ok(answer);
  assert.equal(choices.length, 4);
  assert.ok(choices.every((choice) => choice.levelId === 'premiere'));
  assert.ok(answer.levelId === 'premiere');
});
