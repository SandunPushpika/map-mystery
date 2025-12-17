import { View, Image, StyleSheet } from 'react-native'
import React from 'react'

const RoundImage = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/game_image_001.jpg')}
        style={styles.image}/>
    </View>
  )
}

export default RoundImage

const styles = StyleSheet.create({
  container: {
    height: 250,
    marginTop: 16
  },
    image: {
       height: "100%", 
       width: "100%",
       resizeMode: "cover",
       borderRadius: 12
    }
});