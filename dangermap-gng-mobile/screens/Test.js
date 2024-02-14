import React, {useState, useEffect} from 'react'
import {
  View,
  TextInput,
  Button,
  Alert,
  FlatList,
  images,
  Image,
  ScrollView,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import storage from '@react-native-firebase/storage'
import {launchImageLibrary} from 'react-native-image-picker'
import {Picker} from '@react-native-picker/picker'
import RNFS from 'react-native-fs'

function Test() {
  const [images, setImages] = useState([]) // 사진
  const [content, setContent] = useState('') // 설명
  const [location, setLocation] = useState('') // 위치
  const [rate, setRate] = useState('') // 위험도(별점 표시)
  const [type, setType] = useState('') // 위험 종류
  const [nickname, setNickname] = useState('') // 닉네임
  const [like, setLike] = useState(0) // 좋아요
  const [dislike, serDislike] = useState(0) // 좋아요

  const [response, setResponse] = useState(null)

  const info = async () => {
    try {
      const user = auth().currentUser // Access the user property directly

      // Now you can use the 'user' object as needed
      const uid = user.uid

      // 2. Firestore에서 해당 유저의 정보 가져오기
      const userDoc = await firestore().collection('user').doc(uid).get()
      const userData = userDoc.data()

      // 3. userData를 기반으로 필요한 작업 수행
      if (userData) {
        const userNickname = userData.nickname
        setNickname(userNickname)
      }
    } catch (error) {
      console.error('Error', 'User information not found.', error.message)
    }
  }

  useEffect(() => {
    info()
  }, [])

  const onSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
        selectionLimit: 3,
      },
      response => {
        if (!response.didCancel && !response.error) {
          const selectedImages = response.assets.filter(image => image.base64) // base64 속성이 있는 이미지만 필터링
          const imagesWithUri = selectedImages.map(image => ({
            ...image,
            content_pic: image.uri,
          })) // content_pic 속성 추가
          setImages(imagesWithUri)
        }
      },
    )
  }

  const infoResgister = async () => {
    try {
      const uploadTasks = images.map(async image => {
        const imageRef = storage().ref(`/dangerPic/${image.fileName}`)
        await imageRef.putString(image.base64, 'base64', {
          contentType: image.type,
        })
        return imageRef.getDownloadURL()
      })

      const uploadedUrls = await Promise.all(uploadTasks)
      console.log('Uploaded image URLs:', uploadedUrls)
    } catch (error) {
      console.error('Error uploading images:', error)
    }
  }

  return (
    <View>
      <ScrollView horizontal>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{uri: image.content_pic}}
            style={{width: 100, height: 100, marginRight: 5}}
          />
        ))}
      </ScrollView>
      <Button title="사진 추가하기" onPress={onSelectImage} />
      <TextInput
        placeholder="content"
        onChangeText={text => setContent(text)}
        value={content}
      />
      <Picker
        selectedValue={type}
        onValueChange={itemValue => setType(itemValue)}>
        <Picker.Item label="교통사고" value="traffic accident" />
        <Picker.Item
          label="보도블록 공사"
          value="sidewalk block construction"
        />
        <Picker.Item label="빙판길" value="icy road" />
        <Picker.Item label="신호등 고장" value="traffic light breakdown" />
        <Picker.Item label="싱크홀" value="sinkhole" />
        <Picker.Item label="웅덩이" value="pool" />
        <Picker.Item label="지하차도 침수" value="underpass flooded" />
        <Picker.Item label="차도 공사" value="road construction" />
        <Picker.Item label="기타" value="etc" />
      </Picker>
      <Picker
        selectedValue={rate}
        onValueChange={itemValue => setRate(itemValue)}>
        <Picker.Item label="5" value="5" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="1" value="1" />
      </Picker>
      <TextInput
        placeholder="location"
        onChangeText={location => setLocation(location)}
        value={location}
      />
      <Button title="안전정보 등록" onPress={infoResgister} />
    </View>
  )
}

export default Test

// adb -s emulator-5554 reverse tcp:4000 tcp:4000
