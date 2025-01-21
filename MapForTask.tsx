import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

const MapForTask = (props: any) => {
  const { markerLocation, setMarkerLocation } = props

  const [userLocation, setUserLocation] = useState<any>(null)
  const mapRef = useRef<MapView>(null) // Ссылка на MapView

  // Загружаем местоположение при монтировании компонента
  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getUserLocation()
      if (location) {
        setUserLocation(location)
        setMarkerLocation(location) // Устанавливаем начальные координаты маркера
      }
    }

    fetchLocation()
  }, [setMarkerLocation])

  // Получение текущего местоположения
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

  // Обработчик клика по карте
  const handleMapPress = (event: any) => {
    const newCoords = event.nativeEvent.coordinate
    setMarkerLocation(newCoords) // Обновляем состояние с новыми координатами

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: newCoords.latitude,
          longitude: newCoords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000 // Время анимации (мс)
      )
    }
  }

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          style={styles.map}
          ref={mapRef} // Ссылка на карту
          region={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress} // Обработчик клика по карте
        >
          {/* Маркер текущего местоположения */}
          <Marker
            coordinate={markerLocation}
            title="Мое местоположение"
            description="Вы находитесь здесь"
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
  container: { flex: 1 },
  map: { flex: 1 },
})

export default MapForTask
