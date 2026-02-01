import { Image, StyleSheet, View } from "react-native";

type RoundImageProps = {
  driveLink: string;
};

const RoundImage = ({ driveLink }: RoundImageProps) => {
  const getDriveImageUrl = (url: string) => {
    const match = url.match(/\/d\/([^/]+)/);
    if (!match) return url;

    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: getDriveImageUrl(driveLink) }}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    marginTop: 16,
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    borderRadius: 12,
  },
});

export default RoundImage;
