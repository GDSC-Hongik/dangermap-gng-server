import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function MyPage({navigation}) {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.section}
        activeOpacity={0.5}
        onPress={() => navigation.navigate('MyPageEdit')}>
        <Text style={styles.font}>내 정보 수정</Text>
      </TouchableOpacity>
      <View style={styles.sectionLine} />
      <TouchableOpacity
        style={styles.section}
        activeOpacity={0.5}
        onPress={() => navigation.navigate('MySafety')}>
        <Text style={styles.font}>내가 쓴 안전정보</Text>
      </TouchableOpacity>
      <View style={styles.sectionLine} />
      <TouchableOpacity
        style={styles.section}
        activeOpacity={0.5}
        onPress={() => navigation.navigate('AccountDelete')}>
        <Text style={styles.font}>회원 탈퇴</Text>
      </TouchableOpacity>
      <View style={styles.sectionLine} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  section: {
    flex: 0.1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sectionLine: {
    borderTopWidth: 0.5,
    opacity: 0.5,
  },
  font: {
    fontSize: 16,
    marginLeft: 25,
    marginTop: 18,
    fontWeight: 'bold',
  },
});
