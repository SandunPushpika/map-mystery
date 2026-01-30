import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Props = {
  initialLocation: {
    lat: number;
    lng: number;
  };
  textColor: string;
};

export default function LocationViewer({ initialLocation, textColor }: Props) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        pointerEvents="none"
        initialRegion={{
          latitude: initialLocation.lat,
          longitude: initialLocation.lng,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        <Marker
          coordinate={{
            latitude: initialLocation.lat,
            longitude: initialLocation.lng,
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  map: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: "hidden",
  },
});
