import { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing favorites persistently
import { Alert } from 'react-native';


/**
 * StAuth10244: I Jaskirat Kaur, 000904397 certify that this material is my original work.
 * No other person's work has been used without due acknowledgement.
 * I have not made my work available to anyone else.
 */


/**
 * To display the map with nearby restaurants, allows users to search for restaurants,
 * and add them to their favorites.
 */
const Restaurants = () => {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const GOOGLE_PLACES_API_KEY = "AIzaSyBRq8b1FjegwqCyZLEoQYuaOf6cYoXqV0c";
  const navigation = useNavigation(); // Hook to navigate to other screens
  const [mapRegion, setMapRegion] = useState(null); // State for map region

  /**
   * useLayoutEffect hook to set the header style and button to navigate to "MyFavorites" screen.
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#D3D3D3', 
      },
      headerTintColor: '#000',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("MyFavorites")}>
          <Ionicons name="heart" size={24} color="black" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

   /**
   * useEffect hook to request location permissions and fetch nearby restaurants on component mount.
   */
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchRestaurants(loc.coords.latitude, loc.coords.longitude);
    })();
    loadFavorites();
  }, []);

  /**
   * Function to load saved favorites from AsyncStorage
   */
  const loadFavorites = async () => {
    const savedFavorites = await AsyncStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  /**
   * Function to fetch restaurants using Google Places API
   */
  const saveFavorites = async (newFavorites) => {
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const fetchRestaurants = async (latitude, longitude, query = "") => {
    try {
      let allRestaurants = [];
      let nextPageToken = null;

      // Loop to handle pagination
      do {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=10000&type=restaurant&keyword=${query}&key=${GOOGLE_PLACES_API_KEY}&pagetoken=${nextPageToken || ""}`;
        const response = await axios.get(url);

        // Append current page of results to the allRestaurants array
        allRestaurants = [...allRestaurants, ...response.data.results];

        // Check if there is another page of results
        nextPageToken = response.data.next_page_token;
        
        // Optionally, you can delay for a short period to avoid hitting API rate limits
        if (nextPageToken) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }
      } while (nextPageToken);

      // Set the state with all the fetched restaurants
      setRestaurants(allRestaurants);
      setFilteredRestaurants(allRestaurants); // Initialize filtered list with all fetched results

    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  /**
   * Function to handle search bar functionality
   */
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      // If the search query is empty, show all restaurants and zoom out to default region
      setFilteredRestaurants(restaurants); // Show all restaurants
      setMapRegion({
        latitude: 40.748817,
        longitude: -73.985428,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } else {
      const filteredData = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredData.length > 0) {
        // If there is a matching restaurant, zoom to its location
        const firstRestaurant = filteredData[0];
        setMapRegion({
          latitude: firstRestaurant.geometry.location.lat,
          longitude: firstRestaurant.geometry.location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
      setFilteredRestaurants(filteredData);
    }
  };
  
  /**
   * Function to add a restaurant to the favorites list
   */
  const addToFavorites = (restaurant) => {
    // Check if the restaurant is already in the favorites
    if (!favorites.find((fav) => fav.place_id === restaurant.place_id)) {
      const updatedFavorites = [...favorites, restaurant];
      saveFavorites(updatedFavorites);
      
       // Show success alert
      Alert.alert(
        'Added to Favorites',
        `${restaurant.name} has been added to your favorites.`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    } else {
      // Show alert if already in favorites
      Alert.alert(
        'Already in Favorites',
        `${restaurant.name} is already in your favorites.`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    }
  };

  /**
   * Function to handle restaurant selection
   */
  const handleRestaurantSelect = (restaurant) => {
     // Navigate to the RestaurantDetails screen and pass selected restaurant details
    navigation.navigate("RestaurantDetails", { 
      restaurant: restaurant,
      restaurantId: restaurant.place_id
    });

    // Update the map region to the selected restaurant
    setMapRegion({
      latitude: restaurant.geometry.location.lat,
      longitude: restaurant.geometry.location.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  /**
   * Main component rendering restaurants and map
   */
  return (
    <View style={styles.container}>
      {/* Search Bar with Icon */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for restaurants..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch();
          }}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Map View Always Visible */}
      {location && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={mapRegion || {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onRegionChangeComplete={setMapRegion}
          >
            {/* Display Markers for All Restaurants */}
            {restaurants.map((restaurant) => (
              <Marker
                key={restaurant.place_id}
                coordinate={{
                  latitude: restaurant.geometry.location.lat,
                  longitude: restaurant.geometry.location.lng,
                }}
                pinColor="red" 
              >
                <Callout>
                  <View>
                    <View style={styles.callout}>
                      <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                      <Text style={styles.calloutSubtitle}>
                        📍{restaurant.vicinity}
                      </Text>
                      <Text>Rating: {restaurant.rating || "N/A"}</Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>
      )}

      {/* FlatList for Displaying Search Results */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.place_id.toString()} 
        renderItem={({ item }) => (
          <View>
          <Text>{item.reviews}</Text>
          <TouchableOpacity
            onPress={() => handleRestaurantSelect(item)}
            style={styles.restaurantItem}
          >
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantAddress}>📍{item.vicinity}</Text>
             <Text style={styles.rating}>⭐{item.rating}</Text>
              <TouchableOpacity onPress={() => addToFavorites(item)}>
                <Text style={styles.favoriteButton}>Add to Favorites</Text>
              </TouchableOpacity>
          </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 FoodieExplorer. All Rights Reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  searchContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginHorizontal: 15,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "white",
    backgroundColor: "#222",
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  mapContainer: {
    height: 300, 
    width: "90%",
    marginTop: 10,
    marginHorizontal: "5%",
    borderRadius: 20,
    overflow: "hidden",
  },

  map: {
    flex: 1,
  },

  callout: {
    paddingBottom: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  calloutSubtitle: {
    color: "#555",
  },
  restaurantItem: {
    backgroundColor: "#333",
    padding: 15,
    marginTop: 10,
    borderRadius: 8,
    marginHorizontal: 15,
  },
  restaurantName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  restaurantAddress: {
    color: "#bbb",
  },
  favoriteButton: {
    color: "#FFD700",
    fontSize: 16,
    marginTop: 5,
  },
  footer: {
    padding: 10,
    backgroundColor: "#333",
    alignItems: "center",
  },
  footerText: {
    color: "white",
    
  },
  rating:{
    marginTop:10,
    color: "white",
  },
});

export default  Restaurants;
