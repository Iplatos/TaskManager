import React, { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { getDateForButton } from './helpers/helpers'
import { globalStyles } from './styles/styles'

export type DatePickerPropsType = {
  date: Date
  setDate: (date: Date) => void
  isDarkTheme: boolean
}

export const DatePickerComponent = (props: DatePickerPropsType) => {
  const { date, setDate, isDarkTheme } = props
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState<'date' | 'time'>('date')

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || date
    if (mode === 'date') {
      setMode('time')
    } else {
      setShow(false)
    }
    setDate(currentDate)
  }

  const showDateTimePicker = () => {
    setShow(true)
    setMode('date')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isDarkTheme
            ? globalStyles.createTaskBlockDarkButtons
            : globalStyles.createTaskBlockLightButtons,
        ]}
        onPress={showDateTimePicker}
      >
        <Text style={isDarkTheme ? { color: 'white' } : { color: 'black' }}>
          {getDateForButton(date)}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          display="default"
          onChange={onChange}
          minimumDate={new Date()}
          themeVariant="dark"
          locale="ru"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  button: {
    backgroundColor: 'rgb(107, 79, 187)',
    width: 150,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
