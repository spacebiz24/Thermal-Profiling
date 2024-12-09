import React, {useState} from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { styles } from './modal.styles';
import { renameFile, deleteFile } from '../../../hooks/dataHelpers';
import { useColorScheme } from 'react-native';
import { DARK_COLORS, LIGHT_COLORS } from '../../../constants';

const Popup = ({setModalVisible, selectedFile, setSelectedFile}) => {
  const fileName = selectedFile.split('.')[0];
  const isDarkMode = useColorScheme() === 'dark';
  const [text, setText] = useState(fileName);
  return (
    <View style = {styles.container}>
      <View style = {[styles.content, {backgroundColor : isDarkMode ? DARK_COLORS.black : LIGHT_COLORS.white}]}>
        <Text style = {styles.titleText}>Enter new name for file:</Text>
        <TextInput
          style = {[styles.textBox, {borderColor : isDarkMode ? LIGHT_COLORS.white : DARK_COLORS.black}]}
          defaultValue= {fileName}
          onChangeText = {(text) => {
            setText(text);
          }}
        />
        <View style = {styles.buttonContainer}>
          <TouchableOpacity style = {styles.buttonStyle} onPress = {() => {
            if (text !== fileName) {
              const renamed = renameFile(selectedFile, text + '.txt');
              if (renamed) {
                setSelectedFile(text + '.txt');
                setModalVisible(false);
              } else {
                Alert.alert('File with that name already exists. Please use a different name.');
              }
            } else {
              setModalVisible(false);
            }
          }}>
            <Text style = {styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.buttonStyle} onPress = {() => {
            deleteFile(selectedFile);
            setModalVisible(false);
            setSelectedFile('');
          }}>
            <Text style = {styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.buttonStyle} onPress = {() => setModalVisible(false)}>
            <Text style = {styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export { Popup };