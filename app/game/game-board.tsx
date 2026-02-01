import HeaderBar from "@/components/HeaderBar";
import LocationPicker from "@/components/LocationPicker";
import RoundImage from "@/components/RoundImage";
import YearSlider from "@/components/YearSlider";
import { Colors } from "@/constants/theme";
import { GameResults, GameSettings } from "@/models/models";
import {
  getData,
  getGameResultsByUser,
  saveData,
} from "@/services/FirebaseService";
import { Answer, calculateFinalScore, Guess } from "@/services/ScoreService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

export default function GameBoard() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colorStyle = colorScheme == "dark" ? Colors.dark : Colors.light;
  const { roomId, userId, currentRound } = useLocalSearchParams<{
    roomId: string;
    userId: string;
    currentRound: string;
  }>();

  const [gameSettings, setGameSettings] = useState<GameSettings | null>();
  const [round, setRound] = useState<number | null>(null);
  const [totalRounds, setTotalRounds] = useState(5);
  const [timeleft, setTime] = useState(30);
  const [year, setYear] = useState<number | undefined>();

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (timeleft === 0) {
      navigateToResults();
      return;
    }

    const timer = setInterval(() => {
      setTime(timeleft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeleft]);

  useEffect(() => {
    fetchGameSettings();
  }, []);

  function nextRound() {
    if (round! < totalRounds) {
      setRound(round! + 1);
    }
  }

  async function navigateToResults() {
    await saveGameResults();
    router.navigate(
      `/game/game-result?roomId=${roomId}&userId=${userId}&currentRound=${currentRound}`,
    );
  }

  const fetchGameSettings = async () => {
    const existingSettigns = await getData("gameSettings", roomId);
    if (!existingSettigns) {
      setGameSettings({
        id: roomId,
        mode: "Year & Location Guess",
        rounds: 5,
        timer: true,
        roomId: roomId,
      });
      return;
    }
    setGameSettings(existingSettigns as GameSettings);
    setTotalRounds(existingSettigns.rounds);
    console.log("Game Settings:", existingSettigns);
  };

  const saveGameResults = async () => {
    const guess: Guess = {
      year: year,
      lat: location ? location.lat : 0,
      lng: location ? location.lng : 0,
    };
    console.log("Player Guess:", guess);
    const answer = await getAnswerForRound(parseInt(currentRound) || 1);
    console.log("Answer for round:", answer);

    const { total } = calculateFinalScore(
      guess,
      answer,
      gameSettings?.mode === "Location Only",
    );

    const fullTotal = await getTotalMarks(total);

    const player = await getData("users", userId);

    const result: GameResults = {
      userId: userId,
      playerName: player?.nickname || "Unknown Player",
      roomId: roomId,
      round: parseInt(currentRound) || 1,
      yearGuess: year || 0,
      lat: location?.lat || 0,
      lng: location?.lng || 0,
      marks: total,
      totalMarks: fullTotal,
    };
    await saveData("gameResults", result);
  };

  const getTotalMarks = async (currentMarks: number) => {
    if (currentRound === "1") return currentMarks;

    const qResults = await getGameResultsByUser(
      roomId,
      parseInt(currentRound) - 1,
      userId,
    );
    if (!qResults) return currentMarks;

    return ((qResults as any).totalMarks || 0) + currentMarks;
  };

  const getAnswerForRound = async (round: number) => {
    const answer: Answer = {
      year: 1990,
      lat: 10,
      lng: 20,
    };
    return answer;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colorStyle.background }]}
    >
      <HeaderBar
        current={parseInt(currentRound) || 1}
        total={totalRounds}
        color={colorStyle.text}
        timeleft={timeleft}
        colorStyle={colorStyle}
      />

      <RoundImage />

      <Text style={[styles.modeTitle, { color: colorStyle.text }]}>
        Guess the Year & Location
      </Text>

      {gameSettings?.mode === "Year & Location Guess" && (
        <YearSlider
          year={year || 1900}
          textcolor={colorStyle.text}
          tintcolor={colorStyle.tint}
          onYearChange={setYear}
        />
      )}

      <LocationPicker
        textColor={colorStyle.text}
        onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
      />

      {location && (
        <Text style={[styles.coords, { color: colorStyle.text }]}>
          Selected: {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 12,
    textAlign: "center",
  },
  coords: {
    marginTop: 8,
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
  },
});
