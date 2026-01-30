import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

type Props = {
  onLocationSelect: (lat: number, lng: number) => void;
  textColor: string;
};

export default function LocationPicker({ onLocationSelect, textColor }: Props) {
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const onMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    onLocationSelect(latitude, longitude);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>
        Tap on the map to guess the location
      </Text>

      <MapView
        style={styles.map}
        onPress={onMapPress}
        initialRegion={{
          latitude: 20,
          longitude: 0,
          latitudeDelta: 100,
          longitudeDelta: 100,
        }}
      >
        {marker && <Marker coordinate={marker} />}
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
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
  },
});
