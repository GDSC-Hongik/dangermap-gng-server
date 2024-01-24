// import * as Location from 'expo-location';
// import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import Login from './Login.js';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function SignUpFinish({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.enter} />
      <View style={styles.header}>
        <Text style={styles.text}>회원가입이 완료되었습니다.</Text>
        <Text style={styles.text}>감사합니다.</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.8}
        style={styles.Btn}>
        <Text>로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  enter: {
    flex: 0.2,
  },
  header: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  text: {
    flex: 0.3,
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
  searchId: {
    flex: 0.3,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 20,
    marginLeft: 180,
    marginRight: 10,
  },
  searchPW: {
    flex: 0.3,
    paddingVertical: 15,
    paddingHorizontal: 13,
    marginTop: 20,
    marginLeft: 0,
    marginRight: 90,
  },
  IdPw: {
    flex: 0.3,
    flexDirection: 'row',
  },
});
