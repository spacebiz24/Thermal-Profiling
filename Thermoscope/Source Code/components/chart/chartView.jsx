import React, { useState, useEffect } from 'react';
import { averageData, getFileData, getSensorData } from '../../hooks/dataHelpers';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, processColor, TextInput, TouchableOpacity,
  useColorScheme
} from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';
import { styles } from './chartView.styles';
import { DARK_COLORS, FONTS, LIGHT_COLORS, STEP } from '../../constants';
import { storage } from '../../hooks/storage';


const colors = ['#e88256', '#f7bc68', '#f5f36c', '#99e35d', '#67f090', '#6bf2f0', '#4377f0', '#e063de', '#7417d1'];

const ChartView = ({route, navigation}) => {
  const { content, selectedFile, location } = route.params;
  const sensorBoolean = [];
  for (let i = 0; i < 9; i++) {
    if (content === 'Combined Data') sensorBoolean.push(true);
    else sensorBoolean.push(false);
  }
  if (parseInt(content.at(-1)) !== NaN) sensorBoolean[parseInt(content.at(-1)) - 1] = true;

  const [sensorData, setSensorData] = useState(null);
  const [start, setStart] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    const getData = async () => {
      getFileData(location).then((dat) => {
        const data = dat.split('\n');
        const sensData = getSensorData(data);
        setSensorData(sensData);
      });
    }
    const comments = storage.contains(selectedFile) ? storage.getString(selectedFile) : '';
    setCommentContent(comments); 
    getData();
  }, []);
  
  useEffect(() => {
    navigation.setOptions({
      headerLeft : () => {
        return (
        <TouchableOpacity onPress={navigation.goBack} style = {{padding : 5}}>
          <Text style = {{fontFamily : FONTS.bold, color : isDarkMode ? '' : LIGHT_COLORS.lightGrey}}>Back</Text>
        </TouchableOpacity>
      );
      }
    })
  })

    const renderData = [];
    for (let i = 0; i < 9; i++) {
      if (sensorBoolean[i]) {
        renderData.push({
          label: i !== 8 ? "S" + (i + 1) : 'Cold Junction',
          values: sensorData ? sensorData[i].slice(STEP * start, STEP + STEP * start) : [],
          config: {
            lineWidth: 1.5,
            drawCircles: true,
            circleRadius : 2,
            drawHighlightIndicators: true,
            color: processColor(colors[i]),
            drawFilled: false,
            fillColor: processColor(colors[i]),
            fillAlpha: 90,
            valueTextSize : 12,
            valueFormatter : '##.0C'
          }
        });
        if (content !== 'Combined Data') break;
      }
    }
    if (content === 'Average Data') {
      renderData.push({
        label: "Average Value",
        values: sensorData ? averageData(sensorData, start) : [],
        config: {
          lineWidth: 1.5,
          drawCircles: true,
          circleRadius : 2,
          drawHighlightIndicators: true,
          color: processColor('#fc030f'),
          drawFilled: false,
          fillColor: processColor('#fc030f'),
          fillAlpha: 90,
          valueTextSize : 12,
          valueFormatter : '##.0C'
        }
      });
    } else if (content === 'Cold Junction') {
      renderData.push({
        label: "Cold Junction Temperature",
        values: sensorData ? sensorData[8].slice(STEP * start, STEP + STEP * start) : [],
        config: {
          lineWidth: 1.5,
          drawCircles: true,
          circleRadius : 2,
          drawHighlightIndicators: true,
          color: processColor('#7417d1'),
          drawFilled: false,
          fillColor: processColor('#7417d1'),
          fillAlpha: 90,
          valueTextSize : 12,
          valueFormatter : '##.0C'
        }
      });
    }
    return (
      <View style={styles.parentContainer}>
        <View>
          <Text style = {{fontFamily : FONTS.bold, marginBottom : 5}}>{content}</Text>
        </View>
        <View style={styles.container}>
          <LineChart style={styles.chart}
            chartDescription = {{text : ''}}
            data={{ dataSets:renderData }}
          />
        </View>
        <View style = {{flex : 1, width : '95%'}}>
          <View style = {styles.buttonContainer}>
            {start > 0 ? (<TouchableOpacity style = {styles.button} onPress={() => setStart(start - 1)}>
              <Text style = {styles.buttonText}>Prev</Text>
            </TouchableOpacity>): <View></View>}
            {sensorData && sensorData[0].length > start * STEP + STEP ?(<TouchableOpacity style = {styles.button} onPress = {() => setStart(start + 1)}>
              <Text style = {styles.buttonText}>Next</Text>
            </TouchableOpacity>) : <View></View>}
          </View>
          <TextInput
              onChangeText={(text) => {
                storage.set(selectedFile, text);
              }}
              style = {[styles.textBox, {borderColor : isDarkMode ? LIGHT_COLORS.white : DARK_COLORS.black}]}
              multiline = {true}
              numberOfLines={10}
              textAlignVertical='top'
              placeholder='Enter comments here'
              defaultValue= {commentContent}
          />
        </View>
      </View>
    );
};

export { ChartView };