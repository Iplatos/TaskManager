import * as Notifications from 'expo-notifications'

export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    alert('Разрешение на уведомления не предоставлено!')
    return null
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data
  console.log('Push token:', token)
  return token
}

export const scheduleNotification = async (title, date) => {
  console.log(`Запланировать уведомление: "${title}" на ${date.toISOString()}`)
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: 'Напоминание о задаче',
      },
      trigger: date, // Проверка
    })
    console.log('Уведомление успешно запланировано')
  } catch (error) {
    console.error('Ошибка при планировании уведомления:', error)
  }
}
