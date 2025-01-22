import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

const MapForTask = (props: any) => {
  const { markerLocation, setMarkerLocation } = props

  const [userLocation, setUserLocation] = useState<any>(null)
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getUserLocation()
      if (location) {
        setUserLocation(location)
        setMarkerLocation(location)
      }
    }

    fetchLocation()
  }, [setMarkerLocation])

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      alert('Разрешение на использование геолокации отклонено')
      return null
    }

    const location = await Location.getCurrentPositionAsync({})
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
  }

  const handleMapPress = (event: any) => {
    const newCoords = event.nativeEvent.coordinate
    setMarkerLocation(newCoords)

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: newCoords.latitude,
          longitude: newCoords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      )
    }
  }

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          style={styles.map}
          ref={mapRef}
          region={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={markerLocation}
            title="My location"
            description="You are here"
            draggable
          />
        </MapView>
      ) : (
        <Text>Загрузка карты...</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: 360, height: 300 },
  map: { flex: 1 },
})

export default MapForTask
