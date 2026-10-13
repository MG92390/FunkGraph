import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import CourseScreen from './src/screens/CourseScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { LEVELS } from './src/data/functions';
import { getHighestUnlockedLevelIndex, updateBestRecord } from './src/utils/scoring';

const RECORDS_STORAGE_KEY = 'funkgraphs.bestRecords.v1';
const POINTS_STORAGE_KEY = 'funkgraphs.levelPoints.v1';

/**
 * App — Root component.
 *
 * Manages screen navigation via React state:
 *   'home'   → HomeScreen (level selection)
 *   'course' → CourseScreen (function reference graphs)
 *   'quiz'   → QuizScreen (30-second rounds, 4 graph choices)
 *   'results' → ResultsScreen (final score + breakdown)
 */
export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedLevel, setSelectedLevel] = useState('troisieme');
  const [allLevelsUnlocked, setAllLevelsUnlocked] = useState(true);
  const [quizResults, setQuizResults] = useState([]);
  const [recordsByLevel, setRecordsByLevel] = useState({});
  const [pointsByLevel, setPointsByLevel] = useState({});
  const [recordsLoaded, setRecordsLoaded] = useState(false);
  const [pointsLoaded, setPointsLoaded] = useState(false);

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
    let isActive = true;

    AsyncStorage.getItem(POINTS_STORAGE_KEY)
      .then((storedPoints) => {
        if (isActive && storedPoints) {
          setPointsByLevel(JSON.parse(storedPoints));
        }
      })
      .catch((error) => {
        console.error('Failed to load cumulative level points:', error);
      })
      .finally(() => {
        if (isActive) setPointsLoaded(true);
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

  useEffect(() => {
    if (pointsLoaded) {
      AsyncStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(pointsByLevel)).catch((error) => {
        console.error('Failed to save cumulative level points:', error);
      });
    }
  }, [pointsByLevel, pointsLoaded]);

  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
  };

  const handleToggleAllLevelsUnlocked = () => {
    if (allLevelsUnlocked) {
      const highestUnlockedIndex = getHighestUnlockedLevelIndex(LEVELS, pointsByLevel);
      setSelectedLevel(LEVELS[highestUnlockedIndex].id);
      setAllLevelsUnlocked(false);
      return;
    }

    setAllLevelsUnlocked(true);
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
    setPointsByLevel((currentPoints) => ({
      ...currentPoints,
      [selectedLevel]: (currentPoints[selectedLevel] || 0) + roundScore,
    }));
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

  const handleOpenCourse = () => setScreen('course');
  const handleBackFromCourse = () => setScreen('home');

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          selectedLevel={selectedLevel}
          onSelectLevel={handleSelectLevel}
          onStart={handleStartQuiz}
          onOpenCourse={handleOpenCourse}
          allLevelsUnlocked={allLevelsUnlocked}
          onToggleAllLevelsUnlocked={handleToggleAllLevelsUnlocked}
          recordsByLevel={recordsByLevel}
          pointsByLevel={pointsByLevel}
        />
      );
    case 'course':
      return <CourseScreen onBack={handleBackFromCourse} />;
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
          onOpenCourse={handleOpenCourse}
          allLevelsUnlocked={allLevelsUnlocked}
          onToggleAllLevelsUnlocked={handleToggleAllLevelsUnlocked}
          recordsByLevel={recordsByLevel}
          pointsByLevel={pointsByLevel}
        />
      );
  }
}
