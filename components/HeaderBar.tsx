import { ColorVariation } from '@/constants/theme';
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Timer from './Timer';

interface RoundTextProps {
  current: number;
  total: number;
  color: string;
  timeleft: number;
  colorStyle: ColorVariation;
}

const RoundText = (props: RoundTextProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, {color: props.color}]}>Round {props.current} of {props.total}</Text>
      <Timer time={props.timeleft} color={props.colorStyle.tint}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  text: {
    fontSize: 16,
    fontWeight: '600'
  }
});

export default RoundText