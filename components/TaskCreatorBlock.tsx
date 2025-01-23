import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import FileUploader from './FileUploader'
import MapForTask from './MapForTask'
import { DatePickerComponent } from './DatePicker'
import { globalStyles } from '../styles/styles'
import { TaskCreatorBlockProps } from '../types/types'

const TaskCreatorBlock = (props: TaskCreatorBlockProps) => {
  const {
    isDarkTheme,
    locationDescription,
    setLocationDescription,
    setShowMap,
    setTaskDescription,
    setTaskTitle,
    showMap,
    taskDescription,
    taskTitle,
    date,
    markerLocation,
    setMarkerLocation,
    setDate,
    files,
    addTask,
    setFiles,
  } = props
  return (
    <View
      style={[
        styles.createTaskBlock,
        isDarkTheme ? globalStyles.createTaskBlockDark : globalStyles.createTaskBlockLight,
      ]}
    >
      <TextInput
        placeholder="Add title"
        value={taskTitle}
        placeholderTextColor={isDarkTheme ? 'white' : 'black'}
        onChangeText={setTaskTitle}
        style={[
          styles.createTaskBlockInput,
          isDarkTheme
            ? globalStyles.createTaskBlockDarkInput
            : globalStyles.createTaskBlockLightInput,
        ]}
      />
      <TextInput
        placeholder="Add description"
        placeholderTextColor={isDarkTheme ? 'white' : 'black'}
        value={taskDescription}
        onChangeText={setTaskDescription}
        style={[
          styles.createTaskBlockInput,
          isDarkTheme
            ? globalStyles.createTaskBlockDarkInput
            : globalStyles.createTaskBlockLightInput,
        ]}
      />
      <TextInput
        placeholder="Add location"
        placeholderTextColor={isDarkTheme ? 'white' : 'black'}
        value={locationDescription}
        onChangeText={setLocationDescription}
        style={[
          styles.createTaskBlockInput,
          isDarkTheme
            ? globalStyles.createTaskBlockDarkInput
            : globalStyles.createTaskBlockLightInput,
        ]}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          paddingRight: 20,
          height: 55,
          borderRadius: 5,
        }}
      >
        <DatePickerComponent isDarkTheme={isDarkTheme} date={date} setDate={setDate} />
        <TouchableOpacity
          style={[
            styles.button,
            isDarkTheme
              ? globalStyles.createTaskBlockDarkButtons
              : globalStyles.createTaskBlockLightButtons,
          ]}
          onPress={() => setShowMap(!showMap)}
        >
          <Text style={isDarkTheme ? { color: 'white' } : { color: 'black' }}>
            {showMap ? 'Hide Map' : 'Show Map'}
          </Text>
        </TouchableOpacity>
      </View>
      <FileUploader isDarkTheme={isDarkTheme} files={files} setFiles={setFiles} />
      <TouchableOpacity
        style={[
          styles.button,
          isDarkTheme
            ? globalStyles.createTaskBlockDarkButtons
            : globalStyles.createTaskBlockLightButtons,
        ]}
        onPress={addTask}
      >
        <Text style={isDarkTheme ? { color: 'white' } : { color: 'black' }}>Add task</Text>
      </TouchableOpacity>

      {showMap && (
        <MapForTask markerLocation={markerLocation} setMarkerLocation={setMarkerLocation} />
      )}
    </View>
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
  button: {
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

export default TaskCreatorBlock
