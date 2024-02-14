import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function AccountDelete({navigation}) {
  const accountDelete = () => {
    try {
      let user = auth().currentUser;
      user
        .delete()
        .then(() => console.log('User deleted'))
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error.message);
    }
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>우리동네 위험지도를 탈퇴하기 전,</Text>
        <Text style={styles.text2}>확인해주세요.</Text>
      </View>
      <View>
        <Text style={styles.text3}>
          1. 회원 탈퇴 시, 현재 로그인된 아이디는 즉시 탈퇴 처리됩니다.
        </Text>
        <Text style={styles.text3}>
          2. 탈퇴 시 회원 정보 및 등록한 게시물 이용 기록이 모두 삭제됩니다.
        </Text>
        <Text style={styles.text3}>
          3. 회원 정보 및 서비스 이용 기록을 모두 삭제되며, 삭제된 데이터는
          복구되지 않습니다.
        </Text>
        <Text style={styles.text3}>
          4. 현재 로그인된 아이디로 작성된 안전 정보가 등록되어 있을 경우, 탈퇴
          시 모든 정보는 삭제 처리됩니다.
        </Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          style={styles.Btn}
          activeOpacity={0.8}
          onPress={accountDelete}>
          <Text style={{color: '#ffffff', fontSize: 16}}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  header: {
    flex: 0.3,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 50,
    marginLeft: 20,
  },
  text: {
    flex: 0.4,
    marginTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  text2: {
    flex: 0.4,
    marginTop: 5,
    marginBottom: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  text3: {
    flex: 0.4,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontSize: 15,
    color: '#545454',
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
