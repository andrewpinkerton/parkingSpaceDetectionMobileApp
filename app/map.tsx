import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Pressable, View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import {
  PinchGestureHandler,
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const mapImage = require('../assets/images/map.jpg');
const { width, height } = Dimensions.get('window');

export default function MapPage() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const lastScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);
  const markerScale = useSharedValue(1);
  const markerOpacity = useSharedValue(0.8);
  const shadowScale = useSharedValue(0.8);
  const shadowOpacity = useSharedValue(0.3);

  // Start marker animations when component mounts
  useEffect(() => {
    // Subtle pulse for the marker
    markerScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ), 
      -1, // repeat infinitely
      true // reverse each cycle
    );
    
    // Shadow effect animation
    shadowScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    shadowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 2000 }),
        withTiming(0.2, { duration: 2000 })
      ),
      -1,
      true
    );
    
    // Show tooltip briefly after a delay when page loads
    setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 4000);
    }, 1000);
  }, []);


  // Building data
  const buildings: { [key: string]: any } = {
    brown: {
      name: "Brown Hall",
      location: "Russellville Campus",
      hours: "Monday - Friday: 8:00 AM - 5:00 PM",
      department: "Admissions and Student Support Services",
      description: "Brown Hall, named in honor of the 11th president of ATU and his wife, is a four-story, 66,900-square-foot facility located at the entrance of the university. It houses the Admissions Office, Student Support Services, classrooms, and various administrative departments, serving as a central hub for student services and academic support.",
      image: require('../assets/images/brownhall.jpg'),
      route: "/brown"
    },
    witherspoon: {
      name: "Witherspoon Hall",
      location: "Russellville Campus",
      hours: "Monday - Friday: 8:00 AM - 5:00 PM",
      department: "Department of Music",
      description: "Witherspoon Hall, named after Gene Witherspoon, director of bands from 1950 to 1979, serves as the home of ATU's Department of Music. It features Witherspoon Auditorium, a venue for concerts, recitals, and various musical events, and houses faculty offices, classrooms, and practice rooms dedicated to music education and performance.",
      image: require('../assets/images/witherspoonhall.jpg'),
      route: "/witherspoon"
    }
  };
  
  

  // Handle building selection
  const showBuildingInfo = (building: any) => {
    setCurrentBuilding(building);
    setModalVisible(true);
  };

  // Navigate to building page
  const navigateToBuilding = () => {
    setModalVisible(false);
    if (currentBuilding) {
      router.push(buildings[currentBuilding].route);
    }
  };

  // Pinch gesture handlers
  const onPinchGestureEvent = (event: any) => {
    scale.value = Math.max(lastScale.value * event.nativeEvent.scale, 1);
  };

  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      scale.value = Math.max(scale.value, 1);
      lastScale.value = scale.value;
      const maxTranslateX = (scale.value * width - width) / 2;
      const maxTranslateY = (scale.value * height - height) / 2;
      translateX.value = withSpring(Math.min(Math.max(translateX.value, -maxTranslateX), maxTranslateX));
      translateY.value = withSpring(Math.min(Math.max(translateY.value, -maxTranslateY), maxTranslateY));
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    }
  };

  // Pan gesture handlers
  const onPanGestureEvent = (event: any) => {
    const newTranslateX = lastTranslateX.value + event.nativeEvent.translationX;
    const newTranslateY = lastTranslateY.value + event.nativeEvent.translationY;
    translateX.value = newTranslateX;
    translateY.value = newTranslateY;
  };

  const onPanHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const maxTranslateX = (scale.value * width - width) / 2;
      const maxTranslateY = (scale.value * height - height) / 2;
      const clampedX = Math.min(Math.max(translateX.value, -maxTranslateX), maxTranslateX);
      const clampedY = Math.min(Math.max(translateY.value, -maxTranslateY), maxTranslateY);
      translateX.value = withSpring(clampedX, { duration: 200 });
      translateY.value = withSpring(clampedY, { duration: 200 });
      lastTranslateX.value = clampedX;
      lastTranslateY.value = clampedY;
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const markerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: markerScale.value }],
    opacity: markerOpacity.value,
  }));

  const shadowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shadowScale.value }],
    opacity: shadowOpacity.value,
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>

      {/* Legend button */}
      <Pressable style={styles.legendButton} onPress={() => alert('Tap on building markers to search for available parking.')}>
        <Ionicons name="information-circle" size={24} color="white" />
      </Pressable>

      {/* Map with gesture handlers */}
      <PanGestureHandler
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onPanHandlerStateChange}
      >
        <Animated.View style={styles.mapContainer}>
          <PinchGestureHandler
            onGestureEvent={onPinchGestureEvent}
            onHandlerStateChange={onPinchHandlerStateChange}
          >
            <Animated.View style={[animatedStyle]}>
              <Animated.Image source={mapImage} style={styles.mapImage} />
              
              {/* Brown Hall marker */}
              <View style={[styles.markerPosition]}>
                {/* Shadow effect under marker */}
                <Animated.View style={[styles.markerShadow, shadowAnimatedStyle]} />
                
                {/* Main marker */}
                <Pressable onPress={() => showBuildingInfo('brown')}>
                  <Animated.View style={[styles.marker, markerAnimatedStyle]}>
                    <Ionicons name="location" size={18} color="white" />
                  </Animated.View>
                </Pressable>
                
                {/* Building name label */}
                <View style={styles.markerLabel}>
                  <Text style={styles.markerText}>Brown Hall</Text>
                </View>
                
                {/* Tooltip (shows briefly on load) */}
                {showTooltip && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>Tap to explore</Text>
                  </View>
                )}
              </View>

              {/* Witherspoon Hall marker */}
              <View style={[styles.witherspoonMarkerPosition]}>
                {/* Shadow effect under marker */}
                <Animated.View style={[styles.markerShadow, shadowAnimatedStyle, {backgroundColor: '#22c55e'}]} />
                
                {/* Main marker */}
                <Pressable onPress={() => showBuildingInfo('witherspoon')}>
                  <Animated.View style={[styles.marker, markerAnimatedStyle, {backgroundColor: '#22c55e'}]}>
                    <Ionicons name="location" size={18} color="white" />
                  </Animated.View>
                </Pressable>
                
                {/* Building name label */}
                <View style={styles.markerLabel}>
                  <Text style={styles.markerText}>Witherspoon Hall</Text>
                </View>
              </View>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      {/* Building info modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {currentBuilding && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{buildings[currentBuilding].name}</Text>
                </View>
                
                <View style={styles.modalImageContainer}>
                  <Image source={buildings[currentBuilding].image} style={styles.modalImage} resizeMode="cover"/>
                </View>
                
                <View style={styles.modalInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={20} color="#555" />
                    <Text style={styles.infoText}>{buildings[currentBuilding].location}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="time" size={20} color="#555" />
                    <Text style={styles.infoText}>{buildings[currentBuilding].hours}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="school" size={20} color="#555" />
                    <Text style={styles.infoText}>{buildings[currentBuilding].department}</Text>
                  </View>
                </View>
                
                <Text style={styles.modalDescription}>
                  {buildings[currentBuilding].description}
                </Text>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.secondaryButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryButton} onPress={navigateToBuilding}>
                    <Text style={styles.primaryButtonText}>View Parking</Text>
                    <Ionicons name="arrow-forward" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 25,
  },
  legendButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 25,
  },
  mapContainer: {
    flex: 1,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  markerPosition: {
    position: 'absolute',
    top: 357,
    left: 270,
    alignItems: 'center',
    justifyContent: 'center',
  },
  witherspoonMarkerPosition: {
    position: 'absolute',
    top: 250,
    left: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerShadow: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3b82f6',
    opacity: 0.3,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 5,
  },
  markerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    top: -40,
    zIndex: 5,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalImageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    color: '#555',
    fontSize: 14,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 5,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
});