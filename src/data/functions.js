/**
 * Reference functions grouped by school level.
 * Each function has its own id, label, formula, plotting domain, and color.
 * We keep the data static here because Metro/Expo rejects dynamic require()
 * calls inside a module, even when guarded by try/catch.
 */

const buildFunction = (config) => ({
  ...config,
  image: config.image || null,
});

const LEVELS = [
  {
    id: 'troisieme',
    name: 'Troisième',
    description: 'Fonctions de base : droite et parabole',
    functions: [
      buildFunction({ id: 'identity', name: 'x', label: 'f(x) = x', fn: (x) => x, domain: [-5, 5], range: [-5, 5], color: '#2196F3', image: null, levelId: 'troisieme' }),
      buildFunction({ id: 'neg_identity', name: '-x', label: 'f(x) = -x', fn: (x) => -x, domain: [-5, 5], range: [-5, 5], color: '#4CAF50', image: null, levelId: 'troisieme' }),
      buildFunction({ id: 'quadratic', name: 'x²', label: 'f(x) = x²', fn: (x) => x * x, domain: [-3, 3], range: [-1, 9], color: '#FF5722', image: null, levelId: 'troisieme' }),
      buildFunction({ id: 'reciprocal', name: '1/x', label: 'f(x) = 1/x', fn: (x) => 1 / x, domain: [-5, 5], range: [-5, 5], color: '#FF9800', image: null, levelId: 'troisieme' }),
    ],
  },
  {
    id: 'seconde',
    name: 'Seconde',
    description: 'Fonctions usuelles et courbes simples',
    functions: [
      buildFunction({ id: 'identity', name: 'x', label: 'f(x) = x', fn: (x) => x, domain: [-5, 5], range: [-5, 5], color: '#2196F3', image: null, levelId: 'seconde' }),
      buildFunction({ id: 'neg_identity', name: '-x', label: 'f(x) = -x', fn: (x) => -x, domain: [-5, 5], range: [-5, 5], color: '#4CAF50', image: null, levelId: 'seconde' }),
      buildFunction({ id: 'quadratic', name: 'x²', label: 'f(x) = x²', fn: (x) => x * x, domain: [-3, 3], range: [-1, 9], color: '#FF5722', image: null, levelId: 'seconde' }),
      buildFunction({ id: 'reciprocal', name: '1/x', label: 'f(x) = 1/x', fn: (x) => 1 / x, domain: [-5, 5], range: [-5, 5], color: '#FF9800', image: null, levelId: 'seconde' }),
      buildFunction({ id: 'square_root', name: '√x', label: 'f(x) = √x', fn: (x) => Math.sqrt(x), domain: [0, 9], range: [0, 3], color: '#00BCD4', image: null, levelId: 'seconde' }),
      buildFunction({ id: 'cubic', name: 'x³', label: 'f(x) = x³', fn: (x) => x * x * x, domain: [-2.5, 2.5], range: [-10, 10], color: '#E91E63', image: null, levelId: 'seconde' }),
      buildFunction({ id: 'cosine', name: 'cos(x)', label: 'f(x) = cos(x)', fn: (x) => Math.cos(x), domain: [-2 * Math.PI, 2 * Math.PI], range: [-1.5, 1.5], color: '#FF7043', image: null, levelId: 'seconde' }),
    ],
  },
  {
    id: 'premiere',
    name: 'Première',
    description: 'Trigonométrie, exponentielle et valeur absolue',
    functions: [
      buildFunction({ id: 'identity', name: 'x', label: 'f(x) = x', fn: (x) => x, domain: [-5, 5], range: [-5, 5], color: '#2196F3', image: null, levelId: 'premiere' }),
      buildFunction({ id: 'neg_identity', name: '-x', label: 'f(x) = -x', fn: (x) => -x, domain: [-5, 5], range: [-5, 5], color: '#4CAF50', image: null, levelId: 'premiere' }),
      buildFunction({ id: 'quadratic', name: 'x²', label: 'f(x) = x²', fn: (x) => x * x, domain: [-3, 3], range: [-1, 9], color: '#FF5722', image: null, levelId: 'premiere' }),
      buildFunction({ id: 'reciprocal', name: '1/x', label: 'f(x) = 1/x', fn: (x) => 1 / x, domain: [-5, 5], range: [-5, 5], color: '#FF9800', image: null, levelId: 'premiere' }),
      buildFunction({ id: 'square_root', name: '√x', label: 'f(x) = √x', fn: (x) => Math.sqrt(x), domain: [0, 9], range: [0, 3], color: '#00BCD4', image: null, levelId: 'premiere' }),
      buildFunction({ id: 'cubic', name: 'x³', label: 'f(x) = x³', fn: (x) => x * x * x, domain: [-2.5, 2.5], range: [-10, 10], color: '#E91E63', image: null, levelId: 'premiere' }),
      buildFunction({ id: 'cosine', name: 'cos(x)', label: 'f(x) = cos(x)', fn: (x) => Math.cos(x), domain: [-2 * Math.PI, 2 * Math.PI], range: [-1.5, 1.5], color: '#FF7043', image: null, levelId: 'premiere' }),
      buildFunction({ id: 'sine', name: 'sin(x)', label: 'f(x) = sin(x)', fn: (x) => Math.sin(x), domain: [-2 * Math.PI, 2 * Math.PI], range: [-1.5, 1.5], color: '#009688', image: null, levelId: 'premiere' }),
      buildFunction({ id: 'exponential', name: 'eˣ', label: 'f(x) = eˣ', fn: (x) => Math.exp(x), domain: [-5, 3], range: [-1, 20], color: '#795548', image: null, levelId: 'premiere' }),
      buildFunction({ id: 'absolute_value', name: '|x|', label: 'f(x) = |x|', fn: (x) => Math.abs(x), domain: [-5, 5], range: [0, 5], color: '#3F51B5', image: null, levelId: 'premiere' }),
    ],
  },
  {
    id: 'terminale',
    name: 'Terminale',
    description: 'Logarithmes, exponentielle et fonctions de référence',
    functions: [
      buildFunction({ id: 'identity', name: 'x', label: 'f(x) = x', fn: (x) => x, domain: [-5, 5], range: [-5, 5], color: '#2196F3', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'neg_identity', name: '-x', label: 'f(x) = -x', fn: (x) => -x, domain: [-5, 5], range: [-5, 5], color: '#4CAF50', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'quadratic', name: 'x²', label: 'f(x) = x²', fn: (x) => x * x, domain: [-3, 3], range: [-1, 9], color: '#FF5722', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'reciprocal', name: '1/x', label: 'f(x) = 1/x', fn: (x) => 1 / x, domain: [-5, 5], range: [-5, 5], color: '#FF9800', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'square_root', name: '√x', label: 'f(x) = √x', fn: (x) => Math.sqrt(x), domain: [0, 9], range: [0, 3], color: '#00BCD4', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'cubic', name: 'x³', label: 'f(x) = x³', fn: (x) => x * x * x, domain: [-2.5, 2.5], range: [-10, 10], color: '#E91E63', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'cosine', name: 'cos(x)', label: 'f(x) = cos(x)', fn: (x) => Math.cos(x), domain: [-2 * Math.PI, 2 * Math.PI], range: [-1.5, 1.5], color: '#FF7043', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'sine', name: 'sin(x)', label: 'f(x) = sin(x)', fn: (x) => Math.sin(x), domain: [-2 * Math.PI, 2 * Math.PI], range: [-1.5, 1.5], color: '#009688', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'exponential', name: 'eˣ', label: 'f(x) = eˣ', fn: (x) => Math.exp(x), domain: [-5, 3], range: [-1, 20], color: '#795548', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'natural_log', name: 'ln(x)', label: 'f(x) = ln(x)', fn: (x) => Math.log(x), domain: [0.01, 10], range: [-5, 3], color: '#607D8B', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'exp_ln_x', name: 'e^(ln x)', label: 'f(x) = e^(ln x)', fn: (x) => x, domain: [0.1, 5], range: [-1, 5], color: '#3F51B5', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'ln_exp_x', name: 'ln(e^x)', label: 'f(x) = ln(e^x)', fn: (x) => x, domain: [-5, 5], range: [-5, 5], color: '#8D6E63', image: null, levelId: 'terminale' }),
      buildFunction({ id: 'absolute_value', name: '|x|', label: 'f(x) = |x|', fn: (x) => Math.abs(x), domain: [-5, 5], range: [0, 5], color: '#3F51B5', image: null, levelId: 'terminale' }),
    ],
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Variations avancées et fonctions de forme sophistiquée',
    functions: [
      buildFunction({ id: 'neg_log', name: '-ln(x)', label: 'f(x) = -ln(x)', fn: (x) => -Math.log(x), domain: [0.1, 10], range: [-5, 5], color: '#009688', image: null, levelId: 'expert' }),
      buildFunction({ id: 'log_neg_x', name: 'ln(-x)', label: 'f(x) = ln(-x)', fn: (x) => Math.log(-x), domain: [-10, -0.1], range: [-5, 3], color: '#00BCD4', image: null, levelId: 'expert' }),
      buildFunction({ id: 'neg_log_neg_x', name: '-ln(-x)', label: 'f(x) = -ln(-x)', fn: (x) => -Math.log(-x), domain: [-10, -0.1], range: [-5, 3], color: '#7CB342', image: null, levelId: 'expert' }),
      buildFunction({ id: 'log_x', name: 'ln(x)', label: 'f(x) = ln(x)', fn: (x) => Math.log(x), domain: [0.1, 10], range: [-5, 3], color: '#607D8B', image: null, levelId: 'expert' }),
      buildFunction({ id: 'sqrt_neg_x', name: '√(-x)', label: 'f(x) = √(-x)', fn: (x) => Math.sqrt(-x), domain: [-9, 0], range: [0, 3], color: '#8E24AA', image: null, levelId: 'expert' }),
      buildFunction({ id: 'sqrt_x', name: '√x', label: 'f(x) = √x', fn: (x) => Math.sqrt(x), domain: [0, 9], range: [0, 3], color: '#00BCD4', image: null, levelId: 'expert' }),
      buildFunction({ id: 'neg_sqrt_neg_x', name: '-√(-x)', label: 'f(x) = -√(-x)', fn: (x) => -Math.sqrt(-x), domain: [-9, 0], range: [-3, 0], color: '#D81B60', image: null, levelId: 'expert' }),
      buildFunction({ id: 'neg_sqrt_x', name: '-√x', label: 'f(x) = -√x', fn: (x) => -Math.sqrt(x), domain: [0, 9], range: [-3, 0], color: '#F06292', image: null, levelId: 'expert' }),
      buildFunction({ id: 'identity', name: 'x', label: 'f(x) = x', fn: (x) => x, domain: [-5, 5], range: [-5, 5], color: '#2196F3', image: null, levelId: 'expert' }),
      buildFunction({ id: 'neg_identity', name: '-x', label: 'f(x) = -x', fn: (x) => -x, domain: [-5, 5], range: [-5, 5], color: '#4CAF50', image: null, levelId: 'expert' }),
      buildFunction({ id: 'quadratic', name: 'x²', label: 'f(x) = x²', fn: (x) => x * x, domain: [-3, 3], range: [-1, 9], color: '#FF5722', image: null, levelId: 'expert' }),
      buildFunction({ id: 'reciprocal', name: '1/x', label: 'f(x) = 1/x', fn: (x) => 1 / x, domain: [-5, 5], range: [-5, 5], color: '#FF9800', image: null, levelId: 'expert' }),
      buildFunction({ id: 'cubic', name: 'x³', label: 'f(x) = x³', fn: (x) => x * x * x, domain: [-2.5, 2.5], range: [-10, 10], color: '#E91E63', image: null, levelId: 'expert' }),
      buildFunction({ id: 'cosine', name: 'cos(x)', label: 'f(x) = cos(x)', fn: (x) => Math.cos(x), domain: [-2 * Math.PI, 2 * Math.PI], range: [-1.5, 1.5], color: '#FF7043', image: null, levelId: 'expert' }),
      buildFunction({ id: 'sine', name: 'sin(x)', label: 'f(x) = sin(x)', fn: (x) => Math.sin(x), domain: [-2 * Math.PI, 2 * Math.PI], range: [-1.5, 1.5], color: '#009688', image: null, levelId: 'expert' }),
      buildFunction({ id: 'exponential', name: 'eˣ', label: 'f(x) = eˣ', fn: (x) => Math.exp(x), domain: [-5, 3], range: [-1, 20], color: '#795548', image: null, levelId: 'expert' }),
      buildFunction({ id: 'step_function', name: 'Escalier', label: 'f(x) = ⌊x⌋', fn: (x) => Math.floor(x), domain: [-5, 5], range: [-5, 5], color: '#FFB300', image: null, levelId: 'expert' }),
      buildFunction({ id: 'absolute_value', name: '|x|', label: 'f(x) = |x|', fn: (x) => Math.abs(x), domain: [-5, 5], range: [0, 5], color: '#3F51B5', image: null, levelId: 'expert' }),
    ],
  },
];

const functions = LEVELS.flatMap((level) =>
  level.functions.map((func) => ({
    ...func,
    levelId: level.id,
  }))
);

function getLevelById(levelId = 'troisieme') {
  return LEVELS.find((level) => level.id === levelId) || LEVELS[0];
}

function getRandomFunctions(levelId, excludeId, count) {
  const level = getLevelById(levelId);
  const available = level.functions.filter((func) => func.id !== excludeId);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateQuestionForLevel(levelId = 'troisieme') {
  const level = getLevelById(levelId);
  const answer = level.functions[Math.floor(Math.random() * level.functions.length)];
  const distractors = getRandomFunctions(level.id, answer.id, 3);
  const choices = [answer, ...distractors].sort(() => Math.random() - 0.5);
  return { level, answer, choices };
}

function generateQuestion() {
  return generateQuestionForLevel('troisieme');
}

module.exports = {
  LEVELS,
  functions,
  getLevelById,
  getRandomFunctions,
  generateQuestionForLevel,
  generateQuestion,
};
