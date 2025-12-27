import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Lobby() {
  const router = useRouter();
  const { id, userId, roomCode } = useLocalSearchParams<{
    id: string;
    userId: string;
    roomCode: string;
  }>();

  const isHost = true; // later replace with real host logic

  const [showSettingsEdit, setShowSettingsEdit] = React.useState(false);
  const [settings, setSettings] = React.useState({
    mode: "Year & Location Guess",
    rounds: 5,
    timer: true,
  });

  const players = [
    { id: 1, name: "Player 1 (Host)", isHost: true },
    { id: 2, name: "Player 2", isHost: false },
    { id: 3, name: "Player 3", isHost: false },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#22D3EE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Room Lobby</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Room Code */}
        <View style={styles.roomCodeContainer}>
          <Text style={styles.roomCodeText}>{roomCode}</Text>
          <TouchableOpacity style={styles.copyButton}>
            <View style={styles.iconBadge}>
              <Ionicons name="resize-outline" size={16} color="#0f172a" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Game Settings Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Game Settings</Text>

          {isHost && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowSettingsEdit(!showSettingsEdit)}
            >
              <Ionicons
                name={showSettingsEdit ? "checkmark" : "pencil"}
                size={16}
                color="#22D3EE"
              />
              <Text style={styles.editText}>
                {showSettingsEdit ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Settings Card */}
        <View style={styles.settingsCard}>
          {/* Mode */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Mode</Text>

            {showSettingsEdit ? (
              <TouchableOpacity
                style={styles.selector}
                onPress={() =>
                  setSettings((prev) => ({
                    ...prev,
                    mode:
                      prev.mode === "Year & Location Guess"
                        ? "Location Only"
                        : "Year & Location Guess",
                  }))
                }
              >
                <Text style={styles.selectorText}>{settings.mode}</Text>
                <Ionicons name="chevron-down" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ) : (
              <Text style={styles.settingValue}>{settings.mode}</Text>
            )}
          </View>

          {/* Rounds */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Rounds</Text>

            {showSettingsEdit ? (
              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() =>
                    setSettings((prev) => ({
                      ...prev,
                      rounds: Math.max(1, prev.rounds - 1),
                    }))
                  }
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={26}
                    color="#22D3EE"
                  />
                </TouchableOpacity>

                <Text style={styles.counterValue}>{settings.rounds}</Text>

                <TouchableOpacity
                  onPress={() =>
                    setSettings((prev) => ({
                      ...prev,
                      rounds: Math.min(10, prev.rounds + 1),
                    }))
                  }
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={26}
                    color="#22D3EE"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.settingValue}>{settings.rounds}</Text>
            )}
          </View>

          {/* Timer */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Timer</Text>

            {showSettingsEdit ? (
              <TouchableOpacity
                onPress={() =>
                  setSettings((prev) => ({ ...prev, timer: !prev.timer }))
                }
                style={[
                  styles.toggle,
                  { backgroundColor: settings.timer ? "#22D3EE" : "#334155" },
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    settings.timer && { alignSelf: "flex-end" },
                  ]}
                />
              </TouchableOpacity>
            ) : (
              <Text style={styles.settingValue}>
                {settings.timer ? "Enabled" : "Disabled"}
              </Text>
            )}
          </View>
        </View>

        {/* Players */}
        <View style={styles.playerSection}>
          {players.map((player) => (
            <View key={player.id} style={styles.playerRow}>
              <Text style={styles.playerName}>{player.name}</Text>
              {player.isHost && (
                <MaterialCommunityIcons
                  name="crown"
                  size={20}
                  color="#F59E0B"
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
        <Text style={styles.statusText}>{players.length} Players Ready</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // Dark blue/slate background
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  roomCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    borderWidth: 2,
    borderColor: "#F59E0B", // Orange/Gold border
    borderRadius: 16,
    marginBottom: 32,
    backgroundColor: "#0F172A", // Transparent or matches bg
    position: "relative",
  },
  roomCodeText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  copyButton: {
    position: "absolute",
    right: 20,
  },
  iconBadge: {
    backgroundColor: "#67e8f9",
    padding: 4,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: "#1E293B", // Darker card background
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  settingValue: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  playerSection: {
    gap: 12,
  },
  playerRow: {
    backgroundColor: "#1E293B", // Card-like input style
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  playerName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#67E8F9", // Cyan 300/400
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#67E8F9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusText: {
    color: "#64748B", // Slate 500
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editText: {
    color: "#22D3EE",
    fontWeight: "600",
  },

  settingLabel: {
    color: "#94A3B8",
    fontSize: 14,
  },

  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  selectorText: {
    color: "#E5E7EB",
    fontWeight: "600",
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  counterValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E5E7EB",
  },

  toggle: {
    width: 46,
    height: 26,
    borderRadius: 20,
    padding: 3,
  },

  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#0F172A",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
});
