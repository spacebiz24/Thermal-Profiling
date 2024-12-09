import React, { useState, useEffect } from 'react';
import {ScrollView, View, Text, TouchableOpacity, FlatList, Alert, Modal} from 'react-native';
import { styles } from './home.styles';
import { Popup } from './Modal/modal';
import { DARK_COLORS, FONTS, LIGHT_COLORS, SIZES } from '../../constants';
import { storage } from '../../hooks/storage';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DocumentPicker from 'react-native-document-picker';
import { storeInMemory } from '../../hooks/dataHelpers';
import { useColorScheme } from 'react-native';

const sensors = ['Sensor 1', 'Sensor 2', 'Sensor 3', 'Sensor 4', 'Sensor 5', 'Sensor 6', 'Sensor 7', 'Sensor 8', 'Cold Junction', 'Combined Data', 'Average Data'];

const DataElement = ({content, isTitle, isSelectedFile}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const date = new Date(content);
  if(!isNaN(date.getTime())) {
    content = date.getDate()  + "-" + (date.getMonth()+1) + "-" + (date.getFullYear() - 2000);
  }
  return (
    <View style = { styles.dataItem }>
    <Text style = {{ fontFamily : isTitle ? FONTS.bold : FONTS.regular, color : isSelectedFile ? LIGHT_COLORS.black : !isDarkMode ? LIGHT_COLORS.grey : DARK_COLORS.lightGrey}}>{content}</Text>
    </View>
  );
};

const DataComponent = ({name, date, device, selectedFile, setSelectedFile, setTemporaryFilePath, temporaryFilePath, setModalVisible}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const isTitle = name == 'Name';
  const isSelectedFile = name == selectedFile && temporaryFilePath === '';
  const rowStyle = [styles.dataButton];
  if (isSelectedFile) {
    rowStyle.push(styles.selectedRow);
  }
  return (
    <TouchableOpacity style = { rowStyle } onPress={() => {
      if (isTitle) return;
      if (selectedFile == name && temporaryFilePath === '') setSelectedFile('');
      else setSelectedFile(name);
      setTemporaryFilePath('');
    }}>
      <View style = { styles.dataComponent }>
        <DataElement content = {name} isTitle = {isTitle} isSelectedFile = {isSelectedFile} />
        <DataElement content = {date} isTitle = {isTitle} isSelectedFile = {isSelectedFile} />
        {isSelectedFile ? (<View style = {styles.dataItem}><TouchableOpacity onPress = {() => setModalVisible(true)}>
          <Text style = {{fontFamily : FONTS.bold, color : isDarkMode ? DARK_COLORS.mediumGrey : LIGHT_COLORS.grey}}>Edit</Text>
        </TouchableOpacity>
        </View>) :
        <DataElement content = {''} isTitle = {false} isSelectedFile = {isSelectedFile} />}
      </View>
    </TouchableOpacity>
  );
};

const SensorComponent = ({ content, navigation,selectedFile, temporaryFilePath, fileData}) => {
  const isSensor = content.search('Sensor') !== -1;
  let location = temporaryFilePath;
  if (location === '' && selectedFile) {
    const file = fileData.find((elem) => elem.name === selectedFile);
    if (file && file.location) location = file.location;  
  }
  const touchHandler = () => {
    if (selectedFile === '' || !selectedFile) {
      Alert.alert('Please select a file first');
      return;
    }
    navigation.navigate('Chart', {
      content : content,
      selectedFile : selectedFile,
      location : location
    })
  };
  return (
    <TouchableOpacity style = { styles.sensorButton} onPress = {touchHandler}>
        <Text style=  {[{ fontFamily : !isSensor ? FONTS.black : FONTS.bold}]}>{content}</Text>
    </TouchableOpacity>
    );
};

const Home = ({ navigation }) => {
  const [fileData, setFileData] = useState([{
    name : 'Name',
    date : 'Date',
    device : 'Device'
  }]);
  const [selectedFile, setSelectedFile] = useState('');
  const [saveFile, setSaveFile] = useState(false);
  const [temporaryFilePath, setTemporaryFilePath] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    if (storage.contains('files')) {
      const data = [fileData[0], ...JSON.parse(storage.getString('files'))];
      setFileData(data);
    }
  }, [selectedFile, modalVisible]);

  return (
    <View style = {{flex : 1, alignContent : 'center', justifyContent : 'center'}}>
      <View>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
          <Popup setModalVisible={setModalVisible} selectedFile = {selectedFile} setSelectedFile={setSelectedFile}/>
        </Modal>
      </View>
    <View style = { styles.container }>
      <View style = { styles.sensorListContainer }>
        <View style = {{flex : 1, alignItems : 'center', width : '100%'}}>
          <View>
            <TouchableOpacity>
              <Text style = { [styles.heading,{color : !isDarkMode?LIGHT_COLORS.black:''}] }>Sensor Data</Text>
            </TouchableOpacity>
          </View>
          <View style = {styles.sensorList}>
            <FlatList 
              data = { sensors }
              renderItem = {({item}) => <SensorComponent content = {item} navigation = {navigation} selectedFile = {selectedFile} temporaryFilePath = {temporaryFilePath} fileData = {fileData}/>}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </View>
      <View style = { styles.dataContainer }>
        <View style = {{marginBottom : 2}}>
          <Text style = {{fontFamily : FONTS.regular}}><Text style = {{fontSize:SIZES.medium}}>Selected File:</Text> <Text style = {{fontFamily : FONTS.bold}}>{selectedFile?selectedFile:'None'}</Text> {!selectedFile?'':temporaryFilePath?'from SD Card' : 'from App storage'}</Text>
        </View>
        <View style = {styles.storedData}>
          <View style = {{ justifyContent : 'center'}}>
            <TouchableOpacity>
              <Text style = { [styles.heading, {margin : 5, color : DARK_COLORS.black}] }>Saved Data</Text>
            </TouchableOpacity>
          </View>
          <View style = { [styles.dataList, {backgroundColor : isDarkMode ?DARK_COLORS.grey : LIGHT_COLORS.white}] }>
            {fileData.length > 1? <FlatList
              data = {fileData}
              renderItem = {({item}) => <DataComponent name = {item.name} date = {item.date} selectedFile = {selectedFile} setSelectedFile = { setSelectedFile } setTemporaryFilePath = {setTemporaryFilePath} temporaryFilePath = {temporaryFilePath} setModalVisible={setModalVisible}/>}
              keyExtractor = {item => item.name}
            /> : <View style = {{width : '100%', alignItems : 'center', height : '100%', justifyContent : 'center'}}>
              <Text style = {{color : isDarkMode ? DARK_COLORS.white : LIGHT_COLORS.grey, fontFamily : FONTS.bold}}>No files saved.</Text>
            </View>
              }
          </View>
        </View>
        <View style = { styles.information }>
          <TouchableOpacity style = { styles.addFilesButton }  onPress={async () => {
            let pickerResult;
            setSelectedFile('');
            try {
              if (saveFile) {
                pickerResult = await DocumentPicker.pickSingle({
                  presentationStyle: 'fullScreen',
                  allowMultiSelection : false,
                  copyTo : "documentDirectory"
                });
                setTemporaryFilePath('');
                setSelectedFile(storeInMemory(pickerResult));
                //add entry to stored data and make it selected;
              } else {
                pickerResult = await DocumentPicker.pickSingle({
                  presentationStyle: 'fullScreen',
                  allowMultiSelection : false,
                });
                setTemporaryFilePath(pickerResult.uri);
                setSelectedFile(pickerResult.name);
              }
              console.log(pickerResult);
              //save data locally if asked to do so.
              //fetch data from file and put it in variable and send it over through navigation if data is not save locally
            } catch (error) {
              console.log(error)
            }
          }}>
            <Text style = { styles.addFilesText }>Select File</Text>
          </TouchableOpacity>
          <View style = {styles.checkBoxContainer}>
            <TouchableOpacity>
              <Text style = {{fontFamily : FONTS.bold, margin : 5}}>Save selected file</Text>
            </TouchableOpacity>
            <BouncyCheckbox
              size={25}
              fillColor= {LIGHT_COLORS.black}
              unFillColor="#FFFFFF"
              disableText = {true}
              text="Save selected file"
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ 
                fontFamily: FONTS.bold,
                textDecorationLine : 'none'
              }}
              onPress={(isChecked) => {setSaveFile(isChecked)}}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator = {false}>
            <Text style = {{ fontFamily : FONTS.normal, marginBottom : 10, textAlign : 'justify'}}>To import new files, click the 'Select Files' button and choose a file.</Text>
            <Text style = {{ fontFamily : FONTS.normal, marginBottom : 10, textAlign : 'justify'}}>You can optionally save a file to the application's local memory by first selecting the radio button above and then choosing a file.</Text>
            <Text style = {{ fontFamily : FONTS.normal, textAlign : 'justify'}}>To view the data from a selected file, use the options on the left.</Text>
          </ScrollView>
        </View>
      </View>
    </View>
    </View>
  )
};

export { Home };