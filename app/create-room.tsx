import { Colors } from "@/constants/theme";
import { Room, User } from "@/models/models";
import { saveData } from "@/services/FirebaseService";
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

  const createUser = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const userId = crypto.randomUUID();
      const channelId = crypto.randomUUID();

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

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colorStyle.background }]}
      behavior={Platform.select({ ios: "padding", default: "height" })}
    >
      <View style={styles.container}>
        {/* Title */}
        <Text style={[styles.title, { color: colorStyle.tint }]}>
          MapMystery
        </Text>
        <Text style={styles.subtitle}>
          Play. Guess. Outsmart.
        </Text>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: colorStyle.card }]}>
          {/* Nickname */}
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="Your nickname"
            placeholderTextColor={colorStyle.tabIconDefault}
            style={[
              styles.input,
              {
                color: colorStyle.text,
                borderColor: "#67E8F9",
              },
            ]}
            editable={!isLoading}
          />

          {/* Create Room */}
          <Pressable
            onPress={createUser}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: "#67E8F9",
                opacity: pressed || isLoading ? 0.85 : 1,
              },
            ]}
          >
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.primaryButtonText}>
                  Creating room...
                </Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Create Room</Text>
            )}
          </Pressable>

          {/* Join Room */}
          <Pressable
            disabled={isLoading}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: "#67E8F9",
                opacity: pressed || isLoading ? 0.6 : 1,
              },
            ]}
          >
            <Text style={[styles.secondaryButtonText, { color: "#67E8F9" }]}>
              Join Room
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Pressable>
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
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 42,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 40,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    padding: 28,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  input: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 24,
    fontSize: 16,
    borderWidth: 2,
    marginBottom: 20,
    textAlign: "center",
  },

  primaryButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },

  linkText: {
    marginTop: 32,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
