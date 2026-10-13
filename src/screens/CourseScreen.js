import React, { useRef, useState } from 'react';
import { Animated, PanResponder, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GraphView from '../components/GraphView';
import { LEVELS } from '../data/functions';

const THUMB_SIZE = 46;

const CourseScreen = ({ onBack }) => {
  const scrollViewRef = useRef(null);
  const sectionOffsets = useRef([]);
  const activeLevelIndexRef = useRef(0);
  const scrollYRef = useRef(0);
  const maxScrollRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const railHeightRef = useRef(0);
  const dragStartYRef = useRef(0);
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const thumbPosition = useRef(new Animated.Value(0)).current;

  const updateActiveLevel = (scrollY) => {
    let visibleLevelIndex = 0;

    sectionOffsets.current.forEach((offset, index) => {
      if (offset !== undefined && offset <= scrollY + 120) {
        visibleLevelIndex = index;
      }
    });

    if (visibleLevelIndex !== activeLevelIndexRef.current) {
      activeLevelIndexRef.current = visibleLevelIndex;
      setActiveLevelIndex(visibleLevelIndex);
    }
  };

  const updateScrollPosition = (scrollY) => {
    const boundedScrollY = Math.max(0, Math.min(maxScrollRef.current, scrollY));
    scrollYRef.current = boundedScrollY;
    scrollViewRef.current?.scrollTo({ y: boundedScrollY, animated: false });

    const travel = Math.max(0, railHeightRef.current - THUMB_SIZE);
    const scrollRatio = maxScrollRef.current > 0 ? boundedScrollY / maxScrollRef.current : 0;
    thumbPosition.setValue(scrollRatio * travel);
    updateActiveLevel(boundedScrollY);
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    scrollYRef.current = scrollY;
    const travel = Math.max(0, railHeightRef.current - THUMB_SIZE);
    const scrollRatio = maxScrollRef.current > 0 ? scrollY / maxScrollRef.current : 0;
    thumbPosition.setValue(scrollRatio * travel);
    updateActiveLevel(scrollY);
  };

  const handleRailLayout = (event) => {
    railHeightRef.current = event.nativeEvent.layout.height;
    maxScrollRef.current = Math.max(0, contentHeightRef.current - viewportHeightRef.current);
    const travel = Math.max(0, railHeightRef.current - THUMB_SIZE);
    const scrollRatio = maxScrollRef.current > 0 ? scrollYRef.current / maxScrollRef.current : 0;
    thumbPosition.setValue(scrollRatio * travel);
  };

  const handleScrollLayout = (event) => {
    viewportHeightRef.current = event.nativeEvent.layout.height;
    maxScrollRef.current = Math.max(0, contentHeightRef.current - viewportHeightRef.current);
  };

  const panResponderRef = useRef(null);
  if (!panResponderRef.current) {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const travel = Math.max(1, railHeightRef.current - THUMB_SIZE);
        const currentThumbY = (maxScrollRef.current > 0
          ? scrollYRef.current / maxScrollRef.current
          : 0) * travel;
        const touchY = event.nativeEvent.locationY;
        const isTouchingThumb = touchY >= currentThumbY && touchY <= currentThumbY + THUMB_SIZE;
        const thumbY = isTouchingThumb
          ? currentThumbY
          : Math.max(0, Math.min(travel, touchY - THUMB_SIZE / 2));

        dragStartYRef.current = thumbY;
        setIsDragging(true);
        updateScrollPosition((thumbY / travel) * maxScrollRef.current);
      },
      onPanResponderMove: (_, gestureState) => {
        const travel = Math.max(1, railHeightRef.current - THUMB_SIZE);
        const thumbY = Math.max(
          0,
          Math.min(travel, dragStartYRef.current + gestureState.dy)
        );
        updateScrollPosition((thumbY / travel) * maxScrollRef.current);
      },
      onPanResponderRelease: () => setIsDragging(false),
      onPanResponderTerminate: () => setIsDragging(false),
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    });
  }

  const panHandlers = panResponderRef.current.panHandlers;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.85}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cours : les fonctions</Text>
      </View>

      <View style={styles.contentRow}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.courseScroll}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          onLayout={handleScrollLayout}
          onContentSizeChange={(_, contentHeight) => {
            contentHeightRef.current = contentHeight;
            maxScrollRef.current = Math.max(0, contentHeight - viewportHeightRef.current);
            const travel = Math.max(0, railHeightRef.current - THUMB_SIZE);
            const scrollRatio = maxScrollRef.current > 0 ? scrollYRef.current / maxScrollRef.current : 0;
            thumbPosition.setValue(scrollRatio * travel);
          }}
          scrollEventThrottle={16}
        >
          {LEVELS.map((level, index) => (
            <View
              key={level.id}
              style={styles.levelSection}
              onLayout={(event) => {
                sectionOffsets.current[index] = event.nativeEvent.layout.y;
              }}
            >
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

        <View style={styles.levelRail} onLayout={handleRailLayout} {...panHandlers}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.sliderThumb,
              { transform: [{ translateY: thumbPosition }] },
            ]}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel="Navigation dans le cours"
            accessibilityValue={{ text: LEVELS[activeLevelIndex].name }}
          >
            <Text style={styles.thumbArrows}>⌃</Text>
            <Text style={[styles.thumbArrows, styles.thumbArrowDown]}>⌄</Text>
          </Animated.View>
          {isDragging && LEVELS.map((level, index) => {
            const maxPosition = Math.max(0, railHeightRef.current - THUMB_SIZE);
            const sectionOffset = sectionOffsets.current[index] || 0;
            const positionRatio = maxScrollRef.current > 0
              ? Math.min(1, sectionOffset / maxScrollRef.current)
              : 0;

            return (
              <View
                key={level.id}
                pointerEvents="none"
                style={[
                  styles.levelTooltip,
                  { top: Math.max(0, Math.min(maxPosition, positionRatio * maxPosition)) + 12 },
                  activeLevelIndex === index && styles.levelTooltipActive,
                ]}
              >
                <Text
                  style={[
                    styles.levelTooltipText,
                    activeLevelIndex === index && styles.levelTooltipTextActive,
                  ]}
                >
                  {level.name}
                </Text>
              </View>
            );
          }
          )}
        </View>
      </View>
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
  header: {
    marginBottom: 14,
  },
  contentRow: {
    flex: 1,
    position: 'relative',
  },
  courseScroll: {
    flex: 1,
    paddingRight: 42,
  },
  levelRail: {
    position: 'absolute',
    right: -14,
    top: 0,
    bottom: 8,
    width: 50,
    alignItems: 'center',
    zIndex: 5,
  },
  sliderThumb: {
    position: 'absolute',
    left: 2,
    top: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: 'rgba(28, 30, 34, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 2,
  },
  thumbArrows: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 19,
    height: 19,
    textAlign: 'center',
  },
  thumbArrowDown: {
    marginTop: -4,
  },
  levelTooltip: {
    position: 'absolute',
    right: THUMB_SIZE + 8,
    backgroundColor: 'rgba(244, 244, 246, 0.82)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    zIndex: 3,
    elevation: 4,
    minWidth: 108,
    alignItems: 'flex-end',
  },
  levelTooltipActive: {
    backgroundColor: '#F4F4F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  levelTooltipText: {
    color: 'rgba(36, 38, 42, 0.68)',
    fontSize: 13,
    fontWeight: '700',
  },
  levelTooltipTextActive: {
    color: '#24262A',
    fontSize: 15,
    fontWeight: '800',
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
