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

test('natural logarithm graphs show the y-axis without extending the function to x <= 0', () => {
  const terminaleLog = getLevelById('terminale').functions.find((func) => func.id === 'natural_log');
  const expertLog = getLevelById('expert').functions.find((func) => func.id === 'log_x');

  for (const func of [terminaleLog, expertLog]) {
    assert.ok(func.domain[0] < 0);
    assert.ok(Number.isNaN(func.fn(-0.1)));
    assert.equal(func.fn(0), -Infinity);
    assert.ok(Number.isFinite(func.fn(0.1)));
  }
});

test('quiz generation uses only functions from the chosen level', () => {
  const { answer, choices } = generateQuestionForLevel('premiere');

  assert.ok(answer);
  assert.equal(choices.length, 4);
  assert.ok(choices.every((choice) => choice.levelId === 'premiere'));
  assert.ok(answer.levelId === 'premiere');
});
