import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  response,
  Pressable,
  Platform,
  ActivityIndicator,
  Button,
} from 'react-native';

export default function MyPageEdit({navigation}) {
  const [myNickname, setMyNickname] = useState('');
  const [profile, setProfile] = useState();
  const [response, setResponse] = useState(null);

  const info = async () => {
    try {
      const user = auth().currentUser; // Access the user property directly

      // Now you can use the 'user' object as needed
      const uid = user.uid;

      // 2. Firestore에서 해당 유저의 정보 가져오기
      const userDoc = await firestore().collection('user').doc(uid).get();
      const userData = userDoc.data();

      // 3. userData를 기반으로 필요한 작업 수행
      if (userData) {
        const userNickname = userData.nickname;
        const userProfile = userData.profile_pic;
        setMyNickname(userNickname);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error', 'User information not found.', error.message);
    }
  };

  useEffect(() => {
    info();
  }, []);

  const onSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
      },
      res => {
        if (res.didCancel) return;
        setResponse(res);
      },
    );
  };

  const profileUpload = async () => {
    if (response) {
      const user = await auth().currentUser;
      const uid = user.uid;
      try {
        const asset = response.assets[0];
        const reference = storage().ref(`/profile/${asset.fileName}`); // 업로드할 경로 지정

        if (Platform.OS === 'android') {
          await reference.putString(asset.base64, 'base64', {
            contentType: asset.type,
          });
        }

        const imageUrl = await reference.getDownloadURL();
        setProfile(imageUrl);

        await firestore().collection('user').doc(uid).update({
          nickname: myNickname,
          profile_pic: imageUrl,
        });
          console.log('닉네임과 프로필 사진이 성공적으로 업데이트되었습니다.');
      } catch (error) {
        console.error('Firestore에 닉네임 또는 프로필 사진을 업데이트하는 중 오류 발생:', error);
    }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profile}>
        <Pressable style={styles.profileImage} onPress={onSelectImage}>
          <Image
            style={styles.profileImage}
            source={response ? {uri: response?.assets[0]?.uri} : {uri: profile}}
          />
        </Pressable>
        <Pressable>
          <TextInput
            placeholder={myNickname}
            style={styles.nickname}
            value={myNickname}
            onChangeText={text => setMyNickname(text)}></TextInput>
        </Pressable>
        <TouchableOpacity style={styles.button} onPress={profileUpload}>
          <Text>프로필 저장</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionLine} />
      <TouchableOpacity
        style={styles.section}
        activeOpacity={0.5}
        onPress={() => navigation.navigate('MyPasswordEdit')}>
        <Text style={styles.font}>비밀번호 변경</Text>
      </TouchableOpacity>
      <View style={styles.sectionLine} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profile: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
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
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 100,
  },
  button: {
    flex: 0.05,
    backgroundColor: '#BAC6FD',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    fontSize: 16,
    width: 130,
    height: 30,
    border: 'none',
    marginBottom: 10,
  },
});
