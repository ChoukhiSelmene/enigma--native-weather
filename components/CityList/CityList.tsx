import { City } from "@/constants/City";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { CircleX, Search } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import CityCard from "../CityCard/CityCard";
import FavoriteCity from "../FavoriteCity/FavoriteCity";

export default function CityList({
  fullCityList,
  onSearch,
}: {
  fullCityList: City[];
  onSearch: (value: string) => void;
}) {
  const inputRef = useRef<TextInput>(null);

  const [favoriteCities, setFavoriteCities] = useState<City[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const storage = createAsyncStorage("favoriteCities");
      const result = await storage.getItem("favoriteCities");
      const cityList = result ? JSON.parse(result) : ([] as City[]);
      console.log(cityList);
      setFavoriteCities(cityList);
    };
    loadFavorites();
  }, []);

  return (
    <>
      <View style={styles.searchBar}>
        <Search style={styles.searchIcon} color={"white"} absoluteStrokeWidth />
        <TextInput
          style={styles.searchField}
          onChangeText={(value) => onSearch(value)}
          placeholderTextColor="#888"
          placeholder="Search for a city..."
          ref={inputRef}
        />
        <Pressable
          onPress={() => {
            inputRef.current?.clear();
            onSearch("");
          }}
          style={styles.searchIcon}
        >
          <CircleX color={"white"} />
        </Pressable>
      </View>
      <ScrollView horizontal={true} style={styles.dailyWeatherDayLabels}>
        {favoriteCities.map((city, index) => (
          <FavoriteCity
            key={`favorite-${city.latitude}-${city.longitude}-${index}`}
            city={city}
          />
        ))}
      </ScrollView>
      <ScrollView
        style={styles.userList}
        contentContainerStyle={styles.scrollContent}
      >
        {fullCityList
          ? fullCityList.map((city: City, index: number) => (
              <CityCard
                key={`city-list-${city.latitude}-${city.longitude}-${index}`}
                city={city}
              />
            ))
          : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  userList: {
    marginTop: 10,
  },
  scrollContent: {
    gap: 10,
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#606060",
    borderRadius: 30,
    marginTop: 30,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 8,
  },
  searchField: {
    color: "white",
    width: "90%",
  },
  searchIcon: {
    alignSelf: "center",
  },
  dailyWeatherDayLabels: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    maxHeight: 140,
  },
});
