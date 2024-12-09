import { ScaledSheet } from "react-native-size-matters";
import { SIZES, FONTS, LIGHT_COLORS } from "../../constants";

const styles = ScaledSheet.create({
  parentContainer : {
    flex: 1, 
    alignItems : 'center',
    paddingTop : '10@vs',
  },
  container: {
    flex: 1.5,
    backgroundColor: '#F5FCFF',
    width : '95%',
  },
  chart: {
    flex: 1,
  },
  buttonContainer : { 
    flexDirection : 'row',
    justifyContent : 'space-between',
    margin : '10@s'
  },
  button : {
    padding : '6@s',
    paddingLeft : '10@s',
    paddingRight : '10@s',
    backgroundColor : LIGHT_COLORS.black,
    borderRadius : '3@s'
  },
  buttonText : {
    fontFamily : FONTS.bold,
    color : LIGHT_COLORS.white,
    fontSize : SIZES.small
  },
  textBox : {
    borderWidth : '0.5@s',
    height : '100%',
    margin : 10,
    padding : 10,
    flex : 1,

  }
});

export {styles};