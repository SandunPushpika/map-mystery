import { RelativePathString, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function Index() {
  const router = useRouter();

  const onLoginBtnClicked = (path: string) => {
    router.navigate(path as RelativePathString);
  }

  return (
    <View>
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        gap: 20
      }}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => onLoginBtnClicked("/login")}>
          <Text style={{color: 'white'}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => onLoginBtnClicked("/game/lobby")}>
          <Text style={{color: 'white'}}>lobby</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => onLoginBtnClicked("/create-room")}>
          <Text style={{color: 'white'}}>create-room</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => onLoginBtnClicked("/game/game-board")}>
          <Text style={{color: 'white'}}>game-board</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => onLoginBtnClicked("/game/game-result")}>
          <Text style={{color: 'white'}}>game-result</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => onLoginBtnClicked("/join-room")}>
          <Text style={{color: 'white'}}>join-room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 7
  }
});