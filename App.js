import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 
import HomePage from './HomePage';
import RestaurantPage from './RestaurantPage';
import RestaurantDetails from './RestaurantDetails';
import FavoritesPage from './FavoritesPage';
import SplashScreen from './components/SplashScreen'; 

/**
 * StAuth10244: I Jaskirat Kaur, 000904397 certify that this material is my original work.
 * No other person's work has been used without due acknowledgement.
 * I have not made my work available to anyone else.
 */

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  //If the app is loading, display the splash screen
  if (isLoading) {
    return <SplashScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Restaurants" component={RestaurantPage} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
        <Stack.Screen name="MyFavorites" component={FavoritesPage} />
      </Stack.Navigator>
     
    </NavigationContainer>
    
  );
}
