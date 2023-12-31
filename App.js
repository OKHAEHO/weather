import * as Location from 'expo-location';
import React, {useState, useEffect} from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View,ScrollView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const {width : SCREEN_WIDTH} = Dimensions.get("window");
const API_KEY = "8ffd0890cb9899b06945f84f6af618f8";

const icons = {
  "Clouds": "cloudy",
  "Rain": "rainy",
  "Clear": "sunny",
  "Atmosphere":"cloudy-gusts",
  "Snow": "snow",
  "Drizzle":"day-rain",
  "Thunderstorm":"lightning",
}
export default function App() {
  const [city, setCity] = useState("Loading....");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords : {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude},{useGoogleMaps:false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };
  

  useEffect(()=> {
    getWeather();
  },[]);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator="false" contentContainerStyle={styles.weather}>
      {days.length === 0 ? (
        <View style={styles.day}>
          <ActivityIndicator color="white" style={{marginTop:10}} size="large"/></View>
          ) : (
            days.map((day, index) => 
          <View key={index} style={styles.day}>
            <Text style={styles.date}>{new Date(day.dt*1000).toString().substring(0,10)}</Text>
            <View style={{flexDirection:"row", alignItems:"center",justifyContent:"space-between",width:'95%'}}>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
            <Ionicons name={icons[day.weather[0].main]} size={68} color="black" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
        </View>
        )
        )}
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4a7fb',

    },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    fontSize: 60,
    fontWeight: '500'
  },

  weather: {
  },
  day:{
    width:SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal:20,
    
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    fontWeight: '150'
  },
  weatherText: {
    marginTop: -10,
    fontSize: 60,
  },
  description: {
    fontSize:60,
    marginTop:-10,

  },
  tinyText:{
    fontSize:20,
  },
  date: {
    fontSize:30,
  }
});
