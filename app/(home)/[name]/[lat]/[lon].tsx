import CityDetailsCard from "@/components/CityDetailsCard/CityDetailsCard";
import { WeatherResponse } from "@/constants/Weather";
import { useLocalSearchParams } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function CityDetails({
  params,
}: {
  params: { name: string; lat: string; lon: string };
}) {
  const { name, lat, lon } = useLocalSearchParams();
  const [cityDetails, setCityDetails] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    async function loadCity() {
      let result = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=7`,
      );
      let data = await result.json();
      setCityDetails(data);
    }
    console.log(name);
    loadCity();
  }, [name, lat, lon]);
  return (
    <View style={styles.container}>
      {cityDetails ? (
        <CityDetailsCard cityDetails={cityDetails} cityName={name} />
      ) : (
        <LoaderCircle />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
