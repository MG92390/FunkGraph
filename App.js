import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultsScreen from './src/screens/ResultsScreen';

/**
 * App — Root component.
 *
 * Manages screen navigation via React state:
 *   'home'   → HomeScreen (level selection)
 *   'quiz'   → QuizScreen (30-second rounds, 4 graph choices)
 *   'results' → ResultsScreen (final score + breakdown)
 */
export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedLevel, setSelectedLevel] = useState('troisieme');
  const [quizResults, setQuizResults] = useState([]);

  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
  };

  const handleStartQuiz = (levelId = selectedLevel) => {
    setSelectedLevel(levelId);
    setScreen('quiz');
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setScreen('results');
  };

  const handleRestart = () => {
    setQuizResults([]);
    setScreen('home');
  };

  const handleBackToLevelSelection = () => {
    setQuizResults([]);
    setScreen('home');
  };

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          selectedLevel={selectedLevel}
          onSelectLevel={handleSelectLevel}
          onStart={handleStartQuiz}
        />
      );
    case 'quiz':
      return <QuizScreen levelId={selectedLevel} onQuizComplete={handleQuizComplete} />;
    case 'results':
      return (
        <ResultsScreen
          results={quizResults}
          levelId={selectedLevel}
          onRestart={handleRestart}
          onBackToLevels={handleBackToLevelSelection}
        />
      );
    default:
      return <HomeScreen selectedLevel={selectedLevel} onSelectLevel={handleSelectLevel} onStart={handleStartQuiz} />;
  }
}
