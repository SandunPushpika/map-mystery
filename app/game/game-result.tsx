import { Colors } from "@/constants/theme";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Player = {
  name: string;
  score: number;
  diff: number;
  isHost?: boolean;
};

export default function GameResult() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  /* ---------------- GAME DATA ---------------- */
  const years = [1880, 1900, 1920, 1950, 1960, 1980, 2010, 2020];
  const correctYear = 1905;

  const [selectedYearIndex, setSelectedYearIndex] = useState(2);
  const selectedYear = years[selectedYearIndex];

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [earnedScore, setEarnedScore] = useState<number | null>(null);

  const players: Player[] = [
    { name: "Player 1 (Host)", score: 250, diff: 100, isHost: true },
    { name: "Player 2", score: 180, diff: 80 },
    { name: "Player 3", score: 50, diff: 50 },
  ];

  /* ---------------- SCORE LOGIC ---------------- */
  const submitGuess = () => {
    const distance = Math.abs(selectedYear - correctYear);
    const score = Math.max(0, 100 - distance);

    setEarnedScore(score);
    setIsSubmitted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /* ---------------- NAV BUTTON ANIMATION ---------------- */
  const scaleNext = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    Animated.sequence([
      Animated.timing(scaleNext, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleNext, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => router.push("/"));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Text style={[styles.roundText, { color: theme.text }]}>
        Round 1 Results
      </Text>

      {/* Correct Location */}
            <Text style={styles.correctYearText}>Correct Location & Year</Text>

      {/* Result Card */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.contentRow}>
          <View style={styles.textBlock}>
            <Text style={[styles.location, { color: theme.text }]}>
              Paris, France
            </Text>
            <Text style={styles.year}>
              {isSubmitted ? correctYear : selectedYear}
            </Text>
          </View>

          <Image
            source={{
              uri: "https://maps.googleapis.com/maps/api/staticmap?center=Paris,France&zoom=12&size=300x300&markers=color:red|Paris,France",
            }}
            style={styles.mapImage}
          />
        </View>
      </View>

      {/* TIMELINE */}
      <View style={styles.timeline}>
        <Text style={styles.correctYearText}>Correct Location & Year</Text>
        <Text style={styles.correctYear}>
          {isSubmitted ? correctYear : selectedYear}
        </Text>

        <View style={styles.yearsRow}>
          {years.map((year) => (
            <Text key={year} style={styles.yearLabel}>
              {year}
            </Text>
          ))}
        </View>

        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={years.length - 1}
          step={1}
          value={selectedYearIndex}
          disabled={isSubmitted}
          minimumTrackTintColor="#6ED3E9"
          maximumTrackTintColor="#2A2F45"
          thumbTintColor={isSubmitted ? "#555" : "#6ED3E9"}
          onValueChange={(value) => {
            if (!isSubmitted) {
              setSelectedYearIndex(value);
              Haptics.selectionAsync();
            }
          }}
        />
      </View>

      {/* SUBMIT */}
      {!isSubmitted && (
        <TouchableOpacity style={styles.submitButton} onPress={submitGuess}>
          <Text style={styles.submitText}>Submit Guess</Text>
        </TouchableOpacity>
      )}

      {/* RESULT */}
      {isSubmitted && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            You were off by {Math.abs(selectedYear - correctYear)} years
          </Text>
          <Text style={styles.scoreEarned}>+{earnedScore} Points</Text>
        </View>
      )}

      {/* PLAYERS */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Players Scores
      </Text>

      {players.map((player, index) => (
        <View
          key={index}
          style={[
            styles.scoreItem,
            { backgroundColor: theme.card },
            player.isHost && styles.activePlayer,
          ]}
        >
          <View style={styles.playerInfo}>
            {player.isHost && <Text style={styles.crown}>👑</Text>}
            <Text style={[styles.playerText, { color: theme.text }]}>
              {player.name}
            </Text>
          </View>

          <Text style={[styles.scoreText, { color: theme.text }]}>
            {player.score} (+{player.diff})
          </Text>
        </View>
      ))}

      <Animated.View style={{ transform: [{ scale: scaleNext }] }}>
        <TouchableOpacity
  style={styles.backButton}
  onPress={() => animateAndNavigate(scaleNext, () => router.replace("/"))}
>
  <Text style={styles.backButtonText}>Back to Home</Text>
</TouchableOpacity>

      </Animated.View>

      <Animated.View style={{ transform: [{ scale: scaleNext }] }}>
        <TouchableOpacity style={styles.button} onPress={goNext}>
          <Text style={styles.buttonText}>Continue to Next Round</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const animateAndNavigate = (animatedValue: Animated.Value, callback: () => void) => {
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start(callback);
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  roundText: { fontSize: 20, fontWeight: "700", marginBottom: 10 },

  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },

  contentRow: { flexDirection: "row", alignItems: "center" },

  textBlock: { flex: 1 },

  location: { fontSize: 20, fontWeight: "700" },

  year: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F5A623",
    marginTop: 6,
  },

  mapImage: { width: 120, height: 120, borderRadius: 16 },

  timeline: { marginBottom: 24 },

  correctYearText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  correctYear: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },

  yearsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  yearLabel: { fontSize: 11, color: "#8A8F9E" },

  submitButton: {
    backgroundColor: "#F5A623",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  submitText: { fontSize: 16, fontWeight: "700", color: "#000" },

  resultBox: {
    backgroundColor: "#1E2235",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  resultText: { color: "#8A8F9E", fontSize: 13 },

  scoreEarned: {
    color: "#6ED3E9",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  scoreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  activePlayer: { borderColor: "#F5A623", borderWidth: 1.5 },

  playerInfo: { flexDirection: "row", alignItems: "center" },

  crown: { marginRight: 6 },

  playerText: { fontSize: 14, fontWeight: "600" },

  scoreText: { fontSize: 14, fontWeight: "600" },

  button: {
    marginTop: "auto",
    backgroundColor: "#6ED3E9",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  backButton: {
    marginTop: "auto",
    borderWidth: 1.5,
    borderColor: "#6ED3E9",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6ED3E9",
  },

  buttonText: { fontSize: 16, fontWeight: "600", color: "#000" },
});
