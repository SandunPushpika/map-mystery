import { Colors, Fonts } from "@/constants/theme";
import { Room, User } from "@/models/models";
import { saveData } from "@/services/FirebaseService";
import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CreateRoom() {
  const colorStyle = Colors.dark;
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const createUser = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const userId = Crypto.randomUUID();
      const channelId = Crypto.randomUUID();

      const user: User = {
        id: userId,
        nickname: nickname.trim() || "Player",
        joinedAt: new Date(),
      };

      const room: Room = {
        id: channelId,
        roomCode: channelId.slice(0, 6).toUpperCase(),
        creatorId: userId,
        createdAt: new Date(),
      };

      await saveData("users", user);
      await saveData("rooms", room);

      router.navigate(
        `/game/lobby?id=${room.id}&userId=${user.id}&roomCode=${room.roomCode}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onJoinRoom = () => {
    if (isLoading) return;

    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    setError("");
    router.navigate(`/join-room?player=${nickname.trim()}`);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colorStyle.background }]}
      behavior={Platform.select({ ios: "padding", default: "height" })}
    >
      <View style={styles.container}>
        {/* Brand */}
        <View style={styles.brand}>
          <Text style={[styles.title, { color: colorStyle.tint }]}>
            MapMystery
          </Text>
          <Text style={[styles.subtitle, { color: colorStyle.tabIconDefault }]}>
            Play. Guess. Outsmart.
          </Text>
        </View>

        {/* Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colorStyle.card,
              borderColor: colorStyle.border,
            },
          ]}
        >
          {/* Nickname */}
          <Text style={[styles.label, { color: colorStyle.text }]}>
            Nickname
          </Text>

          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: error ? "#ff0000" : colorStyle.border,
              },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={colorStyle.tabIconDefault}
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={nickname}
              onChangeText={(text) => {
                setNickname(text);
                setError("");
              }}
              placeholder="Your nickname"
              placeholderTextColor={colorStyle.tabIconDefault}
              style={[styles.input, { color: colorStyle.text }]}
              editable={!isLoading}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Create Room */}
          <Pressable
            onPress={createUser}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colorStyle.tint,
                opacity: pressed || isLoading ? 0.85 : 1,
              },
            ]}
          >
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.primaryButtonText}>Creating room...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Create Room</Text>
            )}
          </Pressable>

          {/* Join Room */}
          <Pressable
            onPress={onJoinRoom}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: colorStyle.tint,
                opacity: pressed || isLoading ? 0.6 : 1,
              },
            ]}
          >
            <Text
              style={[styles.secondaryButtonText, { color: colorStyle.tint }]}
            >
              Join Existing Room
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Pressable style={{ marginTop: 24 }}>
          <Text style={[styles.linkText, { color: colorStyle.tint }]}>
            How to Play
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  /* Brand */
  brand: {
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    fontFamily: Fonts.sans,
    letterSpacing: 0.6,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 6,
    fontFamily: Fonts.sans,
    letterSpacing: 0.4,
  },

  /* Card */
  card: {
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: Fonts.sans,
    letterSpacing: 0.5,
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
  },

  errorText: {
    fontSize: 12,
    color: "#ff0000",
    marginBottom: 14,
    fontFamily: Fonts.sans,
  },

  /* Buttons */
  primaryButton: {
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts.rounded,
    letterSpacing: 0.5,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  secondaryButton: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    marginTop: 14,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: Fonts.sans,
    letterSpacing: 0.4,
  },

  /* Footer */
  linkText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
});
