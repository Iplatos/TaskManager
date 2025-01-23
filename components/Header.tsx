import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/styles'
import { HeaderPropsType } from '../types/types'

const Header = (props: HeaderPropsType) => {
  const {
    setShowCreateTaskBlock,
    showCreateTaskBlock,
    showHistory,
    setShowHistory,
    isDarkTheme,
    setIsDarkTheme,
  } = props
  const onHistoryClick = () => {
    setShowHistory(!showHistory)
    setShowCreateTaskBlock(false)
  }
  const onButtonCreateTaskBlockClick = () => {
    setShowHistory(false)
    setShowCreateTaskBlock(!showCreateTaskBlock)
  }

  return (
    <View
      style={[
        styles.header,
        isDarkTheme ? globalStyles.headerDarkMode : globalStyles.headerLightMode,
      ]}
    >
      <Text style={styles.h1}>To-do List</Text>

      <TouchableOpacity onPress={onButtonCreateTaskBlockClick} style={styles.button}>
        {showCreateTaskBlock ? (
          <Image
            style={styles.headerImage}
            source={require('./../assets/free-icon-close-151882.png')}
          />
        ) : (
          <Image style={styles.headerImage} source={require('./../assets/showblock.png')} />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onHistoryClick} style={[styles.button, { marginLeft: 70 }]}>
        <Image style={styles.headerImage} source={require('./../assets/images.png')} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setIsDarkTheme(!isDarkTheme)}
        style={[styles.button, { marginLeft: 140 }]}
      >
        {isDarkTheme ? (
          <Image style={styles.headerImage} source={require('./../assets/lightMode.png')} />
        ) : (
          <Image style={styles.headerImage} source={require('./../assets/darkmode.png')} />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 5,
    borderWidth: 1,
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
