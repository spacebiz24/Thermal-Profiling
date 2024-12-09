import { ScaledSheet } from "react-native-size-matters";
import { SIZES, FONTS, LIGHT_COLORS } from "../../constants";

const styles = ScaledSheet.create({
  container : {
    flex : 1,
    flexDirection : 'row',
    margin : '10@s',
    paddingTop : '6@vs'
  },
  sensorListContainer : {
    flex : 4,
    flexDirection : 'column',
    alignItems : 'center',
    borderRightWidth : '1@s',
    borderColor : LIGHT_COLORS.grey,
    paddingLeft : '2@s',
    paddingRight : '2@s',
    height : '100%'
  },
  heading : {
    fontSize : SIZES.medium - 2,
    fontFamily : FONTS.bold,
  },
  sensorList : {
    flex : 1,
    width : '100%',
    margin : '5@vs',
  },
  sensorButton : {
    margin : '2@s',
    padding : '6@s',
    alignItems : 'center',
    borderBottomWidth : '0.5@s',
    borderColor : LIGHT_COLORS.grey
  },
  
  dataContainer : {
    flex : 9,
    padding : '2@s',
    alignItems : 'center',
    marginTop : '0@s',
    margin : '8@s'
  },
  storedData : {
    flex : 1,
    maxHeight : '60%',
    width : '100%',
    padding : '8@s',
    alignItems : 'center',
    backgroundColor : LIGHT_COLORS.lightGrey,
    borderRadius : '5@s'
  },
  dataList : {
    width : '100%',
    flex : 10,
    borderRadius : '5@s',
    maxHeight : '100%'
  },
  dataComponent : {
    flex : 1,
    flexDirection : 'row',
    padding : '2@s'
  },
  dataItem : {
    flex : 1,
    alignItems : 'center',
    justifyContent : 'center'
  },
  selectedRow : {
    backgroundColor : LIGHT_COLORS.lightGrey,
  },
  dataButton : {
    borderBottomWidth : 1,
    paddingTop : '8@s',
    paddingBottom : '8@s',
    borderColor : LIGHT_COLORS.lightGrey
  },
  information : {
    flex : 1,
    width : '100%',
  },
  checkBoxContainer : {
    padding : '2@s',
    width : '100%',
    justifyContent : 'center',
    flexDirection : 'row'
  },
  addFilesButton : {
    backgroundColor : LIGHT_COLORS.black,
    width : '100%',
    marginTop : '15@vs',
    marginBottom : '5@vs',
    alignItems : 'center',
    justifyContent : 'center',
    borderRadius : '5@s',
    padding : '8@s'
  },
  addFilesText : {
    color : LIGHT_COLORS.white,
    fontFamily : FONTS.bold
  }
  
});


export { styles };