import HeaderBar from "@/components/HeaderBar";
import RoundImage from "@/components/RoundImage";
import YearSlider from "@/components/YearSlider";
import { Colors } from "@/constants/theme";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

export default function GameBoard(){
    const colorScheme = useColorScheme();
    const colorStyle = colorScheme == "dark" ? Colors.dark : Colors.light;

    //props used in RoundText
    const [round, setRound] = useState(1);
    const [totalRounds] = useState(5);

    //props used in Timer(timeleft-current time value, setTime-function to update time value)
    const [timeleft, setTime] = useState(30);   

    //props used in YearSlider(year-current year value, onYearChange-function to update year value)
    const [year, setYear] = useState(1900);

    useEffect(() => {
        if(timeleft === 0){
            return;
        }

        const timer = setInterval(() => {
            setTime(timeleft - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeleft]);

    function nextRound(){
        if(round < totalRounds){
            setRound(round + 1);
        }
    }
    
    return(
        <View style={[styles.container, {backgroundColor: colorStyle.background}]}>
            <HeaderBar current={round} total={totalRounds} color={colorStyle.text} timeleft={timeleft} colorStyle={colorStyle}/>
            <RoundImage/>
        <Text style={[styles.label, {color: colorStyle.text}]}>Year & Location Guess</Text>
        <YearSlider
            year={year}
            textcolor={colorStyle.text}
            tintcolor={colorStyle.tint}
            onYearChange={(year) => setYear(year)}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12
    }
});