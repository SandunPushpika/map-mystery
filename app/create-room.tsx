import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

export default function CreateRoom() {
    const colorStyle = Colors.dark; // Always use dark mode colors
    const [nickname, setNickname] = useState("");

    return (
        <KeyboardAvoidingView
            style={[styles.root, { backgroundColor: colorStyle.background }]}
            behavior={Platform.select({ ios: "padding", default: "height" })}
        >
            <View style={styles.container}>
                {/* Title */}
                <Text style={[styles.title, { color: colorStyle.tint }]}>MapMystery</Text>

                <View style={styles.spacer} />

                {/* Button Container Box */}
                <View style={[styles.buttonBox, { backgroundColor: colorStyle.card }]}>
                    {/* Primary Button - Create Room */}
                    <Pressable
                        onPress={() => console.log("Create Room pressed")}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            { backgroundColor: "#67E8F9" },
                            pressed && styles.buttonPressed,
                        ]}
                        accessibilityLabel="Create Room"
                    >
                        <Text style={styles.primaryButtonText}>Create Room</Text>
                    </Pressable>

                    {/* Secondary Button - Join Room */}
                    <Pressable
                        onPress={() => console.log("Join Room pressed")}
                        style={({ pressed }) => [
                            styles.secondaryButton,
                            { 
                                borderColor: "#67E8F9",
                                backgroundColor: "transparent",
                                opacity: pressed ? 0.7 : 1 
                            },
                        ]}
                        accessibilityLabel="Join Room"
                    >
                        <Text style={[styles.secondaryButtonText, { color: colorStyle.text }]}>Join Room</Text>
                    </Pressable>

                    {/* Input Field */}
                    <TextInput
                        value={nickname}
                        onChangeText={setNickname}
                        placeholder="Enter Nickname"
                        placeholderTextColor={colorStyle.tabIconDefault}
                        style={[styles.input, { 
                            backgroundColor: "transparent", 
                            color: colorStyle.text,
                            borderColor: "#67E8F9" 
                        }]}
                        returnKeyType="done"
                    />
                </View>

                <View style={styles.bottomSpacer} />

                {/* How to Play Link */}
                <Pressable onPress={() => console.log("How to Play pressed")}>
                    <Text style={[styles.linkText, { color: colorStyle.tint }]}>How to Play</Text>
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
        backgroundColor: "#0F172A",
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 40,
        fontWeight: "700",
        letterSpacing: 0,
        marginBottom: 20,
        textAlign: "center",
    },
    spacer: {
        height: 100,
    },
    buttonBox: {
        width: "100%", 
        maxWidth: 400,
        paddingVertical: 28,
        paddingHorizontal: 28,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButton: {
        width: "100%",
        paddingVertical: 18,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },
    secondaryButton: {
        width: "100%",
        paddingVertical: 16,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        marginBottom: 16,
    },
    secondaryButtonText: {
        fontSize: 20,
        fontWeight: "700",
    },
    input: {
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 28,
        fontSize: 16,
        borderWidth: 2,
        textAlign: "center",
    },
    bottomSpacer: {
        flex: 1,
    },
    linkText: {
        fontSize: 16,
        fontWeight: "400",
        textDecorationLine: "underline",
        marginBottom: 40,
    },
});