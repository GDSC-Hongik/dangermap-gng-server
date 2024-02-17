import React, {useState, useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import LoginScreen from './Login'
import SignUp from './SignUp'
import SearchPW from './SearchPW'
import HomeScreen from './Home'
import MyPage from './MyPage'
import MyPageEdit from './MyPageEdit'
import AccountDelete from './AccountDelete'
import MySafety from './MySafety'
import MyPasswordEdit from './MyPasswordEdit'
import DangerListScreen from './DangerListScreen'
import DangerDetailScreen from './DangerDetailScreen'
import Test from './Test'
import LogoutScreen from './Logout'
import DangerPost from './DangerPost'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          alignSelf: 'center',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: '',
        }}
        activeOpacity={0.8}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        activeOpacity={0.5}
        options={{title: ''}}
      />
      <Stack.Screen
        name="SearchPW"
        component={SearchPW}
        options={{title: ''}}
      />
      <Stack.Screen
        name="MyPage"
        component={MyPage}
        options={{
          title: '내정보',
        }}
      />
      <Stack.Screen
        name="MyPageEdit"
        component={MyPageEdit}
        options={{title: '회원 정보 수정'}}
      />
      <Stack.Screen
        name="AccountDelete"
        component={AccountDelete}
        options={{title: ''}}
      />
      <Stack.Screen
        name="MySafety"
        component={MySafety}
        options={{title: '내가 쓴 안전정보'}}
      />
      <Stack.Screen
        name="MyPasswordEdit"
        component={MyPasswordEdit}
        options={{title: '비밀번호 수정'}}
      />
      <Stack.Screen
        name="DangerListScreen"
        component={DangerListScreen}
        options={{title: '위험 리스트'}}
      />
      <Stack.Screen
        name="DangerDetailScreen"
        component={DangerDetailScreen}
        options={{title: '상세정보'}}
      />
      <Stack.Screen
        name="Logout"
        component={LogoutScreen}
        options={{title: '로그아웃'}}
      />
      <Stack.Screen
        name="DangerPost"
        component={DangerPost}
        options={{title: '위험정보 등록'}}
      />
      <Stack.Screen name="Test" component={Test} options={{title: '테스트'}} />
    </Stack.Navigator>
  )
}

export default App
