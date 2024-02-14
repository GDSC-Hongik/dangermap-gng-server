import React, {useEffect, useState} from 'react';
import {updatePassword} from 'firebase/auth';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function SignUp({navigation}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const changePassword = async () => {
    const user = auth().currentUser;
    try {
      if (newPassword === newPasswordConfirm) {
        await user.updatePassword(newPassword);
        navigation.navigate('MyPage');
      }
    } catch (error) {
      Alert('비밀번호가 다릅니다.');
      console.log('에러: ', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>비밀번호 변경</Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <TextInput
          placeholder={'새로운 비밀번호 입력'}
          style={styles.input}
          autoCapitalize="none"
          secureTextEntry
          value={newPassword}
          onChangeText={text => setNewPassword(text)}></TextInput>
        <TextInput
          placeholder={'새로운 비밀번호 확인'}
          style={styles.input}
          autoCapitalize="none"
          secureTextEntry
          value={newPasswordConfirm}
          onChangeText={text => setNewPasswordConfirm(text)}></TextInput>
        <TouchableOpacity
          style={styles.Btn}
          activeOpacity={0.5}
          onPress={changePassword}>
          <Text style={{color: '#ffffff', fontSize: 16}}>비밀번호 확인</Text>
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
  Btn: {
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
