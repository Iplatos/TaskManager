import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type HeaderPropsType = {
  showCreateTaskBlock: boolean
  setShowCreateTaskBlock: (showCreateTaskBlock: boolean) => void
}

const Header = (props: HeaderPropsType) => {
  const { setShowCreateTaskBlock, showCreateTaskBlock } = props

  return (
    <View style={styles.header}>
      <Text style={styles.h1}>To-do List</Text>

      <TouchableOpacity
        onPress={() => setShowCreateTaskBlock(!showCreateTaskBlock)}
        style={styles.button}
      >
        {showCreateTaskBlock ? (
          <Image
            style={styles.headerImage}
            source={require('./assets/free-icon-close-151882.png')}
          />
        ) : (
          <Image style={styles.headerImage} source={require('./assets/showblock.png')} />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 5,

    backgroundColor: 'red',
    alignItems: 'flex-end',
  },
  h1: {
    fontSize: 25,
    marginEnd: 10,
    fontStyle: 'italic',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 50,
    height: 50,
    left: 17,
  },
  headerImage: {
    width: 35,
    height: 35,
    marginBottom: 5,
  },
})
export default Header
