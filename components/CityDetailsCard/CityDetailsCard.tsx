import { City } from "@/constants/City";
import { Fonts } from "@/constants/theme";
import {
  colorSheet,
  getWeatherInfos,
  WeatherInfos,
  WeatherResponse,
} from "@/constants/Weather";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import {
  BadgeCheck,
  CirclePlus,
  CloudDrizzle,
  Droplet,
  Wind,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DayLabel from "../DayLabel/DayLabel";

export default function CityDetailsCard({
  cityDetails,
  cityName,
}: {
  cityDetails: WeatherResponse;
  cityName: string;
}) {
  const [saved, setSaved] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfos>({
    label: "",
    imageSource: require("@/assets/images/weather-icons/sunny 1.png"),
    colors: colorSheet.day,
  });

  useEffect(() => {
    const checkIfSaved = async () => {
      const storage = createAsyncStorage("favoriteCities");
      const result = await storage.getItem("favoriteCities");
      const cityList = result ? JSON.parse(result) : ([] as City[]);
      console.log(cityList);
      for (let city of cityList) {
        if (
          city.latitude === cityDetails.latitude &&
          city.longitude === cityDetails.longitude
        ) {
          setSaved(true);
          return;
        }
      }
      setSaved(false);

      setWeatherInfo(
        getWeatherInfos(
          cityDetails.current.weather_code,
          cityDetails.current.is_day,
        ),
      );
    };
    checkIfSaved();
  }, [cityDetails]);

  async function handleToggleContact() {
    const storage = createAsyncStorage("favoriteCities");
    const result = await storage.getItem("favoriteCities");
    const cityList = result ? JSON.parse(result) : ([] as City[]);
    console.log(cityList);

    const currentCity: City = {
      name: cityName,
      latitude: cityDetails.latitude,
      longitude: cityDetails.longitude,
    };
    if (saved) {
      let newCityList = [];
      for (let city of cityList) {
        if (
          city.latitude !== currentCity.latitude ||
          city.longitude !== currentCity.longitude
        ) {
          newCityList.push(city);
        }
      }
      await storage.setItem("favoriteCities", JSON.stringify(newCityList));
      setSaved(false);
    } else {
      cityList.push(currentCity);
      await storage.setItem("favoriteCities", JSON.stringify(cityList));
      setSaved(true);
    }
  }

  return (
    <ScrollView style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.cityName}>{cityName}</Text>
        <Pressable onPress={handleToggleContact}>
          {saved ? (
            <BadgeCheck
              size={35}
              color={"white"}
              fill={saved ? "#FFD700" : "none"}
              absoluteStrokeWidth
            />
          ) : (
            <CirclePlus size={35} color={"white"} />
          )}
        </Pressable>
      </View>
      <View style={styles.hero}>
        <Image source={weatherInfo.imageSource} style={styles.image} />
        <Text style={styles.temperature}>
          {cityDetails.current.temperature_2m.toFixed(1)}°C
        </Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{weatherInfo.label}</Text>
          <View style={styles.minMaxContainer}>
            <Text style={styles.description}>
              Max: {cityDetails.daily.temperature_2m_max[0].toFixed(1)}°C
            </Text>
            <Text style={styles.description}>
              Min: {cityDetails.daily.temperature_2m_min[0].toFixed(1)}°C
            </Text>
          </View>
        </View>
        <View style={styles.principalInfos}>
          <View style={styles.principalInfosLabel}>
            <CloudDrizzle size={17} color={"white"} />
            <Text style={styles.description}>
              {cityDetails.daily.precipitation_probability_max[0]}%
            </Text>
          </View>
          <View style={styles.principalInfosLabel}>
            <Droplet size={17} color={"white"} />
            <Text style={styles.description}>
              {cityDetails.current.relative_humidity_2m}%
            </Text>
          </View>
          <View style={styles.principalInfosLabel}>
            <Wind size={17} color={"white"} />{" "}
            <Text style={styles.description}>
              {cityDetails.current.wind_speed_10m.toFixed(1)} km/h
            </Text>
          </View>
        </View>
        <View style={styles.dailyWeatherContainer}>
          <View style={styles.dailyWeatherHeader}>
            <Text>Today</Text>
            <Text>Mar,9</Text>
          </View>
          <ScrollView horizontal={true} style={styles.dailyWeatherDayLabels}>
            {cityDetails.hourly.time.map((time, index) => {
              const hour = new Date(time).getHours();
              const temperature = cityDetails.hourly.temperature_2m[index];
              const weatherCode = cityDetails.hourly.weather_code[index];
              return (
                <DayLabel
                  key={index}
                  hour={hour}
                  temperature={temperature}
                  weatherCode={weatherCode}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    // borderWidth: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
    // marginTop: 30,
  },
  content: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 30,
    paddingHorizontal: 15,
    paddingTop: 50,

    backgroundColor: colorSheet.day.background,
    // borderWidth: 1,
    // borderRadius: 8,
  },
  cityName: {
    fontSize: 35,
    fontWeight: "bold",
    fontFamily: Fonts.rounded,
    color: "white",
  },
  hero: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    aspectRatio: 1,
  },
  temperature: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  descriptionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
  },
  description: {
    color: "white",
    fontSize: 13,
    textAlign: "center",
  },
  minMaxContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  principalInfos: {
    backgroundColor: colorSheet.day.cardBackground,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 40,
    marginTop: 20,
    padding: 10,
    borderRadius: 30,
  },
  principalInfosLabel: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  dailyWeatherContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 20,
    paddingBottom: 20,
  },
  dailyWeatherHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  dailyWeatherDayLabels: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
  },
});
