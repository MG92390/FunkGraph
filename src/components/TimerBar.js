import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * TimerBar — A horizontal progress bar that counts down from `totalTime` to 0.
 *
 * The bar changes color as time runs out:
 *   - Green  (> 50% remaining)
 *   - Yellow (20–50% remaining)
 *   - Red    (< 20% remaining)
 *
 * @param {number} timeRemaining - Seconds left in the current round
 * @param {number} [totalTime=30] - Total seconds for the round
 */
const TimerBar = ({ timeRemaining, totalTime = 30 }) => {
  const percentage = Math.max(0, (timeRemaining / totalTime) * 100);

  let barColor = '#4CAF50'; // green
  if (percentage <= 20) barColor = '#F44336'; // red
  else if (percentage <= 50) barColor = '#FF9800'; // orange

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      <Text style={styles.text}>{Math.ceil(timeRemaining)}s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  track: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    transition: 'width 0.3s ease',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },
});

export default TimerBar;
