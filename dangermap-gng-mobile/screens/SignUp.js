/* 디비에 있는 admin 아이디/비번 이용해 연동 해보기!! */
// 로그인/로그아웃 상태 확인해야 함 - mypage


import React, {useEffect, useState} from 'react';
import SignUpFinish from './SignUpFinish.js';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { signUp } from '../lib/auth.js';
import { createUser } from '../lib/user.js';

// 회원가입 구현
const onSignUp = async () => {
  try {
    const {user} = await signUp({email, password});
    await createUser({
      id: user.uid,
      displayName,
      photoURL: null,
    });
    Alert.alert('회원가입 성공');
  } catch (e) {
    Alert.alert('회원가입 실패');
  }
};

export default function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const handleSubmitPress = () => {
    setErrorText('');
    if (!email) {
      alert('이메일을 입력하세요.');
      return;
    }
    if (!password) {
      alert('비밀번호를 입력하세요.');
      return;
    }
    if (password !== password2) {
      alert('비밀번호를 확인해주세요.');
      return;
    }
    if (!nickname) {
      alert('닉네임을 입력하세요.');
      return;
    }
    navigation.navigate('SignUpFinish');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>회원가입</Text>
      </View>
      <TextInput
        placeholder={'이메일 입력'}
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={text => setEmail(text)}></TextInput>
      <TextInput
        placeholder={'비밀번호 입력'}
        style={styles.input}
        autoCapitalize="none"
        value={password}
        onChangeText={text => setPassword(text)}></TextInput>
      <TextInput
        placeholder={'비밀번호 확인'}
        style={styles.input}
        autoCapitalize="none"
        value={password2}
        onChangeText={text => setPassword2(text)}></TextInput>
      <TextInput
        placeholder={'닉네임'}
        style={styles.input}
        autoCapitalize="none"
        value={nickname}
        onChangeText={text => setNickname(text)}></TextInput>
      <TouchableOpacity
        style={styles.Btn}
        activeOpacity={0.5}
        onPress={handleSubmitPress}>
        <Text>회원가입</Text>
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
