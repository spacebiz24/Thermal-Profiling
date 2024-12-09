import { ScaledSheet } from "react-native-size-matters";
import { LIGHT_COLORS, FONTS, SIZES } from "../../../constants";

const styles = ScaledSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    width : '100%',
  },
  content : {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textBox : {
    height : '35@s',
    width : '200@s',
    borderWidth : '0.5@s',
    paddingLeft : '10@s'
  },
  titleText : {
    fontFamily : FONTS.bold,
    margin : '10@s',
    fontSize : SIZES.medium
  },
  buttonContainer : {
    flexDirection : 'row',
    marginTop : '10@s'
  },
  buttonStyle : {
    margin : '10@s',
    marginLeft : '10@s',
    marginRight : '10@s',
    padding : '5@s',
    paddingLeft : '10@s',
    paddingRight : '10@s',
    borderRadius : '5@s',
    backgroundColor : LIGHT_COLORS.black,
  },
  buttonText : {
    fontFamily : FONTS.bold,
    color : LIGHT_COLORS.white
  },
  closeButton : {
    flex : 1
  }
});

export { styles };