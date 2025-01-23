import React from 'react'
import { View, Button, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { StyleSheet } from 'react-native'
import { globalStyles } from '../styles/styles'

type FileType = {
  uri: string
  name: string
  type: string
}

type PropsType = {
  files: FileType[]
  setFiles: (files: FileType[]) => void
  isDarkTheme: boolean
}

const FileUploader = (props: PropsType) => {
  const { files, setFiles, isDarkTheme } = props

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (!result.canceled && result.assets && result.assets[0]) {
        const file: FileType = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || 'Selected Image',
          type: 'image',
        }

        setFiles((prevFiles: any[]) => [...prevFiles, file])
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageButtonBlock}>
        <TouchableOpacity
          style={[
            styles.button,
            isDarkTheme
              ? globalStyles.createTaskBlockDarkButtons
              : globalStyles.createTaskBlockLightButtons,
            !files.length && { position: 'relative', left: 90 },
          ]}
          onPress={pickImage}
        >
          <Text style={isDarkTheme ? { color: 'white' } : { color: 'black' }}>Add Images</Text>
        </TouchableOpacity>
        {files.length && (
          <TouchableOpacity style={styles.button} onPress={() => setFiles([])}>
            <Text style={{ fontSize: 16, color: 'white' }}>Delete image</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.imageContainer} horizontal={true}>
        <View style={styles.pickedImages}>
          {files.map((file, index) => (
            <Image key={index} source={{ uri: file.uri }} style={styles.image} resizeMode="cover" />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: 360,
  },
  imageButtonBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickedImages: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  imageContainer: {
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
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

export default FileUploader
