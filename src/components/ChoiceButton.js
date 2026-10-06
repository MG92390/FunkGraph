import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import GraphView from './GraphView';

/**
 * ChoiceButton — A tappable button that displays a function graph.
 *
 * Displays the graph with GraphView so it renders consistently on mobile and Web.
 *
 * Visual states:
 *   - Default: light gray border
 *   - Selected (before answer): border colored with the function's color
 *   - Correct (after answer revealed): green border + green overlay
 *   - Incorrect (after answer revealed): red border + red overlay
 *
 * @param {object} func - Function definition to display
 * @param {function} onPress - Callback when the button is tapped
 * @param {boolean} isSelected - Whether this choice is currently selected
 * @param {boolean} isCorrect - Whether this choice is the correct answer
 * @param {boolean} showResult - Whether to reveal correct/incorrect state
 * @param {boolean} disabled - Whether the button is disabled
 * @param {number} [size=150] - Graph dimensions (square)
 */
const ChoiceButton = ({
  func,
  onPress,
  isSelected = false,
  isCorrect = false,
  showResult = false,
  disabled = false,
  size = 150,
}) => {
  let borderColor = '#E0E0E0';
  let overlayColor = null;

  if (showResult) {
    if (isCorrect) {
      borderColor = '#4CAF50';
      overlayColor = 'rgba(76, 175, 80, 0.1)';
    } else if (isSelected) {
      borderColor = '#F44336';
      overlayColor = 'rgba(244, 67, 54, 0.1)';
    }
  } else if (isSelected) {
    borderColor = func.color;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || showResult}
      style={[
        styles.button,
        {
          borderColor,
          borderWidth: isSelected || showResult ? 3 : 1,
          width: size + 12,
          height: size + 12,
        },
      ]}
    >
      <View
        style={[
          styles.graphContainer,
          { backgroundColor: overlayColor || '#FFFFFF' },
        ]}
      >
        <GraphView func={func} width={size} height={size} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: 4,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  graphContainer: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChoiceButton;
