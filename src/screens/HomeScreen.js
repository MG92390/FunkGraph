import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LEVELS } from '../data/functions';

/**
 * HomeScreen — Select the level before starting the quiz.
 *
 * @param {function} onStart - Called when the user taps "Commencer"
 * @param {string} selectedLevel - Current level id
 * @param {function} onSelectLevel - Called when a level card is pressed
 */
const HomeScreen = ({ onStart, selectedLevel, onSelectLevel }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>FunkGraphs</Text>
      <Text style={styles.subtitle}>Choisis ton niveau</Text>

      <ScrollView
        style={styles.levelList}
        contentContainerStyle={styles.levelListContent}
        showsVerticalScrollIndicator={false}
      >
        {LEVELS.map((level) => {
          const isSelected = selectedLevel === level.id;

          return (
            <TouchableOpacity
              key={level.id}
              activeOpacity={0.85}
              onPress={() => {
                if (isSelected) {
                  onStart(level.id);
                  return;
                }

                onSelectLevel(level.id);
              }}
              style={[styles.levelCard, isSelected && styles.levelCardSelected]}
            >
              <Text style={[styles.levelName, isSelected && styles.levelNameSelected]}>{level.name}</Text>
              <Text style={styles.levelDescription}>{level.description}</Text>
              <Text style={styles.levelMeta}>{level.functions.length} fonctions</Text>
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
  levelList: {
    flex: 1,
    width: '100%',
  },
  levelListContent: {
    paddingBottom: 16,
  },
  levelCard: {
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
    backgroundColor: '#E3F2FD',
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
  levelMeta: {
    marginTop: 8,
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '600',
  },
});

export default HomeScreen;
