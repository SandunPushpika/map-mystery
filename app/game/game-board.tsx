import HeaderBar from "@/components/HeaderBar";
import RoundImage from "@/components/RoundImage";
import YearSlider from "@/components/YearSlider";
import { Colors } from "@/constants/theme";
import { GameSettings } from "@/models/models";
import { getData } from "@/services/FirebaseService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

export default function GameBoard() {
  const colorScheme = useColorScheme();
  const colorStyle = colorScheme == "dark" ? Colors.dark : Colors.light;
  const { roomId, userId } = useLocalSearchParams<{
    roomId: string;
    userId: string;
  }>();

  const [gameSettings, setGameSettings] = useState<GameSettings | null>();
  const [round, setRound] = useState<number | null>(null);
  const [totalRounds, setTotalRounds] = useState(5);
  const [timeleft, setTime] = useState(30);
  const [year, setYear] = useState(1900);

  useEffect(() => {
    if (timeleft === 0) {
      nextRound();
      setTime(30);
    }

    const timer = setInterval(() => {
      setTime(timeleft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeleft, round]);

  useEffect(() => {
    fetchGameSettings();
  }, []);

  function nextRound() {
    if (round! < totalRounds) {
      setRound(round! + 1);
    }
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
    setRound(1);
    console.log("Game Settings:", existingSettigns);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colorStyle.background }]}
    >
      <HeaderBar
        current={round || 1}
        total={totalRounds}
        color={colorStyle.text}
        timeleft={timeleft}
        colorStyle={colorStyle}
      />
      <RoundImage />
      <Text style={[styles.label, { color: colorStyle.text }]}>
        Year & Location Guess
      </Text>
      <YearSlider
        year={year}
        textcolor={colorStyle.text}
        tintcolor={colorStyle.tint}
        onYearChange={(year) => setYear(year)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
});
