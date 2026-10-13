import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LEVELS } from '../data/functions';
import { getHighestUnlockedLevelIndex, getLevelProgress, LEVEL_UNLOCK_POINTS } from '../utils/scoring';

/**
 * HomeScreen — Select the level before starting the quiz.
 *
 * @param {function} onStart - Called when the user taps "Commencer"
 * @param {string} selectedLevel - Current level id
 * @param {function} onSelectLevel - Called when a level card is pressed
 */
const HomeScreen = ({
  onStart,
  onOpenCourse,
  selectedLevel,
  onSelectLevel,
  recordsByLevel = {},
  pointsByLevel = {},
}) => {
  const highestUnlockedLevelIndex = getHighestUnlockedLevelIndex(LEVELS, pointsByLevel);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>FunkGraphs</Text>
      <Text style={styles.subtitle}>Choisis ton niveau</Text>
      <TouchableOpacity style={styles.courseButton} onPress={onOpenCourse} activeOpacity={0.85}>
        <Text style={styles.courseButtonText}>Voir les fonctions du cours</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.levelList}
        contentContainerStyle={styles.levelListContent}
        showsVerticalScrollIndicator={false}
      >
        {LEVELS.map((level, levelIndex) => {
          const isSelected = selectedLevel === level.id;
          const record = recordsByLevel[level.id];
          const progress = getLevelProgress(pointsByLevel[level.id]);
          const isUnlocked = levelIndex <= highestUnlockedLevelIndex;
          const previousLevelPoints = levelIndex > 0
            ? pointsByLevel[LEVELS[levelIndex - 1].id] || 0
            : 0;

          return (
            <TouchableOpacity
              key={level.id}
              activeOpacity={0.85}
              disabled={!isUnlocked}
              onPress={() => {
                if (!isUnlocked) return;
                if (isSelected) {
                  onStart(level.id);
                  return;
                }

                onSelectLevel(level.id);
              }}
              style={[
                styles.levelCard,
                isSelected && styles.levelCardSelected,
                !isUnlocked && styles.levelCardLocked,
              ]}
            >
              <View
                pointerEvents="none"
                style={[styles.progressFill, { width: `${progress.percentage}%` }]}
              />
              <View style={styles.cardContent}>
                <Text style={[styles.levelName, isSelected && styles.levelNameSelected]}>{level.name}</Text>
                <Text style={styles.levelDescription}>{level.description}</Text>
                <View style={styles.metricsRow}>
                  <Text style={[styles.levelMeta, styles.functionsCount]}>{level.functions.length} fonctions</Text>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Record</Text>
                    <Text style={styles.metricValue}>{record === undefined ? '—' : `${record} pts`}</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>{isUnlocked ? 'Progression' : 'Verrouillé'}</Text>
                    <Text style={styles.metricValue}>
                      {isUnlocked
                        ? `${progress.points} / ${LEVEL_UNLOCK_POINTS} pts`
                        : `${Math.max(0, LEVEL_UNLOCK_POINTS - previousLevelPoints)} pts restants`}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#616161',
    textAlign: 'center',
    marginBottom: 20,
  },
  courseButton: {
    alignSelf: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 16,
  },
  courseButtonText: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: '700',
  },
  levelList: {
    flex: 1,
    width: '100%',
  },
  levelListContent: {
    paddingBottom: 16,
  },
  levelCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  levelCardSelected: {
    borderColor: '#1976D2',
    backgroundColor: '#F5F5F5',
  },
  levelCardLocked: {
    opacity: 0.65,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#C8E6C9',
  },
  cardContent: {
    zIndex: 1,
  },
  levelName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
  },
  levelNameSelected: {
    color: '#1976D2',
  },
  levelDescription: {
    fontSize: 14,
    color: '#616161',
    marginTop: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  levelMeta: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  functionsCount: {
    flex: 1,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#757575',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 11,
    color: '#212121',
    fontWeight: '700',
    marginTop: 2,
  },
});

export default HomeScreen;
