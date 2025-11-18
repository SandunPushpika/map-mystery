import { Colors } from "@/constants/theme";
import { Text, useColorScheme, View } from "react-native";

export default function GameResult(){
    const colorScheme = useColorScheme();
    const colorStyle = colorScheme == "dark" ? Colors.dark : Colors.light;
    
    return(
        <View>
            <Text style={{color: colorStyle.text}}>GameResult Text</Text>
        </View>
    );
}