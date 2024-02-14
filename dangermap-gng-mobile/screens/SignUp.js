import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const SignUpWithEmail = async () => {
    try {
      // 1. Firebase Authentication을 사용하여 유저 생성
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      // 2. 생성된 유저의 UID 가져오기
      const uid = userCredential.user.uid;

      // 3. Firestore에 유저 정보 저장 (닉네임 추가)
      await firestore().collection('user').doc(uid).set({
        email: email,
        nickname: nickname,
        profile_pic: `https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png`,
        // 추가적인 필드도 필요하다면 여기에 추가
      });
      console.log('User signed up successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>회원가입</Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <TextInput
          placeholder={'이메일 입력'}
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={text => setEmail(text)}></TextInput>
        <TextInput
          placeholder={'비밀번호 입력'}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={text => setPassword(text)}></TextInput>
        <TextInput
          placeholder={'비밀번호 확인'}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}></TextInput>
        <TextInput
          placeholder={'닉네임'}
          style={styles.input}
          autoCapitalize="none"
          value={nickname}
          onChangeText={text => setNickname(text)}></TextInput>
        <TouchableOpacity
          style={styles.registerBtn}
          activeOpacity={0.5}
          onPress={SignUpWithEmail}>
          <Text style={{color: '#ffffff', fontSize: 16}}>회원가입</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
  },
  input: {
    flex: 0.05,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 5,
    marginTop: 20,
    fontSize: 15,
    width: 380,
    height: 60,
  },
  registerBtn: {
    flex: 0.05,
    backgroundColor: '#326CF9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 50,
    marginBottom: 80,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 15,
    width: 380,
    height: 60,
  },
});
