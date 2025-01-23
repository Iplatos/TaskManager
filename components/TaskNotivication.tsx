// TaskComponent.js
import React, { useEffect, useState } from 'react'
import { View, Button, ScrollView, Text } from 'react-native'
import { registerForPushNotificationsAsync, scheduleNotification } from '../notifications'

const TaskComponent = ({ tasks }) => {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [taskTitle, setTaskTitle] = useState('Test Task')
  const [scheduledTasks, setScheduledTasks] = useState([])

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))
  }, [])

  const handleScheduleNotifications = () => {
    tasks.forEach((task) => {
      const taskDate = new Date(task.deadLine)
      const notificationTime = new Date(taskDate.getTime() - 30 * 60000)

      scheduleNotification(task.title, notificationTime).then(() => {
        console.log(`Уведомление для задачи "${task.title}" запланировано на:`, notificationTime)
      })
    })
  }

  return (
    <ScrollView style={{ display: 'none' }}>
      <Button title="Schedule Notifications for Tasks" onPress={handleScheduleNotifications} />

      {scheduledTasks.map((notification, index) => (
        <View key={index} style={{ marginVertical: 10 }}>
          <Text>{JSON.stringify(notification)}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default TaskComponent
