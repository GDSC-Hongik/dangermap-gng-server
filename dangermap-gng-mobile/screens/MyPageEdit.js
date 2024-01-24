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

export default function MyPageEdit({navigation}) {
  const [nickname, setNickname] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>내 정보 수정 더 만들어야 함</Text>
      </View>
      <TouchableOpacity
        style={styles.Btn}
        activeOpacity={0.5}
        onPress={() => navigation.navigate('MyNicknameEdit')}>
        <Text>닉네임 변경</Text>
      </TouchableOpacity>
      <TextInput
        placeholder={'현재 사용자 닉네임'}
        style={styles.input}
        autoCapitalize="none"
        value={nickname}></TextInput>
      <TouchableOpacity style={styles.Btn} activeOpacity={0.5}>
        <Text>비밀번호 변경</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  header: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  text: {
    flex: 0.4,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 25,
  },
  input: {
    flex: 0.05,
    backgroundColor: '#CEE4F8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    fontSize: 15,
  },
  Btn: {
    flex: 0.05,
    backgroundColor: '#81A0F7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 15,
  },
});
