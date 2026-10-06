import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Polyline } from 'react-native-svg';

/**
 * GraphView — Renders a mathematical function graph using react-native-svg.
 *
 * Draws a coordinate plane with grid lines, axes, and the function curve.
 * Handles discontinuities (e.g. 1/x) and domain restrictions (e.g. ln(x))
 * by breaking the polyline at jump points.
 *
 * @param {object} func - Function definition { id, name, label, fn, domain, range, color }
 * @param {number} [width=150] - SVG width in pixels
 * @param {number} [height=150] - SVG height in pixels
 * @param {boolean} [showLabel=false] - Whether to display the function label below the graph
 */
const GraphView = ({ func, width = 150, height = 150, showLabel = false }) => {
  const { domain, range, color, label, fn } = func;

  // --- Coordinate mapping: mathematical → SVG ---
  const toSvgX = (x) => ((x - domain[0]) / (domain[1] - domain[0])) * width;
  const toSvgY = (y) => height - ((y - range[0]) / (range[1] - range[0])) * height;

  // --- Grid lines at integer values ---
  const gridLines = [];
  for (let x = Math.ceil(domain[0]); x <= Math.floor(domain[1]); x += 1) {
    gridLines.push({ type: 'v', pos: toSvgX(x) });
  }
  for (let y = Math.ceil(range[0]); y <= Math.floor(range[1]); y += 1) {
    gridLines.push({ type: 'h', pos: toSvgY(y) });
  }

  // --- Sample the function and build polyline segments ---
  const numPoints = 300;
  const step = (domain[1] - domain[0]) / numPoints;
  const rangeSpan = range[1] - range[0];
  const discontinuityThreshold = rangeSpan * 0.4;

  const segments = [];
  let currentSegment = [];

  for (let i = 0; i <= numPoints; i += 1) {
    const x = domain[0] + i * step;
    const y = fn(x);

    if (!isFinite(y) || Number.isNaN(y)) {
      // Break at NaN / Infinity
      if (currentSegment.length > 1) segments.push(currentSegment);
      currentSegment = [];
      continue;
  }

    const svgX = toSvgX(x);
    const svgY = toSvgY(y);

    // Detect discontinuity: large jump between consecutive points
    if (
      currentSegment.length > 0 &&
      Math.abs(y - currentSegment[currentSegment.length - 1].mathY) >
        discontinuityThreshold
    ) {
      if (currentSegment.length > 1) segments.push(currentSegment);
      currentSegment = [];
    }

    currentSegment.push({ x: svgX, y: svgY, mathY: y });
  }
  if (currentSegment.length > 1) segments.push(currentSegment);

  // --- Axes visibility ---
  const originX = toSvgX(0);
  const originY = toSvgY(0);
  const showYAxis = originX >= 0 && originX <= width;
  const showXAxis = originY >= 0 && originY <= height;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Background */}
        <Rect x="0" y="0" width={width} height={height} fill="#FAFAFA" rx="4" />

        {/* Grid lines */}
        {gridLines.map((line, i) =>
          line.type === 'v' ? (
            <Line
              key={`v-${i}`}
              x1={line.pos}
              y1="0"
              x2={line.pos}
              y2={height}
              stroke="#E0E0E0"
              strokeWidth="1"
            />
          ) : (
            <Line
              key={`h-${i}`}
              x1="0"
              y1={line.pos}
              x2={width}
              y2={line.pos}
              stroke="#E0E0E0"
              strokeWidth="1"
            />
          )
        )}

        {/* Axes */}
        {showXAxis && (
          <Line
            x1="0"
            y1={originY}
            x2={width}
            y2={originY}
            stroke="#9E9E9E"
            strokeWidth="1.5"
          />
        )}
        {showYAxis && (
          <Line
            x1={originX}
            y1="0"
            x2={originX}
            y2={height}
            stroke="#9E9E9E"
            strokeWidth="1.5"
          />
        )}

        {/* Function graph segments */}
        {segments.map((segment, i) => {
          const pointsStr = segment.map((p) => `${p.x},${p.y}`).join(' ');
          return (
            <Polyline
              key={`seg-${i}`}
              points={pointsStr}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
      </Svg>
      {showLabel && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#616161',
  },
});

export default GraphView;
