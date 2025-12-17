import { View, Text, StyleSheet} from 'react-native'
import React from 'react'

interface TimerProps {
    time: number;
    color: string;
}
const Timer = (props: TimerProps) => {
  return (
    <View style={[styles.container, {borderColor: props.color}]}>
      <Text style={{color: props.color}}>{props.time}s</Text>
    </View>
  )
}

export default Timer

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 2,
        borderRadius: 17,
    }
});