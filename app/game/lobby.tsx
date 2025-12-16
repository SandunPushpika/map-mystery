import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

    // Mock data to match the design image
    const roomCode = "G4T7R3";
    const settings = {
        mode: "Year & Location Guess",
        rounds: 5,
        timer: "Enabled",
    };
    const players = [
        { id: 1, name: "Player 1 (Host)", isHost: true },
        { id: 2, name: "Player 2", isHost: false },
        { id: 3, name: "Player 3", isHost: false },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#22D3EE" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rommmom Lobby</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Room Code Display */}
                <View style={styles.roomCodeContainer}>
                    <Text style={styles.roomCodeText}>{roomCode}</Text>
                    <TouchableOpacity style={styles.copyButton}>
                        <View style={styles.iconBadge}>
                            <Ionicons name="resize-outline" size={16} color="#0f172a" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Game Settings */}
                <Text style={styles.sectionTitle}>Game Settings</Text>
                <View style={styles.settingsCard}>
                    <Text style={styles.settingRow}>
                        Mode: <Text style={styles.settingValue}>{settings.mode}</Text>
                    </Text>
                    <Text style={styles.settingRow}>
                        Rounds: <Text style={styles.settingValue}>{settings.rounds}</Text>
                    </Text>
                    <Text style={styles.settingRow}>
                        Timer: <Text style={styles.settingValue}>{settings.timer}</Text>
                    </Text>
                </View>

                {/* Players List */}
                <View style={styles.playerSection}>
                    {players.map((player) => (
                        <View key={player.id} style={styles.playerRow}>
                            <Text style={styles.playerName}>{player.name}</Text>
                            {player.isHost && (
                                <MaterialCommunityIcons name="crown" size={20} color="#F59E0B" />
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Footer Actions */}
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
        position: 'relative',
    },
    roomCodeText: {
        fontSize: 40,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 2,
    },
    copyButton: {
        position: 'absolute',
        right: 20,
    },
    iconBadge: {
        backgroundColor: '#67e8f9',
        padding: 4,
        borderRadius: 4
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
    settingRow: {
        color: "#94A3B8", // Slate 400
        fontSize: 15,
        marginBottom: 8,
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
});
