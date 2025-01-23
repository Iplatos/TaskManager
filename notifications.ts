import * as Notifications from 'expo-notifications'

export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    alert('Notification permission not granted!')
    return null
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data
  return token
}

export const scheduleNotification = async (title, date) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: 'task reminder',
      },
      trigger: date,
    })
  } catch (error) {
    console.error(error)
  }
}
