import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { updateBestRecord } from './src/utils/scoring';

const RECORDS_STORAGE_KEY = 'funkgraphs.bestRecords.v1';

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
  const [recordsByLevel, setRecordsByLevel] = useState({});
  const [recordsLoaded, setRecordsLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    AsyncStorage.getItem(RECORDS_STORAGE_KEY)
      .then((storedRecords) => {
        if (isActive && storedRecords) {
          setRecordsByLevel(JSON.parse(storedRecords));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isActive) setRecordsLoaded(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (recordsLoaded) {
      AsyncStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(recordsByLevel)).catch(() => {});
    }
  }, [recordsByLevel, recordsLoaded]);

  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
  };

  const handleStartQuiz = (levelId = selectedLevel) => {
    setSelectedLevel(levelId);
    setScreen('quiz');
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    const roundScore = results.reduce((total, result) => total + result.points, 0);
    setRecordsByLevel((currentRecords) =>
      updateBestRecord(currentRecords, selectedLevel, roundScore)
    );
    setScreen('results');
  };

  const handleRestart = () => {
    setQuizResults([]);
    setScreen('quiz');
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
          recordsByLevel={recordsByLevel}
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
      return (
        <HomeScreen
          selectedLevel={selectedLevel}
          onSelectLevel={handleSelectLevel}
          onStart={handleStartQuiz}
          recordsByLevel={recordsByLevel}
        />
      );
  }
}
