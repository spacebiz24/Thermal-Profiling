import React from 'react';
import {View, Text, TouchableOpacity, useColorScheme} from 'react-native';
import { storage } from '../../hooks/storage';
import { styles } from './info.styles';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const Info = ({ navigation }) => {
  console.log(useColorScheme());
  return (
    <View style = {styles.container}>
      <View style = {styles.contentContainer}>
        <Text style = {styles.heading}>Instructions</Text>
       <View style = {styles.instructionContent}>
        <Text></Text>
          <Text style = {styles.text}>1. To import new files, select Add Files and choose files from the file system</Text>
          <Text></Text>
          <Text style = {styles.text}>2. Please select a file under 'stored data'. To view the data in that file, use the options on the left.</Text>
          <Text></Text>
       </View>
      </View>
      <View style = {styles.contentContainer}>
        <Text style = {styles.heading}>Options</Text>
        <View style = {styles.instructionContent}>
            <Text>{useColorScheme()}</Text>
        </View>
      </View>
    </View>
  );
}

export {Info};