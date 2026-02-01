import { Asset } from "expo-asset";

export type Place = {
  id: number;
  link: string;
  name: string;
  year: number;
  longitude: number;
  latitude: number;
};

export const loadPlaces = async (): Promise<Place[]> => {
  const response = await fetch(
    Asset.fromModule(require("../assets/csv/locations.csv")).uri,
  );
  const text = await response.text();

  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");

    return {
      id: Number(values[0]),
      link: values[1],
      name: values[2],
      year: Number(values[3]),
      longitude: Number(values[4]),
      latitude: Number(values[5]),
    };
  });
};
