import { ScaledSheet } from "react-native-size-matters";
import { LIGHT_COLORS, FONTS, SIZES } from "../../constants";

const styles = ScaledSheet.create({
  container : {
    flex : 1,
    margin : '10@s',
    alignItems : 'center'
  },
  contentContainer : {
    alignItems : 'center'
  },
  heading : {
    fontFamily : FONTS.black
  },
  instructionContent : {
    marginLeft : '5@s',
    marginRight : '5@s'
  },
  text : {
    fontFamily : FONTS.normal,
    textAlign : 'justify'
  },
  radioText : {
    fontFamily : FONTS.bold,
    textDecorationLine : 'none'
  }
});

export {styles};