import React, {useEffect, useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import {getDangerData} from './api'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import storage from '@react-native-firebase/storage'

const DangerListScreen = () => {
  const [dangerData, setDangerData] = useState([])

  const navigation = useNavigation()

  const getData = async () => {
    try {
      const element = await getDangerData()
      setDangerData(element)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getData()
  }, [])

  const renderItem = (
    {item}, // 화면에 보여질 거
  ) => (
    <TouchableOpacity
      style={styles.section}
      onPress={() => handleItemPress(item)}>
      <View style={styles.box}>
        {item.content_pics.length > 0 && (
          <Image
            style={styles.image}
            source={{uri: item.content_pics[0]}} // 첫 번째 URL만 사용
          />
        )}
        <View style={styles.information}>
          <View>
            <Text style={styles.type}>{item.danger_type}</Text>
          </View>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.content} numberOfLines={1}>
            {item.content}
          </Text>
          <View
            style={{
              marginLeft: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.rate}>위험수치 {item.danger_rate}</Text>
            <Text style={styles.like}>좋아요 {item.like}</Text>
            <Text style={styles.dislike}>싫어요 {item.dislike}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const handleItemPress = item => {
    navigation.navigate('DangerDetailScreen', {item})
  } // 상세 페이지로 이동 함수

  return (
    <View style={{backgroundColor: '#E6E6E6'}}>
      <FlatList
        data={dangerData}
        keyExtractor={item => item.date.toString()} // 추후 수정
        renderItem={renderItem}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    flex: 0.1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 1,
    height: 120,
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  image: {
    width: '40%',
    backgroundColor: 'black',
  },
  information: {
    flex: 1,
  },
  type: {
    fontSize: 20,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  date: {
    marginLeft: 8,
  },
  content: {
    marginLeft: 8,
    marginRight: 20,
    marginBottom: 10,
  },
  rate: {
    marginRight: 5,
  },
  like: {
    marginRight: 5,
  },
  dislike: {
    marginRight: 5,
  },
})

export default DangerListScreen
