import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import PDFViewer from '../components/pdfViewer';

export default function App() {
  return (
    <View style={styles.screen}>
      {/* Black status bar header */}
      <SafeAreaView style={styles.blackHeader} />
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {/* Main content */}
      <SafeAreaView style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </Pressable>
        <PDFViewer pdfUrl="https://www.atu.edu/psafe/docs/ATU%20Parking%20Map%202024.pdf" />
      </SafeAreaView>

      {/* Black footer for iPhone home bar */}
      <SafeAreaView style={styles.blackFooter} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black', // Ensures any gaps are black
  },
  blackHeader: {
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  blackFooter: {
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 25,
  },
});

