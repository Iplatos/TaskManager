import React, { useState } from 'react'
import { View, Button, Text, Image, ScrollView } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'

// Уточним типы для файлов
type FileType = {
  uri: string
  name: string
  type: string
}

type PropsType = {
  files: FileType[] // Типизируем массив с файлами
  setFiles: (files: FileType[]) => void // Типизируем функцию для обновления массива
}

const FileUploader = (props: PropsType) => {
  const { files, setFiles } = props

  // Функция для выбора документов
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'], // Только PDF и изображения
    })

    console.log('Выбранный файл:', result) // Логируем результат для проверки

    if (result.type === 'success') {
      const file = {
        uri: result.uri,
        name: result.name || 'Document', // Если name отсутствует, используем 'Document'
        type: result.mimeType || 'application/pdf', // Используем корректный MIME-тип
      }
      setFiles((prevFiles) => [...prevFiles, file]) // Добавляем файл в список
    } else {
      console.log('Выбор файла был отменен')
    }
  }

  // Функция для выбора изображения
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, // Качество изображения
    })

    console.log('Выбранное изображение:', result) // Логируем изображение

    if (!result.canceled && result.assets && result.assets[0]) {
      const file = {
        uri: result.assets[0].uri, // Извлекаем URI из первого элемента массива
        name: result.assets[0].fileName || 'Selected Image',
        type: 'image',
      }
      setFiles((prevFiles) => [...prevFiles, file]) // Добавляем изображение в список
    }
  }

  return (
    <ScrollView style={{ flex: 1, padding: 126 }}>
      <Button title="Выбрать документ (PDF)" onPress={pickDocument} />
      <Button title="Выбрать изображение" onPress={pickImage} />

      {files.map((file, index) => (
        <View key={index} style={{ marginVertical: 10 }}>
          {file.type === 'image' ? (
            <Image
              source={{ uri: file.uri }}
              style={{ width: 100, height: 100 }}
              resizeMode="cover"
            />
          ) : (
            <View>
              <Text>{file.name}</Text>
              <Button title="Открыть PDF" onPress={() => console.log(`Открыть ${file.uri}`)} />
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  )
}

export default FileUploader
