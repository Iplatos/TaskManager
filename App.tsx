import { StatusBar } from 'expo-status-bar'
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native'
import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import FileUploader from './FileUploader'
import * as FileSystem from 'expo-file-system' // Импортируем expo-file-system для работы с файлами
import * as Location from 'expo-location'
import MapForTask from './MapForTask'
export default function App() {
  const [markerLocation, setMarkerLocation] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState('')
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const syncTasksFromStorage = async () => {
    try {
      const storedTasks = await loadTasksFromStorage()
      const tasksToSync = storedTasks.map((task: any) => ({
        ...task,
        synced: true, // Устанавливаем статус задачи как синхронизированную
      }))

      // Синхронизируем все задачи с сервером
      for (const task of tasksToSync) {
        await syncTaskWithServer(task)
      }

      // После успешной синхронизации очищаем локальное хранилище
      await AsyncStorage.clear()
      // Очищаем список задач
    } catch (error) {
      console.error('Ошибка синхронизации задач из хранилища', error)
    }
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false)
      if (state.isConnected && !isSyncing) {
        fetchTasksFromServer()
        syncTasksFromStorage()
      }
    })

    return () => unsubscribe()
  }, [isSyncing])

  // Сохраняем задачи в AsyncStorage
  const saveTasksToStorage = async (tasks: any[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks))
    } catch (error) {
      console.error('Ошибка сохранения задач', error)
    }
  }

  // Загружаем задачи из AsyncStorage
  const loadTasksFromStorage = async () => {
    try {
      const tasks = await AsyncStorage.getItem('tasks')
      return tasks ? JSON.parse(tasks) : []
    } catch (error) {
      console.error('Ошибка загрузки задач', error)
      return []
    }
  }

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

  const addTask = async () => {
    const location = await getUserLocation()
    const task = {
      id: Date.now().toString(),
      title: newTask,
      synced: false,
      file: files,
      location: markerLocation,
    }

    const updatedTasks = [...tasks, task]
    setTasks(updatedTasks)
    setNewTask('')

    if (isConnected) {
      await syncTaskWithServer(task)
    } else {
      await saveTasksToStorage(updatedTasks)
    }
  }

  // Функция синхронизации задачи с сервером
  const syncTaskWithServer = async (task: any) => {
    try {
      await axios.post('http://192.168.0.115:3000/tasks', task)
      task.synced = true
      setTasks((prevTasks) => [...prevTasks, task])
    } catch (error) {
      console.error('Ошибка синхронизации задачи с сервером', error)
    }
  }

  // Функция получения задач с сервера
  const fetchTasksFromServer = async () => {
    try {
      const response = await axios.get('http://192.168.0.115:3000/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Ошибка получения задач с сервера', error)
    }
  }

  useEffect(() => {
    const fetchImageUri = async () => {
      const fileUri =
        'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FTaskManagerApp-7daf9a63-6aac-492d-a5da-d5923cac781d/ImagePicker/faf842ab-610e-48e2-a2b4-e27272432269.jpeg'

      const fileExists = await FileSystem.getInfoAsync(fileUri)
      if (fileExists.exists) {
        console.log('File exists at:', fileUri)
      } else {
        console.error('File does not exist')
      }
    }

    fetchImageUri()
  }, [])

  return (
    <View style={styles.container}>
      <View style={{ padding: 16 }}>
        <TextInput
          placeholder="Введите название задачи"
          value={newTask}
          onChangeText={setNewTask}
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />
        <MapForTask markerLocation={markerLocation} setMarkerLocation={setMarkerLocation} />
        <Button title="Добавить задачу" onPress={addTask} />
        <FileUploader files={files} setFiles={setFiles} />

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={{ marginVertical: 10 }}>
              <Text style={{ marginVertical: 5 }}>
                {item.title} {item.synced ? '(Синхронизировано)' : '(Не синхронизировано)'}
              </Text>

              {/* Проверка, если есть изображения */}
              {item.file && item.file.length > 0 && item.file[0].type === 'image' ? (
                item.file.map((file, index) => (
                  <Image
                    key={index}
                    style={{ width: 100, height: 100, marginTop: 10 }}
                    source={{ uri: file.uri }}
                    resizeMode="contain"
                  />
                ))
              ) : (
                <Text>Изображение отсутствует</Text>
              )}
            </View>
          )}
        />
      </View>

      {!isConnected && <Text style={{ color: 'red' }}>Нет соединения с интернетом</Text>}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
