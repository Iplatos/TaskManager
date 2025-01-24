import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
  headerLightMode: {
    backgroundColor: '#58a987',
    borderColor: 'grey',
  },
  headerDarkMode: {
    backgroundColor: 'grey',
    borderColor: 'black',
  },
  mainDarkMode: {
    backgroundColor: 'black',
  },
  mainLightMode: {
    backgroundColor: 'white',
  },
  createTaskBlockLight: {
    backgroundColor: '#368b67',
  },
  createTaskBlockDark: {
    backgroundColor: 'black',
    borderColor: 'white',
  },
  createTaskBlockDarkInput: {
    backgroundColor: 'black',
    borderColor: 'white',
    color: 'white',
  },
  createTaskBlockLightInput: {
    backgroundColor: 'white',
  },
  createTaskBlockLightButtons: { backgroundColor: 'white', fontSize: 16 },
  createTaskBlockDarkButtons: { backgroundColor: 'gray', fontSize: 16 },
  historyElementDark: { backgroundColor: 'black', borderColor: 'white', borderWidth: 1 },
  historyElementLight: { backgroundColor: 'white' },
  deleteButtonDark: { backgroundColor: 'gray' },
  deleteButtonLight: { backgroundColor: 'white' },
  taskElementDark: { backgroundColor: 'gray' },
  taskElementLight: { backgroundColor: '#368b67' },
})
