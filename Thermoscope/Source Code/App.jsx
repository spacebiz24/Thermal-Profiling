import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, ChartView} from './components';
import { LIGHT_COLORS, FONTS, SIZES, DARK_COLORS } from './constants';
import { useColorScheme } from 'react-native';

const src = require('./assets/drdo-official-logo.png');
const Stack = createNativeStackNavigator();

const HeaderTitle = ({props}) => {
  return  (
      <View style = {{ flex : 0.95, alignItems : 'center'}}>
        <Text style = {{color : LIGHT_COLORS.white, fontFamily : FONTS.bold, fontSize : SIZES.medium}}>Thermoscope</Text>
      </View>
  )
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Home" screenOptions = {{
        contentStyle : {
          backgroundColor : isDarkMode ? DARK_COLORS.black : LIGHT_COLORS.white
        }
      }}>
        <Stack.Screen name = "Home" component={ Home } options = {{
            title : 'Thermoscope',
            headerStyle : {
              backgroundColor : LIGHT_COLORS.black,
            },
            headerTitle : (props) => <HeaderTitle {...props} />,
            // headerRight : () => (
            //   <View style = {{height : 30, width : 30}}>
            //     <Image source = {src} resizeMode='contain' style = {{height : '100%', width : '100%'}}/>
            //   </View>
            // )
          }}/>
        <Stack.Screen name = "Chart" component={ ChartView }  options = {{ 
          title : 'Data Visualizer',
          headerStyle : {
            backgroundColor : LIGHT_COLORS.black,
          },
          headerTitle : (props) => <HeaderTitle {...props} />,
          headerBackVisible : false
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
