import React, {useState, useEffect} from 'react'
import {Platform, PermissionsAndroid} from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import Geolocation from '@react-native-community/geolocation'
import {useIsFocused} from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import DangerListScreen from './DangerListScreen'

import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'
import {reload} from 'firebase/auth'

const Tab = createBottomTabNavigator()

function MainScreen() {
  return (
    <Tab.Navigator
      initialRouteName="홈"
      screenOptions={{
        tabBarActiveTintColor: '#326CF9',
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 70,
        },
        tabBarItemStyle: {
          marginTop: 10,
          height: 50,
        },
      }}>
      <Tab.Screen
        name="지도"
        component={MapScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="map-sharp"
              style={{color: focused ? '#326CF9' : '#404040'}}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="home"
              style={{color: focused ? '#326CF9' : '#404040'}}
              size={24}
            />
          ),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="설정"
        component={SettingScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="settings-sharp"
              style={{color: focused ? '#326CF9' : '#404040'}}
              size={24}
            />
          ),
          unmountOnBlur: true,
        }}></Tab.Screen>
    </Tab.Navigator>
  )
}

function MapScreen({navigation}) {
  const [location, setLocation] = useState() //useState를 사용하여 location 상태를 관리

  async function requestPermission() {
    // 사용자의 위치 정보 수집 권한을 요청
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 정보 사용 권한 요청',
            message: '위치 정보를 사용하여 지도를 표시합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거절',
            buttonPositive: '수락',
          },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation()
        } else {
          console.log('위치 정보 사용 권한이 거부되었습니다.')
        }
      }
    } catch (err) {
      console.warn('여기 에러', err)
    }
  }

  useEffect(() => {
    requestPermission()
  }, [])

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        })
      },
      error => {
        console.warn('Error getting current location:', error)
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    )
  }

  if (!location) {
    return (
      // location이 없으면 "Splash Screen"을 표시
      <View>
        <Text>Splash Screen</Text>
      </View>
    )
  }

  return (
    // 그렇지 않으면 MapView를 통해 현재 위치를 보여줌
    <>
      <View>
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        />
      </View>
    </>
  )

  /*
  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
        minZoomLevel={10}
        initialRegion={{
          latitude: 37.552635722509,
          longitude: 126.92436042413,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: 37.556944,
            longitude: 126.923917,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </MapView>
    </View>
  )
  */
}

function HomeScreen({navigation}) {
  const handleMapPress = () => {
    // navigation.navigate('MapScreen')
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text style={{color: 'black'}}>검색창</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.map} onPress={() => handleMapPress()}>
          <Text style={{color: 'black'}}>지도 보기</Text>
          <MapScreen />
        </TouchableOpacity>
        <View style={styles.weather}>
          <Text style={{color: 'black'}}>오늘의 날씨</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('DangerPost')}>
          <Text>글쓰기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <DangerListScreen />
      </View>
    </View>
  )
}

function SettingScreen({navigation}) {
  const [logged, setLogged] = useState(false)
  const [userToken, setUserToken] = useState('')

  const isFocused = useIsFocused()

  const confirmLogged = async () => {
    try {
      const user = auth().currentUser

      if (user) {
        const token = await user.getIdToken()
        if (token) {
          setUserToken(token)
          setLogged(true)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    confirmLogged()
  }, [isFocused])

  const logoutUser = async () => {
    try {
      // 로그아웃 시에 저장된 토큰 제거
      if (userToken) {
        await AsyncStorage.removeItem(userToken)
        await auth().signOut()
        Alert.alert('로그아웃 성공', '성공적으로 로그아웃되었습니다.')
        setLogged(false)
        navigation.navigate('Home', {refresh: true})
        // 추가적으로 필요한 작업 수행}
      }
    } catch (error) {
      console.error('로그아웃 오류:', error.message)
      Alert.alert('로그아웃 오류', '로그아웃 중 오류가 발생했습니다.')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionLine} />
      {logged && (
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('MyPage')}>
          <Text style={styles.font}>내정보</Text>
        </TouchableOpacity>
      )}
      <View style={styles.sectionLine} />
      <TouchableOpacity style={styles.section}>
        <Text style={styles.font}>알림받기</Text>
      </TouchableOpacity>
      <View style={styles.sectionLine} />
      <TouchableOpacity style={styles.section}>
        <Text style={styles.font}>약관 및 정책</Text>
      </TouchableOpacity>
      <View style={styles.sectionLine} />
      {logged && (
        <TouchableOpacity style={styles.section} onPress={logoutUser}>
          <Text style={styles.font}>로그아웃</Text>
        </TouchableOpacity>
      )}
      {!logged && (
        <TouchableOpacity
          style={styles.section}
          onPress={() => {
            navigation.navigate('Login')
          }}>
          <Text style={styles.font}>로그인</Text>
        </TouchableOpacity>
      )}
      <View style={styles.sectionLine} />
    </ScrollView>
  )
}

// 처음 어플 키면 홈 화면 보이게끔
// 설정 탭 드가서 내 정보 눌렀을 때
// 1. 로그인 되어 있으면 내정보수정화면으로
// 2. 로그인 안 되어 있으면 로그인 화면으로
// 로그아웃 버튼 누를 시 바로 로그아웃되게

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  footer: {
    height: '50%',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 5,
  },
  searchBar: {
    flex: 1,
    height: '10%',
    margin: 10,
    borderWidth: 2,
    borderColor: '#326CF9',
    borderRadius: 5,
  },
  content: {
    height: '40%',
  },
  map: {
    flex: 1,
    margin: 10,
    borderWidth: 2,
    borderColor: '#326CF9',
    borderRadius: 5,
  },
  weather: {
    flex: 1,
    margin: 10,
    borderWidth: 2,
    borderColor: '#326CF9',
    borderRadius: 5,
  },
})

export default MainScreen
