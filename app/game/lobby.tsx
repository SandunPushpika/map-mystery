import db from "@/configs/firebase";
import { Room, User } from "@/models/models";
import ChannelService from "@/services/ChannelService";
import {
  deleteData,
  getData,
  getDocumentReference,
  listenToGameSettings,
  saveData,
} from "@/services/FirebaseService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import PubNub from "pubnub";
import React, { useEffect, useState } from "react";
import {
  Alert,
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

  const [players, setPlayers] = useState<any[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [showSettingsEdit, setShowSettingsEdit] = useState(false);
  const [settings, setSettings] = useState({
    mode: "Year & Location Guess",
    rounds: 5,
    timer: true,
  });

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        const roomData = await getData("rooms", id!);
        console.log("Fetched room data:", roomData, id);
        if (!roomData) {
          router.back();
          return;
        }

        const typedRoom: Room = {
          id: id!,
          roomCode: roomData.roomCode,
          creatorId: roomData.creatorId,
          createdAt: roomData.createdAt,
        };
        console.log("Creator and user ID:", roomData.creatorId, userId);
        setRoom(typedRoom);
        setIsHost(roomData.creatorId === userId);

        console.log("Fetching user data...");

        let userData = await getData("users", userId!);
        if (!userData) {
          const newUser: User = {
            id: userId!,
            nickname: "Player",
            joinedAt: new Date(),
          };
          await saveData("users", newUser);
          userData = newUser;
        }

        const typedUser: User = {
          id: userId!,
          nickname: userData.nickname,
          joinedAt: userData.joinedAt,
        };
        setCurrentUser(typedUser);

        const pubnub = ChannelService.getChannelConnection(
          userId!,
          id!,
          handlePresenceEvent,
          async () => {
            console.log("Channel connection established");
            setConnectionError("");
            await fetchPlayerList(id!, typedRoom);
          },
          (error: string) => {
            console.error("Channel connection error:", error);
            setConnectionError(error);
          },
        );

        await fetchPlayerList(id!, typedRoom);

        return () => {
          cleanupUserSession(userId!);
          ChannelService.closeChannelConnection();
        };
      } catch (error) {
        console.error("Error initializing room:", error);
        Alert.alert("Error", "Failed to initialize room");
        router.back();
      }
    };

    if (id && userId) {
      console.log("Initializing room lobby...");
      initializeRoom();
      console.log("Room lobby initialized.");
    }

    return () => {
      if (userId) {
        console.log("Cleaning up user session...");
        cleanupUserSession(userId);
      }
    };
  }, [id, userId]);

  useEffect(() => {
    const saveUserSession = async () => {
      if (!id || !userId) return;

      try {
        const sessionData = {
          roomId: id,
          userId: userId,
          joinedAt: new Date(),
        };

        const roomSessionsRef = collection(db, "roomSessions");
        const q = query(
          roomSessionsRef,
          where("roomId", "==", id),
          where("userId", "==", userId),
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await saveData("roomSessions", sessionData);
          console.log("User session saved to Firebase");
        }
      } catch (error) {
        console.error("Error saving user session:", error);
      }
    };

    saveUserSession();
  }, [id, userId]);

  useEffect(() => {
    const unsubscribe = listenToGameSettings(id!, (gameSettingsData) => {
      console.log("Received game settings update:", gameSettingsData);
      if (gameSettingsData) {
        setSettings({
          mode: gameSettingsData.mode || "Year & Location Guess",
          rounds: gameSettingsData.rounds || 5,
          timer:
            gameSettingsData.timer !== undefined
              ? gameSettingsData.timer
              : true,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const saveGameSettings = async (newSettings: typeof settings) => {
    if (!isHost || !id) return;

    try {
      const existingSettings = await getData("gameSettings", id!);

      if (existingSettings) {
        const settingsRef = await getDocumentReference("gameSettings", id!);
        await updateDoc(settingsRef!, newSettings);
      } else {
        await saveData("gameSettings", {
          ...newSettings,
          roomId: id!,
          id: id!,
        });
      }

      console.log("Game settings saved to Firebase");
      setConnectionError("");
    } catch (error) {
      console.error("Error saving game settings:", error);
      setConnectionError("Failed to save settings");
    }
  };

  const handlePresenceEvent = (
    presence: PubNub.SubscriptionObject.Presence,
  ) => {
    console.log("Presence event:", presence);
    if (room) fetchPlayerList(id!, room);
  };

  const fetchPlayerList = async (roomId: string, currentRoom: Room) => {
    try {
      const roomSessionsRef = collection(db, "roomSessions");
      const q = query(roomSessionsRef, where("roomId", "==", roomId));
      const querySnapshot = await getDocs(q);

      const playerList = [];

      for (const docSnapshot of querySnapshot.docs) {
        const sessionData = docSnapshot.data();
        try {
          const userData = await getData("users", sessionData.userId);
          console.log(currentRoom);

          playerList.push({
            id: sessionData.userId,
            name: userData?.nickname || "Unknown",
            isHost: currentRoom?.creatorId === userData!.id,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          playerList.push({
            id: sessionData.userId,
            name: "Unknown",
            isHost: currentRoom?.creatorId === sessionData.userId,
          });
        }
      }

      setPlayers(playerList);
    } catch (error) {
      console.error("Error fetching player list:", error);
    }
  };

  const cleanupUserSession = async (currentUserId: string) => {
    try {
      if (!id) return;

      const roomSessionsRef = collection(db, "roomSessions");
      const q = query(
        roomSessionsRef,
        where("roomId", "==", id),
        where("userId", "==", currentUserId),
      );
      const querySnapshot = await getDocs(q);

      for (const docSnapshot of querySnapshot.docs) {
        await deleteData("roomSessions", docSnapshot.id);
      }
    } catch (error) {
      console.error("Error cleaning up user session:", error);
    }
  };

  const handleStartGame = () => {
    if (!isHost) {
      Alert.alert("Error", "Only the host can start the game");
      return;
    }

    if (players.length < 2) {
      Alert.alert("Error", "At least 2 players are required to start");
      return;
    }

    router.navigate(
      `/game/game-board?roomId=${id}&userId=${userId}&roomCode=${roomCode}`,
    );
  };

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
              onPress={async () => {
                if (showSettingsEdit) {
                  // Save settings when clicking checkmark
                  await saveGameSettings(settings);
                }
                setShowSettingsEdit(!showSettingsEdit);
              }}
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
        {connectionError && (
          <Text style={styles.errorText}>{connectionError}</Text>
        )}
        <TouchableOpacity
          style={[
            styles.startButton,
            {
              opacity: isHost && players.length >= 2 ? 1 : 0.5,
            },
          ]}
          onPress={handleStartGame}
          disabled={!isHost || players.length < 2}
        >
          <Text style={styles.startButtonText}>
            {isHost ? "Start Game" : "Waiting for Host..."}
          </Text>
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
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
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
