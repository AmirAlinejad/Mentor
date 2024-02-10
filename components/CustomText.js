import React from 'react';
// react native components
import { Text } from 'react-native';
// fonts
import { useFonts, Recursive_300Light, Recursive_400Regular, Recursive_800ExtraBold, Recursive_900Black } from '@expo-google-fonts/Recursive';

const CustomText = ({ text, style, font, onPress }) => {
  // load fonts
  let [fontsLoaded, fontError] = useFonts({
    Recursive_300Light,
    Recursive_400Regular,
    Recursive_800ExtraBold,
    Recursive_900Black,
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // change font type based on prop
  const fontType = () => {
    switch (font) {
      case 'light' || 'Light':
        return 'Recursive_300Light';
      case 'regular' || 'Regular':
        return 'Recursive_400Regular';
      case 'bold' || 'Bold':
        return 'Recursive_800ExtraBold';
      case 'black'|| 'Black':
        return 'Recursive_900Black';
      default:
        return 'Recursive_400Regular';
    }
  }

  return (
    <Text style={[style, {fontFamily: fontType()}]} onPress={onPress}>{text}</Text>
  );
}

export default CustomText;