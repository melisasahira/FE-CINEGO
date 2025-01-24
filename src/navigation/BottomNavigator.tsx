import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import MovieListScreen from "../screens/MovieListScreen";
import UserProfileScreen from "../screens/MyProfileScreen";

const Tab = createBottomTabNavigator<BottomTabParamList>();

type BottomTabParamList = {
  Explore: undefined;
  Movie: undefined;
  MyProfile: undefined;
};

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Explore" component={HomeScreen} />
      <Tab.Screen name="Movie" component={MovieListScreen} />
      <Tab.Screen name="MyProfile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = getIconName(route.name, isFocused);

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[
              styles.tabButton,
              isFocused && styles.activeTabButton,
              route.name === "Movie" && styles.middleTabButton,
            ]}
          >
            <Icon
              name={iconName}
              size={route.name === "Movie" ? 28 : 24} // Ikon lebih besar untuk tab tengah
              color={isFocused ? "#000000" : "#B0B0B0"} // Warna aktif dan non-aktif
            />
            <Text
              style={[
                styles.tabText,
                isFocused && styles.activeTabText,
                route.name === "Movie" && styles.middleTabText,
              ]}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getIconName = (routeName: string, isFocused: boolean) => {
  switch (routeName) {
    case "Explore":
      return isFocused ? "compass" : "compass-outline";
    case "Movie":
      return isFocused ? "film" : "film-outline"; // Ikon untuk Movie
    case "MyProfile":
      return isFocused ? "person" : "person-outline";
    default:
      return "ellipse-outline";
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Background putih seperti gambar
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopColor: "#E0E0E0",
    borderTopWidth: 1,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },
  middleTabButton: {
    marginTop: -10, // Menaikkan tab tengah sedikit
  },
  activeTabButton: {
    opacity: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#B0B0B0",
  },
  middleTabText: {
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#000000",
  },
});
