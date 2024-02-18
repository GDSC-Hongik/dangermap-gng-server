import React from 'react'
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native'
import {Icon} from 'react-native-elements'
const DangerDetailScreen = ({route}) => {
  const {item} = route.params // 데이터 넘겨 받음

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.dangerType}>{item.danger_type}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <View style={{flexDirection: 'row'}}>
        {/* <Icon
                 name="thumbs-up"
                 size={20}
                 color="blue"
                 style={{marginLeft: 5}}
               /> */}
        <Text style={{marginRight: 3}}>좋아요 {item.like}</Text>
        {/* <Icon
                 name="thumbs-down"
                 size={20}
                 color="red"
                 style={{marginLeft: 5}}
               /> */}
        <Text style={{marginRight: 3}}>싫어요 {item.dislike}</Text>
      </View>
      <Text>{item.content}</Text>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dangerType: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  content: {
    fontSize: 18,
    backgroundColor: 'gray',
  },
})

export default DangerDetailScreen
