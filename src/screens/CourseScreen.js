import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GraphView from '../components/GraphView';
import { LEVELS } from '../data/functions';

const CourseScreen = ({ onBack }) => (
  <View style={styles.container}>
    <StatusBar style="dark" />

    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.85}>
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Cours : les fonctions</Text>
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>
      {LEVELS.map((level) => (
        <View key={level.id} style={styles.levelSection}>
          <Text style={styles.levelName}>{level.name}</Text>
          <Text style={styles.levelDescription}>{level.description}</Text>

          {level.functions.map((func) => (
            <View key={`${level.id}-${func.id}`} style={styles.functionCard}>
              <GraphView func={func} width={120} height={100} />
              <View style={styles.functionInfo}>
                <Text style={styles.functionName}>{func.name}</Text>
                <Text style={styles.functionFormula}>{func.label}</Text>
              </View>
            </View>
          ))}

          {level.id === 'expert' && (
            <Text style={styles.expertNote}>
              Les explications des fonctions Expert seront ajoutées prochainement.
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginBottom: 14,
  },
  backButtonText: {
    color: '#1976D2',
    fontWeight: '700',
  },
  title: {
    color: '#1976D2',
    fontSize: 28,
    fontWeight: '800',
  },
  levelSection: {
    marginBottom: 24,
  },
  levelName: {
    color: '#212121',
    fontSize: 23,
    fontWeight: '800',
  },
  levelDescription: {
    color: '#616161',
    fontSize: 14,
    marginTop: 3,
    marginBottom: 10,
  },
  functionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    gap: 14,
  },
  functionInfo: {
    flex: 1,
  },
  functionName: {
    color: '#212121',
    fontSize: 18,
    fontWeight: '700',
  },
  functionFormula: {
    color: '#616161',
    fontSize: 15,
    marginTop: 4,
  },
  expertNote: {
    color: '#757575',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default CourseScreen;
