import { colorSheet, getWeatherInfos, WeatherInfos } from "@/constants/Weather";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function DayLabel({
  hour,
  temperature,
  weatherCode,
}: {
  hour: number;
  temperature: number;
  weatherCode: number;
}) {
  const [weatherInfos, setWeatherInfos] = useState<WeatherInfos>({
    label: "",
    imageSource: require("@/assets/images/weather-icons/sunny 1.png"),
    colors: colorSheet.day,
  });

  useEffect(() => {
    setWeatherInfos(getWeatherInfos(weatherCode));
  }, []);
  return (
    <View style={styles.dayLabelContainer}>
      <Text style={styles.dayLabelText}>{temperature.toFixed(1)}°C</Text>
      <Image style={styles.dayLabelImage} source={weatherInfos.imageSource} />
      <Text style={styles.dayLabelText}>{hour}h</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  dayLabelContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  dayLabelText: {
    color: "white",
    fontSize: 16,
  },
  dayLabelImage: {
    width: 50,
    height: 50,
    marginVertical: 5,
  },
});
