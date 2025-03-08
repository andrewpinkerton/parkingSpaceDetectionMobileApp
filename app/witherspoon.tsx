import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchData, ParkingSpotSummary } from '../services/api';

const WitherspoonPage = () => {
  const [data, setData] = useState<ParkingSpotSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchData('/?process=AA+Lot+North+2');
      if (response) {
        setData(response.result);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    
    // Refresh data every 2 minutes
    const intervalId = setInterval(loadData, 120000);
    return () => clearInterval(intervalId);
  }, [loadData]);

  // Calculate the fill percentage for the visual indicator
  const calculateFillPercentage = () => {
    if (!data) return 0;
    return (data.occupied_spots / data.total_spots) * 100;
  };

  // Determine status color based on occupancy
  const getStatusColor = () => {
    if (!data) return '#64748b'; // Default gray
    const occupancyRate = data.occupancy_rate;
    if (occupancyRate < 50) return '#22c55e'; // Green for plenty of spots
    if (occupancyRate < 80) return '#eab308'; // Yellow for filling up
    return '#ef4444'; // Red for nearly full
  };

  const getStatusText = () => {
    if (!data) return 'Unknown';
    const occupancyRate = data.occupancy_rate;
    if (occupancyRate < 50) return 'Plenty of spots available';
    if (occupancyRate < 80) return 'Filling up';
    return 'Almost full';
  };

  return (
    <ImageBackground 
      source={require('../assets/images/witherspoonhall.jpg')} 
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.8 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>AA Lot North</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading parking data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                loadData();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : data ? (
          <View style={styles.mainContainer}>
            {/* Status Card */}
            <View style={styles.card}>
              <Text style={styles.statusText}>
                Status: <Text style={{color: getStatusColor(), fontWeight: 'bold'}}>{getStatusText()}</Text>
              </Text>
              
              {/* Visual parking indicator */}
              <View style={styles.parkingIndicator}>
                <View 
                  style={[
                    styles.parkingIndicatorFill, 
                    {width: `${calculateFillPercentage()}%`, backgroundColor: getStatusColor()}
                  ]} 
                />
              </View>
            </View>

            {/* Parking Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, {backgroundColor: 'rgba(59, 130, 246, 0.8)'}]}>
                <Text style={styles.statTitle}>Total Spots</Text>
                <Text style={styles.statValue}>{data.total_spots}</Text>
                <Text style={styles.statEmoji}>📊</Text>
              </View>
              
              <View style={[styles.statCard, {backgroundColor: 'rgba(239, 68, 68, 0.8)'}]}>
                <Text style={styles.statTitle}>Occupied</Text>
                <Text style={styles.statValue}>{data.occupied_spots}</Text>
                <Text style={styles.statEmoji}>🚗</Text>
              </View>
              
              <View style={[styles.statCard, {backgroundColor: 'rgba(34, 197, 94, 0.8)'}]}>
                <Text style={styles.statTitle}>Vacant</Text>
                <Text style={styles.statValue}>{data.vacant_spots}</Text>
                <Text style={styles.statEmoji}>🅿️</Text>
              </View>
            </View>

            {/* Occupancy Rate Meter */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Occupancy Rate</Text>
              <View style={styles.occupancyMeter}>
                <View style={styles.occupancyBackground}>
                  <View 
                    style={[
                      styles.occupancyFill, 
                      {width: `${data.occupancy_rate}%`}
                    ]} 
                  />
                </View>
                <Text style={styles.occupancyValue}>{data.occupancy_rate}%</Text>
              </View>
              <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleTimeString()}</Text>
            </View>

            {/* Parking Lot Image Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Image of Parking Lot</Text>
              <View style={styles.imageContainer}>
                <Image 
                  source={require('../assets/images/witherspoonparking.jpg')} 
                  style={styles.lotImage} 
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No data available</Text>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    color: '#ffffff',
    fontSize: 24,
    marginRight: 4,
  },
  backText: {
    color: '#ffffff',
    marginLeft: 2,
    fontSize: 16,
  },
  mainContainer: {
    padding: 16,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingText: {
    marginTop: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Standardized card styling
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  // Status specific styles
  statusText: {
    fontSize: 18,
    marginBottom: 12,
  },
  parkingIndicator: {
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  parkingIndicatorFill: {
    height: '100%',
    borderRadius: 12,
  },
  // Stats card styling
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statEmoji: {
    fontSize: 24,
    marginTop: 4,
  },
  // Occupancy specific styles
  occupancyMeter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  occupancyBackground: {
    flex: 1,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
  },
  occupancyFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 10,
  },
  occupancyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 8,
  },
  // Image specific styles
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 8,
  },
  lotImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  }
});

export default WitherspoonPage;