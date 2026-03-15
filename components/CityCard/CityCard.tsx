import { City } from "@/constants/City";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CityCard({ city }: { city: City }) {
  const isFocused = useIsFocused();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIfSaved = async () => {
      const result = await AsyncStorage.getItem("contacts");
      const contactList = result ? JSON.parse(result) : [];
      const isSaved = contactList.some(
        (contact: City) => contact.id === city.id,
      );
      setSaved(isSaved);
    };

    if (isFocused) {
      checkIfSaved();
    }
  }, [city.id, isFocused]);

  //   async function handleToggleContact() {
  //     const result = await AsyncStorage.getItem("contacts");
  //     const contactList = result ? JSON.parse(result) : [];

  //     if (saved) {
  //       // Remove from contacts
  //       const filtered = contactList.filter(
  //         (contact: City) => contact.id !== city.id,
  //       );
  //       await AsyncStorage.setItem("contacts", JSON.stringify(filtered));
  //     } else {
  //       // Add to contacts
  //       contactList.push(city);
  //       await AsyncStorage.setItem("contacts", JSON.stringify(contactList));
  //     }

  //     setSaved(!saved);
  //   }

  return (
    <Pressable
      onPress={() => {
        router.push(`/${city.name}/${city.latitude}/${city.longitude}`);
        console.log(city);
      }}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{city.name}</Text>
        <Text style={styles.title}>{city.country}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    width: "100%",
    gap: 10,
    padding: 15,
    backgroundColor: "#202020",
    // borderWidth: 1,
    borderColor: "#606060",
    borderRadius: 8,
  },
  image: {
    borderRadius: 50,
    width: 75,
    backgroundColor: "white",
    aspectRatio: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    gap: 5,
    width: "75%",
  },
  title: {
    color: "white",
    fontWeight: 600,
  },
  email: {
    color: "white",
    fontSize: 10,
  },
  phone: {
    color: "white",
    fontSize: 12,
  },
  button: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});
