import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Slider from '@react-native-community/slider';

interface YearSliderProps {
    year: number;
    textcolor: string;
    tintcolor: string;
    onYearChange: (year: number) => void;
}

const MIN_YEAR = 1840;
const MAX_YEAR = 2020;
const STEP_YEAR = 30;

const YearSlider = (props: YearSliderProps) => {

  const labels = [];
  for(let year = MIN_YEAR; year <= MAX_YEAR; year += STEP_YEAR){
    labels.push(year);
  }

  return (
    <View>
      <Text style={[styles.year, { color: props.textcolor }]}>{props.year}</Text>
        <Slider
            value={props.year}
            onValueChange={props.onYearChange}
            minimumValue={MIN_YEAR}
            maximumValue={MAX_YEAR}
            minimumTrackTintColor={props.tintcolor}
            maximumTrackTintColor="#94A3B8"
            step={1}
            thumbTintColor={props.tintcolor}
        />
        <View style={styles.checkpointsContainer}>
            {labels.map((year) => (
                <Text key={year} style={styles.checkpoint}>{year}</Text>
            ))}
        </View>
    </View>
  )
}

export default YearSlider

const styles = StyleSheet.create({
    year: {
        fontSize: 26,
        fontWeight: '700',
        marginVertical: 8
    },
    checkpointsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4
    },
    checkpoint: {
        fontSize: 12,
        color: '#64748B'
    }
});