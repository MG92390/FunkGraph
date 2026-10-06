import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GraphView from '../components/GraphView';
import { calculateMaxScore, getCountedResults, formatTimeInMs } from '../utils/scoring';
import { functions } from '../data/functions';

/**
 * ResultsScreen — Shows the final score and a breakdown of each question.
 *
 * @param {Array} results - Array of result objects from the quiz
 * @param {function} onRestart - Called when the user taps "Play Again"
 * @param {function} onBackToLevels - Called when the user taps "Choose level"
 */
const ResultsScreen = ({ results, onRestart, onBackToLevels }) => {
  const totalScore = results.reduce((sum, r) => sum + r.points, 0);
  const countedResults = getCountedResults(results);
  const correctCount = countedResults.filter((r) => r.correct).length;
  const maxScore = calculateMaxScore(countedResults.length);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // Find the function object for each result
  const getFuncById = (id) => functions.find((f) => f.id === id) || null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onBackToLevels} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>Choose level</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={onRestart} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>

        {/* Score summary */}
        <View style={styles.summary}>
          <Text style={styles.title}>Results</Text>
          <Text style={styles.score}>{totalScore}</Text>
          <Text style={styles.subtitle}>
            {correctCount}/{countedResults.length} correct · {percentage}%
          </Text>
        </View>

        {/* Question breakdown */}
        <View style={styles.breakdown}>
          {results.map((r) => {
            const correctFunc = getFuncById(r.correctId);
            const selectedFunc = r.selectedId ? getFuncById(r.selectedId) : null;

            return (
              <View key={r.questionNumber} style={styles.resultItem}>
                <Text style={styles.resultHeader}>
                  Question {r.questionNumber}
                  <Text
                    style={[
                      styles.resultStatus,
                      { color: r.counted === false ? '#9E9E9E' : r.correct ? '#4CAF50' : '#F44336' },
                    ]}
                  >
                    {' '}
                    {r.counted === false ? '—' : r.correct ? '✓' : '✗'}
                  </Text>
                </Text>

                <View style={styles.graphsRow}>
                  {/* Correct answer graph */}
                  <View style={styles.graphBox}>
                    <Text style={styles.graphLabel}>Correct</Text>
                    {correctFunc && (
                      <GraphView func={correctFunc} width={100} height={100} />
                    )}
                  </View>

                  {/* User's selection (if different from correct) */}
                  {selectedFunc && selectedFunc.id !== correctFunc.id && (
                    <View style={styles.graphBox}>
                      <Text style={styles.graphLabel}>Your answer</Text>
                      <GraphView func={selectedFunc} width={100} height={100} />
                    </View>
                  )}

                  {/* Timed out — no selection */}
                  {!r.selectedId && (
                    <View style={styles.graphBox}>
                      <Text style={styles.graphLabel}>No answer</Text>
                      <View style={[styles.graphPlaceholder, { width: 100, height: 100 }]} />
                    </View>
                  )}
                </View>

                <Text style={styles.pointsText}>
                  +{r.points} points · answered in {formatTimeInMs(r.timeElapsed)}
                </Text>
              </View>
            );
          })}
        </View>

      </ScrollView>
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
  summary: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1976D2',
    marginBottom: 8,
  },
  score: {
    fontSize: 56,
    fontWeight: '800',
    color: '#1976D2',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#616161',
  },
  breakdown: {
    marginBottom: 24,
  },
  resultItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  resultHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  resultStatus: {
    fontWeight: '800',
  },
  graphsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  graphBox: {
    alignItems: 'center',
  },
  graphLabel: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 4,
  },
  graphPlaceholder: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  pointsText: {
    fontSize: 13,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1976D2',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1976D2',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ResultsScreen;
