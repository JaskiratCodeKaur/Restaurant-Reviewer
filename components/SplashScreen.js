import {View, StyleSheet, Image } from 'react-native';

/**
 * StAuth10244: I Jaskirat Kaur, 000904397 certify that this material is my original work.
 * No other person's work has been used without due acknowledgement.
 * I have not made my work available to anyone else.
 */

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/splash.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  logo: {
    height: 128,
    width: 128,
  },
});
