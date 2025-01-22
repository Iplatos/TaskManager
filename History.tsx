import { FlatList, TouchableOpacity, Text, View } from 'react-native'
import { StyleSheet } from 'react-native'

const History = (props: any) => {
  const { tasks } = props
  const deadlineCorrectFormat = (isoString: string) => {
    const dateFromISO = new Date(isoString)
    return `${dateFromISO.getDate()}/${dateFromISO.getMonth() + 1}/${dateFromISO.getFullYear()} ${
      dateFromISO.getHours() < 10 ? '0' + dateFromISO.getHours() : dateFromISO.getHours()
    }:${dateFromISO.getMinutes() < 10 ? '0' + dateFromISO.getMinutes() : dateFromISO.getMinutes()}`
  }

  return (
    <View>
      <Text style={{ marginVertical: 5, marginLeft: 20, textAlign: 'center' }}>History</Text>{' '}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            key={item.id}
            style={{
              marginVertical: 10,
              backgroundColor: 'white',
              borderWidth: 1,
              width: 350,
              borderColor: 'black',
              borderStyle: 'solid',
              borderRadius: 5,
            }}
          >
            <Text style={{ textAlign: 'center', marginVertical: 10 }}>Title:{item.title}</Text>

            <Text style={{ marginVertical: 5, marginLeft: 20, textAlign: 'center' }}>
              Last updated:{deadlineCorrectFormat(item.updated)}
            </Text>

            <View style={{ flexDirection: 'row' }}></View>
          </View>
        )}
      />
    </View>
  )
}

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
export default History
