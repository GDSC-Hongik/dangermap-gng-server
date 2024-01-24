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

export default function MyNicknameEdit({navigation}) {
  const [nickname, setNickname] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>
          닉네임 수정 저장 누르면 회원정보수정으로
        </Text>
      </View>
      <TextInput
        placeholder={'2~10자 이내의 글자를 입력해주세요.'}
        style={styles.input}
        autoCapitalize="none"
        value={nickname}></TextInput>
      <TouchableOpacity
        style={styles.Btn}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MyPageEdit')}>
        <Text>저장</Text>
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
