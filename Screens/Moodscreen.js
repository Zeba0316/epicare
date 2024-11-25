import React, { useState, useRef } from 'react'
import { View, Text, SafeAreaView, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import Svg, { Path, Circle } from 'react-native-svg'

const { width } = Dimensions.get('window')
const CIRCLE_LENGTH = width - 32 // Padding on both sides
const CIRCLE_RADIUS = CIRCLE_LENGTH / 2
const INDICATOR_SIZE = 24

const MOODS = [
  { value: 0, label: 'Terrible', color: '#FF6B6B', emoji: '😫' },
  { value: 1, label: 'Bad', color: '#FF9F69', emoji: '😞' },
  { value: 2, label: 'Neutral', color: '#FFD93D', emoji: '😐' },
  { value: 3, label: 'Good', color: '#95D86E', emoji: '😊' },
  { value: 4, label: 'Excellent', color: '#4CAF50', emoji: '😄' },
]

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default function Moodscreen() {
  const [currentMood, setCurrentMood] = useState(2)
  const progress = useRef(new Animated.Value(0.5)).current // Start at neutral

  const MoodMeter = () => {
    return (
      <Svg width={width} height={CIRCLE_RADIUS + 60}>
      {/* Background Arc */}
      <Path
        d={`
          M ${width * 0.05} ${CIRCLE_RADIUS + 40}
          A ${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 0 1 ${width * 0.95} ${CIRCLE_RADIUS + 40}
        `}
        stroke="#E5E7EB"
        strokeWidth={50} // Increased for better visibility
        fill="none"
      />

      {/* Colored Segments */}
      {MOODS.map((mood, index) => (
        <Path
          key={mood.value}
          d={`
            M ${width * 0.05 + (index * (width * 0.9)) / 5} ${CIRCLE_RADIUS + 40}
            A ${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 0 1 ${
            width * 0.05 + ((index + 1) * (width * 0.9)) / 5
          } ${CIRCLE_RADIUS + 40}
          `}
          stroke={mood.color}
          strokeWidth={50} // Increased for better visibility
          fill="none"
        />
      ))}

      {/* Indicator */}
      <AnimatedCircle
        cx={progress.interpolate({
          inputRange: [0, 1],
          outputRange: [width * 0.05, width * 0.95], // Adjusted to match the arc
        })}
        cy={CIRCLE_RADIUS + 40}
        r={INDICATOR_SIZE / 2}
        fill="#1F2937"
      />
    </Svg>
    )
  }

  const CurrentMoodEmoji = () => (
    <View style={{ 
      width: 96, 
      height: 96, 
      borderRadius: 48, 
      backgroundColor: '#FFD93D', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <Text style={{ fontSize: 48 }}>{MOODS[currentMood].emoji}</Text>
    </View>
  )

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newProgress = Math.max(0, Math.min(1, 0.5 + gestureState.dx / CIRCLE_LENGTH))
        progress.setValue(newProgress)
        const moodIndex = Math.round(newProgress * 4)
        setCurrentMood(moodIndex)
      },
    })
  ).current

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="moon" size={24} color="#6B7280" />
          <Text style={{ marginLeft: 12, fontSize: 18, fontWeight: '500', color: '#1F2937' }}>Assessment</Text>
        </View>
        <View style={{ paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#F3F4F6', borderRadius: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>1 OF 7</Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1F2937', marginBottom: 48 }}>
          How would you describe your mood?
        </Text>

        <View style={{ alignItems: 'center' }}>
          <CurrentMoodEmoji />
          <Text style={{ marginTop: 16, fontSize: 18, color: '#4B5563' }}>
            I Feel {MOODS[currentMood].label}.
          </Text>
        </View>

        <View style={{ marginTop: 48 }} {...panResponder.panHandlers}>
          <MoodMeter />
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity 
        style={{
          marginHorizontal: 24,
          marginBottom: 24,
          backgroundColor: '#6B4CE6',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}