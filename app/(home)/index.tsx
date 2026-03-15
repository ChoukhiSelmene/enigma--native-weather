import CityList from "@/components/CityList/CityList";
import { City } from "@/constants/City";
import { colorSheet } from "@/constants/Weather";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [cityList, setCityList] = useState([] as City[]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    async function loadCities() {
      let result = await fetch(
        "https://geocoding-api.open-meteo.com/v1/search?name=" + term,
      );
      let data = await result.json();
      setCityList(data.results);
    }
    loadCities();
  }, [term]);

  return (
    <View style={styles.cityListView}>
      <CityList
        fullCityList={cityList}
        onSearch={(value: string) => setTerm(value)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  cityListView: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colorSheet.day.background,
    paddingTop: 50,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
});
