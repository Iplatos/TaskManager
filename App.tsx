import { StatusBar } from 'expo-status-bar'
import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import FileUploader from './FileUploader'
import MapForTask from './MapForTask'
export default function App() {
  const [markerLocation, setMarkerLocation] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState('')
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      setIsConnected(state.isConnected ?? false)
      if (state.isConnected) {
        await syncTasksWithServer()
      }
    })

    loadTasksFromStorage()

    return () => unsubscribe()
  }, [])

  const saveTasksToStorage = async (tasks: any[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks))
    } catch (error) {
      console.error('Ошибка сохранения задач в AsyncStorage:', error)
    }
  }

  const loadTasksFromStorage = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks')
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      } else {
        setTasks([])
      }
    } catch (error) {
      console.error('Ошибка загрузки задач из AsyncStorage:', error)
    }
  }

  const addTask = async () => {
    const task = {
      id: Date.now().toString(),
      title: newTask,
      synced: false,
    }

    const updatedTasks = [...tasks, task]
    setTasks(updatedTasks)
    await saveTasksToStorage(updatedTasks)

    if (isConnected) {
      await syncTasksWithServer()
    }

    setNewTask('')
  }

  const saveTaskToServer = async (task: any) => {
    try {
      await axios.post('http://192.168.0.115:3000/tasks', task)
      console.log('Задача успешно синхронизирована с сервером:', task)
    } catch (error) {
      console.error('Ошибка синхронизации задачи с сервером:', error)
      throw error
    }
  }

  const syncTasksWithServer = async () => {
    try {
      console.log('Начинаем синхронизацию задач...')
      const storedTasks = await AsyncStorage.getItem('tasks')
      const tasksToSync = storedTasks
        ? JSON.parse(storedTasks).filter((task: any) => !task.synced)
        : []

      for (const task of tasksToSync) {
        await saveTaskToServer({ ...task, synced: true })
      }

      const response = await axios.get('http://192.168.0.115:3000/tasks')
      const serverTasks = response.data

      setTasks(serverTasks)
      await saveTasksToStorage(serverTasks)

      console.log('Синхронизация завершена.')
    } catch (error) {
      console.error('Ошибка синхронизации задач с сервером:', error)
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={{ padding: 16 }}>
          <Button
            title="remove"
            onPress={async () => {
              try {
                await AsyncStorage.clear() // Очищаем хранилище
                setTasks([]) // Обновляем состояние, например, очищаем список задач
                console.log('AsyncStorage cleared')
              } catch (error) {
                console.error('Ошибка при очистке AsyncStorage', error)
              }
            }}
          />
          <TextInput
            placeholder="Введите название задачи"
            value={newTask}
            onChangeText={setNewTask}
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
          />
          {/* <MapForTask markerLocation={markerLocation} setMarkerLocation={setMarkerLocation} /> */}
          <Button title="Добавить задачу" onPress={addTask} />
          {/* <FileUploader files={files} setFiles={setFiles} /> */}

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View key={item.id} style={{ marginVertical: 10, backgroundColor: 'red' }}>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: 20, // Дополнительный отступ сверху
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
