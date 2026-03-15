import { City } from "@/constants/City";
import { colorSheet, getWeatherInfos } from "@/constants/Weather";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface CurrentPreview {
  temperature_2m: number;
  weather_code: number;
  is_day: number;
}

export default function FavoriteCity({ city }: { city: City }) {
  const [currentPreview, setCurrentPreview] = useState<CurrentPreview | null>(
    null,
  );

  useEffect(() => {
    async function loadCityDetails() {
      let result = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`,
      );
      let data = await result.json();
      setCurrentPreview(data.current ?? null);
    }

    loadCityDetails();
  }, [city.latitude, city.longitude]);

  const weatherInfo = getWeatherInfos(
    currentPreview?.weather_code ?? 0,
    currentPreview?.is_day ?? 1,
  );

  return (
    <Pressable
      onPress={() => {
        router.push(`/${city.name}/${city.latitude}/${city.longitude}`);
      }}
    >
      <View style={styles.favoriteCard}>
        <Text style={styles.cityName}>{city.name}</Text>
        <Image source={weatherInfo.imageSource} style={styles.weatherIcon} />
        <Text style={styles.temperature}>
          {currentPreview
            ? `${currentPreview.temperature_2m.toFixed(1)}°C`
            : "--°C"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  favoriteCard: {
    width: 100,
    height: 120,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colorSheet.day.cardBackground,
    borderRadius: 20,
  },
  weatherBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  temperature: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  weatherIcon: {
    width: 34,
    height: 34,
  },
});
