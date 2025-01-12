import { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler"; 

/**
 * StAuth10244: I Jaskirat Kaur, 000904397 certify that this material is my original work.
 * No other person's work has been used without due acknowledgement.
 * I have not made my work available to anyone else.
 */

const FavoritesPage = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  /**
   * To set custom options for the navigation header, such as background color and text color.
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#D3D3D3',
      },
      headerTintColor: '#000',
    });
  }, [navigation]);

  useEffect(() => {
    loadFavorites();
  }, []);

  /**
   * To load saved favorite restaurants from AsyncStorage when the component mounts.
   */
  const loadFavorites = async () => {
    const savedFavorites = await AsyncStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  /**
   * To navigate to the RestaurantDetails screen with the selected restaurant's details.
   *
   * @param {Object} restaurant - The selected restaurant object.
   */
  const handleRestaurantSelect = (restaurant) => {
    navigation.navigate("RestaurantDetails", {
      restaurant: restaurant,  
      restaurantId: restaurant.place_id
    });
  };

  /**
   * To remove a restaurant from the favorites list and updates AsyncStorage.
   *
   * @param {string} place_id - The unique identifier of the restaurant to be removed.
   */
  const removeFromFavorites = async (place_id) => {
    const updatedFavorites = favorites.filter(
      (item) => item.place_id !== place_id
    );
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  /**
   * To renders a delete button for the swipeable gesture.
   *
   * @param {Object} progress - The progress of the swipe gesture.
   * @param {number} dragX - The horizontal drag position of the swipe gesture.
   * @param {Object} restaurant - The restaurant object being swiped.
   */
  const renderRightActions = (progress, dragX, restaurant) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromFavorites(restaurant.place_id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favorites</Text>
      {favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorites added yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.place_id ? item.place_id.toString() : item.name} 
          renderItem={({ item }) => (
            <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
              <TouchableOpacity
                onPress={() => handleRestaurantSelect(item)}
                style={styles.restaurantItem}
              >
                <View style={styles.itemContent}>
                  <View style={styles.textContainer}>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <Text style={styles.restaurantAddress}>{item.vicinity}</Text>
                  </View>
                  <Ionicons name="heart" size={24} color="red" style={styles.heartIcon} />
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  noFavoritesText: {
    color: "#aaa",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  restaurantItem: {
    backgroundColor: "#1c1c1c",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  restaurantName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  restaurantAddress: {
    color: "#bbb",
    fontSize: 14,
    marginTop: 5,
  },
  heartIcon: {
    alignSelf: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    height: "90%",
    width: 80,
    borderRadius: 10,
    marginLeft:10,
    
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FavoritesPage;
