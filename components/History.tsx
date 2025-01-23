import { FlatList, Text, View } from 'react-native'
import { StyleSheet } from 'react-native'
import { HistoryProps } from '../types/types'
import { globalStyles } from '../styles/styles'

const History = (props: HistoryProps) => {
  const { tasks, isDarkTheme } = props
  const deadlineCorrectFormat = (isoString: string) => {
    const dateFromISO = new Date(isoString)
    return `${dateFromISO.getDate()}/${dateFromISO.getMonth() + 1}/${dateFromISO.getFullYear()} ${
      dateFromISO.getHours() < 10 ? '0' + dateFromISO.getHours() : dateFromISO.getHours()
    }:${dateFromISO.getMinutes() < 10 ? '0' + dateFromISO.getMinutes() : dateFromISO.getMinutes()}`
  }

  return (
    <View>
      <Text style={[styles.historyTitle, isDarkTheme ? { color: 'white' } : { color: 'black' }]}>
        History
      </Text>{' '}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            key={item.id}
            style={[
              styles.historyElement,
              isDarkTheme ? globalStyles.historyElementDark : globalStyles.historyElementLight,
            ]}
          >
            <Text
              style={[
                { textAlign: 'center', marginVertical: 10 },
                isDarkTheme ? { color: 'white' } : { color: 'black' },
              ]}
            >
              Title:{item.title}
            </Text>

            <Text
              style={[
                { marginVertical: 5, marginLeft: 20, textAlign: 'center' },
                isDarkTheme ? { color: 'white' } : { color: 'black' },
              ]}
            >
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
  historyTitle: {
    marginVertical: 5,
    marginLeft: 20,
    textAlign: 'center',
    fontSize: 30,
  },
  historyElement: {
    marginVertical: 10,

    borderWidth: 1,
    width: 350,
    borderColor: 'black',
    borderStyle: 'solid',
    borderRadius: 5,
  },
  safeAreaContainer: {
    flex: 1,
    paddingTop: 30,
  },
})
export default History
