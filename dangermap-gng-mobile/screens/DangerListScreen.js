import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DangerDetailScreen from './DangerDetailScreen';
import {getDangerData} from './api';

const DangerListScreen = () => {
  const [dangerData, setDangerData] = useState([]);

  const getData = async () => {
    try {
      const element = await getDangerData();
      setDangerData(element);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.title}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{marginLeft: 5}}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = item => {
    navigation.navigate('DangerDetailScreen', {item});
  }; // 상세 페이지로 이동 함수

  return (
    <View>
      <FlatList
        data={dangerData}
        keyExtractor={item => item.date.toString()} // 추후 수정
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  showMoreButton: {
    marginTop: 10,
    backgroundColor: '#326CF9',
    padding: 8,
    alignItems: 'center',
    borderRadius: 5,
  },
  image: {
    marginTop: 10,
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
});

export default DangerListScreen;
