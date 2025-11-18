import { Colors } from "@/constants/theme";
import { Text, useColorScheme, View } from "react-native";

export default function Login(){
    const colorScheme = useColorScheme();
    const colorStyles = colorScheme === "dark" ? Colors.dark : Colors.light;

    return(
        <View>
            <Text style={{color: colorStyles.text}}>Login View</Text>
        </View>
    );
}