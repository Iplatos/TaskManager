import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

const MapForCreatedTask = (props: any) => {
  const { location } = props

  return (
    <View style={styles.container}>
      {location && location.latitude && location.longitude && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={location} title="Task location" description="Right here" draggable />
        </MapView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'green' },
  map: { flex: 1, width: 350, height: 300 }, // Используем flex для растягивания карты
})

export default MapForCreatedTask
