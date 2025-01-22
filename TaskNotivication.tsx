// TaskComponent.js
import React, { useEffect, useState } from 'react'
import { View, Button, TextInput, ScrollView, Text } from 'react-native'
import {
  cancelAllNotifications,
  registerForPushNotificationsAsync,
  scheduleNotification,
  getAllScheduledNotifications,
} from './notifications'

const TaskComponent = ({ tasks }) => {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [taskTitle, setTaskTitle] = useState('Test Task')
  const [scheduledTasks, setScheduledTasks] = useState([])

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))
  }, [])

  const handleScheduleNotifications = () => {
    tasks.forEach((task) => {
      const taskDate = new Date(task.deadLine) // ISO-строка конвертируется в объект Date
      const notificationTime = new Date(taskDate.getTime() - 30 * 60000) // Уведомление за 30 минут до дедлайна

      scheduleNotification(task.title, notificationTime).then(() => {
        console.log(`Уведомление для задачи "${task.title}" запланировано на:`, notificationTime)
      })
    })
  }

  const handleCancelNotifications = () => {
    cancelAllNotifications().then(() => {
      setScheduledTasks([])
    })
  }

  const fetchScheduledNotifications = () => {
    getAllScheduledNotifications().then((notifications) => {
      setScheduledTasks(notifications)
    })
  }

  return (
    <ScrollView style={{ display: 'none' }}>
      <Button title="Schedule Notifications for Tasks" onPress={handleScheduleNotifications} />
      <Button title="Cancel All Notifications" onPress={handleCancelNotifications} />
      <Button title="Show Scheduled Notifications" onPress={fetchScheduledNotifications} />
      {scheduledTasks.map((notification, index) => (
        <View key={index} style={{ marginVertical: 10 }}>
          <Text>{JSON.stringify(notification)}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default TaskComponent
