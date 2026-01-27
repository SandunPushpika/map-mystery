import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import db from "@/configs/firebase";
import { Room, User } from "@/models/models";
import { saveData } from "@/services/FirebaseService";
import * as Crypto from "expo-crypto";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function JoinRoom() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "dark"];
  const [error, setError] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { player } = useLocalSearchParams<{ player: string }>();

  const onJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const roomsRef = collection(db, "rooms");
      const q = query(
        roomsRef,
        where("roomCode", "==", roomCode.trim().toUpperCase()),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No room found with that code");
        setIsLoading(false);
        return;
      }

      const room = querySnapshot.docs[0].data() as Room;
      const userId = Crypto.randomUUID();
      const user: User = {
        id: userId,
        nickname: player?.trim() || "Player",
        joinedAt: new Date(),
      };
      await saveData("users", user);
      router.navigate(
        `/game/lobby?id=${room.id}&userId=${userId}&roomCode=${room.roomCode}`,
      );
    } catch (err) {
      setError("Unable to connect to room. Please try again.");
      console.error("Error joining room:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.tint} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Join a Room</Text>
          <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>
            Enter the room code shared by the host
          </Text>

          {/* Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.label, { color: theme.text }]}>Room Code</Text>

            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: error ? "#ff0000" : theme.border,
                },
              ]}
            >
              <Ionicons
                name="key-outline"
                size={20}
                color={theme.tabIconDefault}
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder="G4T7R3"
                placeholderTextColor={theme.tabIconDefault}
                value={roomCode}
                onChangeText={(text) => {
                  setRoomCode(text);
                  setError("");
                }}
                editable={!isLoading}
                autoCapitalize="characters"
                style={[styles.input, { color: theme.text }]}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isLoading
                    ? theme.tabIconDefault
                    : theme.button,
                },
              ]}
              activeOpacity={0.9}
              onPress={onJoinRoom}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Join Room</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  /* Header */
  header: {
    height: 48,
    justifyContent: "center",
  },

  /* Content */
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    fontFamily: Fonts.sans,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 32,
    fontFamily: Fonts.sans,
    textAlign: "center",
  },

  /* Card */
  card: {
    width: "100%",
    maxWidth: 420,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: Fonts.sans,
    letterSpacing: 0.6,
  },

  inputWrapper: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.sans,
    letterSpacing: 1.2,
  },

  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginBottom: 16,
    fontFamily: Fonts.sans,
  },

  button: {
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts.rounded,
    letterSpacing: 0.6,
  },
});
