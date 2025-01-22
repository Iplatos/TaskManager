import { StatusBar } from 'expo-status-bar'
import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import FileUploader from './FileUploader'
import MapForTask from './MapForTask'
import Header from './Header'
import { DatePickerComponent } from './DatePicker'

export default function App() {
  const [markerLocation, setMarkerLocation] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [locationDescription, setLocationDescription] = useState('')
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [showCreateTaskBlock, setShowCreateTaskBlock] = useState(false)
  const [date, setDate] = useState(new Date())
  const [showMap, setShowMap] = useState(false)
  useEffect(() => {
    loadTasksFromStorage()
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      setIsConnected(state.isConnected ?? false)
      if (state.isConnected) {
        syncTasksWithServer()
        syncDeletedTasksWithServer()
      }
    })

    return () => unsubscribe()
  }, [])
  console.log('date меняется жу ', date.toISOString())

  const deleteTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, deleted: true } : task
      )

      setTasks(updatedTasks.filter((task) => !task.deleted))

      await saveTasksToStorage(updatedTasks)

      if (isConnected) {
        await deleteTaskFromServer(taskId)
        await syncDeletedTasksWithServer()
      }
    } catch (error) {
      console.error('Ошибка удаления задачи:', error)
    }
  }

  const syncDeletedTasksWithServer = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks')
      const tasksToSync = storedTasks
        ? JSON.parse(storedTasks).filter((task: any) => task.deleted)
        : []

      for (const task of tasksToSync) {
        await deleteTaskFromServer(task.id)
      }

      const updatedTasks = tasks.filter((task) => !task.deleted)
      setTasks(updatedTasks)
      await saveTasksToStorage(updatedTasks)
    } catch (error) {
      console.error('Ошибка синхронизации удалённых задач:', error)
    }
  }
  const deleteTaskFromServer = async (taskId: string) => {
    try {
      await axios.delete(`http://192.168.0.115:3000/tasks/${taskId}`)
      console.log(`Задача с ID ${taskId} успешно удалена с сервера.`)
    } catch (error) {
      console.error(`Ошибка при удалении задачи с ID ${taskId}:`, error)
      throw error
    }
  }
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
        const parsedTasks = JSON.parse(storedTasks)
        console.log('Задачи из AsyncStorage:', parsedTasks)

        setTasks(parsedTasks.filter((task) => !task.deleted))
      } else {
        console.log('Нет задач в AsyncStorage')
        setTasks([])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const addTask = async () => {
    const task = {
      id: date.toString(),
      title: taskTitle,
      description: taskDescription,
      locationDescription,
      location: markerLocation,
      synced: false,
      updated: new Date().toString(),
      markerLocation: markerLocation,
      file: files,
      deleted: false,
      deadLine: date.toISOString(),
    }

    const updatedTasks = [...tasks, task]
    setTasks(updatedTasks)
    saveTasksToStorage(updatedTasks)

    if (isConnected) {
      await syncTasksWithServer()
    }

    setTaskTitle('')
    setTaskDescription('')
    setLocationDescription('')
    setDate(new Date())
    setFiles([])
  }

  const saveTaskToServer = async (task: any) => {
    try {
      await axios.post('http://192.168.0.115:3000/tasks', task)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const syncTasksWithServer = async () => {
    try {
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
    } catch (error) {
      console.error(error)
    }
  }
  const deadlineCorrectFormat = (isoString: string) => {
    console.log('vot taki', isoString)

    if (!isoString) return 'Invalid Date'

    const dateFromISO = new Date(isoString)
    if (isNaN(dateFromISO.getTime())) return 'Iфыnvalid Date'

    const day = dateFromISO.getDate()
    const month = dateFromISO.getMonth() + 1 // Месяцы начинаются с 0
    const year = dateFromISO.getFullYear()
    const hours = dateFromISO.getHours()
    const minutes = dateFromISO.getMinutes()

    // Форматируем дату
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year} ${
      hours < 10 ? '0' + hours : hours
    }:${minutes < 10 ? '0' + minutes : minutes}`
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Header
        showCreateTaskBlock={showCreateTaskBlock}
        setShowCreateTaskBlock={setShowCreateTaskBlock}
      />

      <View style={styles.container}>
        {showCreateTaskBlock && (
          <View style={{ backgroundColor: 'green' }}>
            <TextInput
              placeholder="Add title"
              value={taskTitle}
              onChangeText={setTaskTitle}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
              placeholder="Add description"
              placeholderTextColor={'red'}
              value={taskDescription}
              onChangeText={setTaskDescription}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
              placeholder="Add location"
              value={locationDescription}
              onChangeText={setLocationDescription}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <View
              style={{
                backgroundColor: 'yellow',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                paddingRight: 20,
                height: 55,
              }}
            >
              <DatePickerComponent date={date} setDate={setDate} />
              <TouchableOpacity style={styles.button} onPress={() => setShowMap(!showMap)}>
                <Text style={{ fontSize: 16, color: 'white' }}>
                  {showMap ? 'Hide Map' : 'Show Map'}
                </Text>
              </TouchableOpacity>
            </View>
            <FileUploader files={files} setFiles={setFiles} />
            <TouchableOpacity
              style={[styles.button, { position: 'relative', left: 105 }]}
              onPress={addTask}
            >
              <Text style={{ fontSize: 16, color: 'white' }}>Add task</Text>
            </TouchableOpacity>

            {showMap && (
              <MapForTask markerLocation={markerLocation} setMarkerLocation={setMarkerLocation} />
            )}
          </View>
        )}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              key={item.id}
              style={{
                marginVertical: 10,
                backgroundColor: 'red',
                borderWidth: 1,
                borderColor: 'black',
                borderStyle: 'solid',
                borderRadius: 5,
              }}
            >
              <Text style={{ textAlign: 'center', marginVertical: 10 }}>Title:{item.title}</Text>
              <Text style={{ marginVertical: 5, marginLeft: 20 }}>
                Description:{item.description}
              </Text>
              <Text style={{ marginVertical: 5, marginLeft: 20 }}>
                Location:{item.locationDescription}
              </Text>

              <Text style={{ marginVertical: 5, marginLeft: 20, textAlign: 'center' }}>
                {item.synced ? 'Synchronized' : 'Not Synchronized'}
              </Text>
              <Text style={{ marginVertical: 5, marginLeft: 20 }}>
                Deadline: {deadlineCorrectFormat(item.deadLine)}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginVertical: 10, marginLeft: 20 }}>Location on Map :</Text>
                {item.markerLocation ? (
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      paddingBottom: 0,
                    }}
                    source={require('./assets/location.png')}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={{ marginVertical: 5, marginLeft: 20 }}>No</Text>
                )}
              </View>

              {item.file && item.file.length > 0 && item.file[0].type === 'image' ? (
                <ScrollView horizontal={true} style={{ marginTop: 10 }}>
                  {item.file.map((file, index) => (
                    <Image
                      key={index}
                      style={{
                        width: 100,
                        height: 100,
                        marginRight: 10,
                      }}
                      source={{ uri: file.uri }}
                      resizeMode="contain"
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text>No Picture</Text>
              )}

              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {!isConnected && <Text style={{ color: 'red' }}>Connection error</Text>}
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  )
}
////npx json-server --watch db.json --port 3000

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: 30,
  },
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgb(107, 79, 187)',
    width: 150,
    height: 40,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
