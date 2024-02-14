import React from 'react';
import {View, Button, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LogoutScreen({navigation}) {
  const logoutUser = async () => {
    try {
      // const userToken = await auth().currentUser.getIdToken();
      const userToken = await AsyncStorage.getItem('userToken');
      // 로그아웃 시에 저장된 토큰 제거
      if (userToken) {      
        await AsyncStorage.removeItem(userToken);
        await auth().signOut();
        Alert.alert('로그아웃 성공', '성공적으로 로그아웃되었습니다.');
        navigation.navigate('Home');
        // 추가적으로 필요한 작업 수행}
      } 
    } catch (error) {
      console.error('로그아웃 오류:', error.message);
      Alert.alert('로그아웃 오류', '로그아웃 중 오류가 발생했습니다.');
      navigation.navigate('Home');
    }
  };

  return (
    <View>
      <Button title="로그아웃" onPress={logoutUser} />
    </View>
  );
}

export default LogoutScreen;
