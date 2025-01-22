import React from 'react'
import { View, Button, Text, Image, ScrollView } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { StyleSheet } from 'react-native'

type FileType = {
  uri: string
  name: string
  type: string
}

type PropsType = {
  files: FileType[]
  setFiles: (files: FileType[]) => void
}

const FileUploader = (props: PropsType) => {
  const { files, setFiles } = props

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      console.log('Выбранное изображение:', result)

      if (!result.canceled && result.assets && result.assets[0]) {
        const file: FileType = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || 'Selected Image',
          type: 'image',
        }

        setFiles((prevFiles) => [...prevFiles, file])
      }
    } catch (error) {
      console.error('Ошибка выбора изображения:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Выбрать изображение" onPress={pickImage} />
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
  pickedImages: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  imageContainer: {
    marginTop: 10,
    backgroundColor: 'yellow',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
})

export default FileUploader
