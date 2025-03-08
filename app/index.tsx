// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Link } from 'expo-router';

const backgroundImage = require('../assets/images/campus.jpg');

const HomePage = () => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>ATU Campus Parking Tool</Text>
        <Text style={styles.subtitle}>ATU Parking made easy</Text>

        <Link href="/map" style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Link>

        <Link href="/parkingmap" style={styles.button}>
          <Text style={styles.buttonText}>View Parking Map</Text>
        </Link>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    paddingVertical: 40,
  },
  title: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomePage;
