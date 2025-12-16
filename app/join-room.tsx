import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color={theme.tint} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Join a Room
          </Text>
        </View>

        {/* Room Code */}
        <View
          style={[
            styles.codeWrapper,
            {
              borderColor: theme.tint,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <View style={[styles.codeInner, { backgroundColor: theme.card }]}>
            <Text style={[styles.roomCode, { color: theme.text }]}>G4T7R3</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Nickname */}
          <Text style={[styles.label, { color: theme.text }]}>
            Your Nickname
          </Text>

          <TextInput
            placeholder="AwesomePlayer"
            placeholderTextColor={theme.tabIconDefault}
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
          />

          {/* Join Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>
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

  headerTitle: {
    position: "absolute",
    alignSelf: "center",
    fontSize: 28,
    fontWeight: "700",
    fontFamily: Fonts.sans,
  },

  /* Room Code */
  codeWrapper: {
    marginTop: 50,
    borderWidth: 2,
    borderRadius: 16,
    padding: 6,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  codeInner: {
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
  },

  roomCode: {
    fontSize: 32,
    letterSpacing: 4,
    fontFamily: Fonts.mono,
    fontWeight: "600",
  },

  /* Bottom Section */
  bottomSection: {
    marginBottom: 24,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: Fonts.sans,
  },

  input: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.sans,
    marginBottom: 20,
  },

  button: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.rounded,
  },
});
