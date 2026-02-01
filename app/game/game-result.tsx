import LocationViewer from "@/components/LocationViewer";
import { Colors } from "@/constants/theme";
import { GameResults } from "@/models/models";
import { listenGameResultsByRoom } from "@/services/FirebaseService";
import { Answer } from "@/services/ScoreService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
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
  const { roomId, userId, currentRound } = useLocalSearchParams<{
    roomId: string;
    userId: string;
    currentRound: string;
  }>();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [correctYear, setCorrectYear] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [gameResults, setGameResults] = useState<GameResults[]>([]);
  const scaleNext = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!roomId || !userId || !currentRound) return;
    const unsubscribe = listenGameResultsByRoom(
      roomId,
      parseInt(currentRound),
      (data) => {
        setGameResults(data);
        sortToHighestScore();
      },
    );
    return () => unsubscribe();
  }, [roomId, currentRound]);

  useEffect(() => {
    setAnswerForRound(parseInt(currentRound));
  }, [currentRound]);

  const setAnswerForRound = async (round: number) => {
    const answers: Answer = {
      year: 1889,
      lat: 48.8584,
      lng: 2.2945,
    };
    setCorrectYear(answers.year);
    setLocation({ lat: answers.lat, lng: answers.lng });
  };

  const goNext = () => {
    const round = parseInt(currentRound) + 1;
    router.navigate(
      `/game/game-board?roomId=${roomId}&userId=${userId}&currentRound=${round}`,
    );
  };

  const sortToHighestScore = () => {
    gameResults.sort((a, b) => b.totalMarks - a.totalMarks);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Text style={[styles.roundText, { color: theme.text }]}>
        {`Round ${currentRound} Results`}
      </Text>

      {/* Correct Location */}
      <Text style={styles.correctYearText}>Correct Location</Text>

      {/* Result Card */}
      <View style={[styles.card]}>
        <View style={styles.contentRow}>
          <LocationViewer initialLocation={location} textColor={theme.text} />
        </View>
      </View>

      <View style={styles.timeline}>
        <Text style={styles.correctYearText}>Correct Year</Text>
        <Text style={styles.correctYear}>{correctYear}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Players Scores
      </Text>

      <ScrollView
        style={styles.scoreList}
        contentContainerStyle={styles.scoreListContent}
        showsVerticalScrollIndicator={false}
      >
        {gameResults.map((player, index) => (
          <View
            key={index}
            style={[
              styles.scoreItem,
              { backgroundColor: theme.card },
              index == 0 && styles.activePlayer,
            ]}
          >
            <View style={styles.playerInfo}>
              {index == 0 && <Text style={styles.crown}>👑</Text>}
              <Text style={[styles.playerText, { color: theme.text }]}>
                {player.playerName}
              </Text>
            </View>

            <Text style={[styles.scoreText, { color: theme.text }]}>
              {player.totalMarks} (+{player.marks})
            </Text>
          </View>
        ))}
      </ScrollView>

      <Animated.View style={{ transform: [{ scale: scaleNext }] }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            animateAndNavigate(scaleNext, () => router.replace("/"))
          }
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

const animateAndNavigate = (
  animatedValue: Animated.Value,
  callback: () => void,
) => {
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
    padding: 5,
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

  scoreList: {
    maxHeight: 220,
  },
  scoreListContent: {
    paddingBottom: 8,
  },
});
