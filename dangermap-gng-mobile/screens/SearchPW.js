import React, {useEffect, useState} from 'react';
import SearchPWFinish from './SearchPWFinish';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function SearchPW({navigation}) {
  const [email, setEmail] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>비밀번호 찾기</Text>
      </View>
      <TextInput
        placeholder={'가입 시 사용한 이메일을 입력하세요.'}
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={text => setEmail(text)}></TextInput>
      <TouchableOpacity
        style={styles.Btn}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('SearchPWFinish')}>
        <Text>임시 비밀번호 생성하기</Text>
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
    flex: 0.5,
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
