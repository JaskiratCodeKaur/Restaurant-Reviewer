import { useState, useLayoutEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, ImageBackground, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text as AnimatedText } from 'react-native-animatable';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';


/**
 * StAuth10244: I Jaskirat Kaur, 000904397 certify that this material is my original work.
 * No other person's work has been used without due acknowledgement.
 * I have not made my work available to anyone else.
 */

const backgroundImage = require('./assets/restaurant-background.jpg');

export default function HomePage() {
  const navigation = useNavigation();

  // Disable header on this screen
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Load fonts - ensure it's always called
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
  });

  // State for button press effect
  const [pressed, setPressed] = useState(false);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={styles.overlay}>
        <AnimatedText style={[styles.title, { fontFamily: 'Poppins_500Medium' }]}>
          Welcome to Foodie Explorer!
        </AnimatedText>
        <TouchableOpacity
          style={[styles.startButton, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('Restaurants')}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    resizeMode: 'cover',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 30,
    margin: 20,
    maxHeight: 400,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 2,
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#FF6347',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#FF4500',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
