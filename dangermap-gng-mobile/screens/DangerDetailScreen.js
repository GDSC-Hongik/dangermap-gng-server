import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';

const DangerDetailScreen = ({route}) => {
  const {item} = route.params; // 데이터 넘겨 받음

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
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
  },
});

export default DangerDetailScreen;
