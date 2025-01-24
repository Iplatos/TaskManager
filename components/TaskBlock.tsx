import { FlatList, Image, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import MapForCreatedTask from './MapForCreatedTasks'
import { deadlineCorrectFormat } from '../helpers/helpers'
import { TaskBlockProps } from '../types/types'
import { globalStyles } from '../styles/styles'

const TaskBlock = (props: TaskBlockProps) => {
  const { tasks, deleteTask, isDarkTheme } = props
  console.log('taskBlock', tasks)

  return (
    <View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            key={item.id}
            style={[
              styles.taskElement,
              isDarkTheme ? globalStyles.taskElementDark : globalStyles.taskElementLight,
            ]}
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
                  source={require('./../assets/location.png')}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ marginVertical: 10, marginLeft: 20 }}>No</Text>
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
            <MapForCreatedTask location={item.location} />
            <TouchableOpacity
              style={[
                styles.button,
                isDarkTheme ? globalStyles.deleteButtonDark : globalStyles.deleteButtonLight,
              ]}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={isDarkTheme ? { color: 'white' } : { color: 'black' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 40,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    left: 100,
  },
  taskElement: {
    marginBottom: 10,
    borderWidth: 1,
    width: 350,
    borderColor: 'black',
    borderStyle: 'solid',
    borderRadius: 5,
  },
})
export default TaskBlock
