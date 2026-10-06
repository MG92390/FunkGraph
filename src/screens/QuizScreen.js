import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TimerBar from '../components/TimerBar';
import ChoiceButton from '../components/ChoiceButton';
import { generateQuestionForLevel, getLevelById } from '../data/functions';
import { calculateScore, ROUND_TIME_SECONDS } from '../utils/scoring';

/**
 * QuizScreen — The main quiz gameplay screen.
 *
 * Displays a 30-second timer, the function to identify, and four graph choices.
 * The user selects a choice; faster correct answers earn more points.
 *
 * @param {function} onQuizComplete - Called with the final results array when the quiz ends
 * @param {string} levelId - Level selected by the player
 */
const QuizScreen = ({ onQuizComplete, levelId = 'troisieme' }) => {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(ROUND_TIME_SECONDS);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);

  const level = getLevelById(levelId);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const timeRemainingRef = useRef(ROUND_TIME_SECONDS);
  const timeUpRef = useRef(false);
  const answeringRef = useRef(false);
  const resultsRef = useRef([]);

  const startNewQuestion = () => {
    const q = generateQuestionForLevel(level.id);
    setCurrentQuestion(q);
    answeringRef.current = false;
    timeUpRef.current = false;
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!currentQuestion) return undefined;

    intervalRef.current = setInterval(() => {
      const nextTime = Math.max(0, timeRemainingRef.current - 0.1);
      timeRemainingRef.current = nextTime;
      setTimeRemaining(nextTime);

      if (nextTime === 0) {
        clearInterval(intervalRef.current);
        handleTimeout();
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentQuestion]);

  useEffect(() => {
    startNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const handleChoicePress = (choice) => {
    if (answeringRef.current || !currentQuestion) return;
    answeringRef.current = true;

    const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
    const isCorrect = choice.id === currentQuestion.answer.id;
    const points = isCorrect ? calculateScore(timeElapsed) : 0;

    setScore((prev) => prev + points);

    const result = {
      questionNumber,
      functionLabel: currentQuestion.answer.label,
      functionId: currentQuestion.answer.id,
      selectedId: choice.id,
      correctId: currentQuestion.answer.id,
      correct: isCorrect,
      timeElapsed,
      points,
    };
    const nextResults = [...resultsRef.current, result];
    resultsRef.current = nextResults;

    setQuestionNumber((prev) => prev + 1);
    startNewQuestion();
  };

  const handleTimeout = () => {
    if (!currentQuestion || timeUpRef.current) return;
    timeUpRef.current = true;
    const result = {
      questionNumber,
      functionLabel: currentQuestion.answer.label,
      functionId: currentQuestion.answer.id,
      selectedId: null,
      correctId: currentQuestion.answer.id,
      correct: false,
      timeElapsed: ROUND_TIME_SECONDS,
      points: 0,
      counted: false,
    };
    const nextResults = [...resultsRef.current, result];
    resultsRef.current = nextResults;
    onQuizComplete(nextResults);
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.levelText}>{level.name}</Text>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressText}>Question {questionNumber}</Text>
      </View>

      <TimerBar timeRemaining={timeRemaining} totalTime={ROUND_TIME_SECONDS} />

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Which graph matches?</Text>
        <Text style={styles.functionLabel}>{currentQuestion.answer.label}</Text>
      </View>

      <View style={styles.choicesGrid}>
        {currentQuestion.choices.map((choice) => (
          <ChoiceButton
            key={`${choice.levelId}-${choice.id}`}
            func={choice}
            onPress={() => handleChoicePress(choice)}
            size={140}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976D2',
  },
  levelText: {
    fontSize: 16,
    color: '#616161',
    fontWeight: '600',
  },
  progressRow: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 16,
    color: '#616161',
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#616161',
    marginBottom: 4,
  },
  functionLabel: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1976D2',
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
});

export default QuizScreen;
