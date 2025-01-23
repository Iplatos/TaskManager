import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import Header from './Header'
import * as Notifications from 'expo-notifications'
import TaskComponent from './TaskNotivication'
import History from './History'
import { scheduleNotification } from './notifications'
import { globalStyles } from './styles/styles'
import TaskCreatorBlock from './TaskCreatorBlock'
import TaskBlock from './TaskBlock'
import { Task } from './types/types'

export default function App() {
  const [markerLocation, setMarkerLocation] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [locationDescription, setLocationDescription] = useState('')
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [showCreateTaskBlock, setShowCreateTaskBlock] = useState(true)
  const [date, setDate] = useState(new Date())
  const [showMap, setShowMap] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
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
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    })
  }, [])

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
      console.error(error)
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
      console.error(error)
    }
  }
  const deleteTaskFromServer = async (taskId: string) => {
    try {
      await axios.delete(`http://192.168.0.115:3000/tasks/${taskId}`)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  const saveTasksToStorage = async (tasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks))
    } catch (error) {
      console.error(error)
    }
  }

  const loadTasksFromStorage = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks')
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks)

        setTasks(parsedTasks.filter((task) => !task.deleted))
      } else {
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

    const taskDate = new Date(task.deadLine)
    const notificationTime = new Date(taskDate.getTime() - 30 * 60000)

    if (notificationTime > new Date()) {
      await scheduleNotification(task.title, notificationTime)
    }

    setTaskTitle('')
    setTaskDescription('')
    setLocationDescription('')
    setDate(new Date())
    setFiles([])
    setShowMap(false)
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

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Header
        showCreateTaskBlock={showCreateTaskBlock}
        setShowCreateTaskBlock={setShowCreateTaskBlock}
        setShowHistory={setShowHistory}
        showHistory={showHistory}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
      />
      <TaskComponent tasks={tasks} />
      <View
        style={[
          styles.container,
          isDarkTheme ? globalStyles.mainDarkMode : globalStyles.mainLightMode,
        ]}
      >
        {showCreateTaskBlock && (
          <TaskCreatorBlock
            date={date}
            files={files}
            isDarkTheme={isDarkTheme}
            locationDescription={locationDescription}
            setDate={setDate}
            setFiles={setFiles}
            setLocationDescription={setLocationDescription}
            setShowMap={setShowMap}
            setTaskDescription={setTaskDescription}
            setTaskTitle={setTaskTitle}
            showMap={showMap}
            taskDescription={taskDescription}
            taskTitle={taskTitle}
            addTask={addTask}
            setMarkerLocation={setMarkerLocation}
            markerLocation={markerLocation}
          />
        )}

        {!showHistory ? (
          <TaskBlock isDarkTheme={isDarkTheme} deleteTask={deleteTask} tasks={tasks} />
        ) : (
          <History isDarkTheme={isDarkTheme} tasks={tasks} />
        )}
        {!isConnected && <Text style={{ color: 'red' }}>Connection error</Text>}
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  createTaskBlock: {
    zIndex: 10,
    top: 10,
    alignItems: 'center',
    paddingTop: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    position: 'absolute',
  },
  createTaskBlockInput: {
    borderWidth: 1,
    width: '90%',
    marginBottom: 10,
    padding: 8,
  },
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
})
