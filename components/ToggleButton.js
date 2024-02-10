import React from 'react';
// react native components
import { StyleSheet, Pressable } from 'react-native';
// my components
import CustomText from './CustomText';
// styles
import { Colors } from '../styles/Colors';

const ToggleButton = ({ text, onPress, toggled }) => {
  const containerStyle = [
    styles.container,
    // set bg color if toggled
    toggled ? { backgroundColor: Colors.purple } : { backgroundColor: Colors.lightPurple }, // switch from red
  ];

  // set text color if toggled
  const textStyle = [
    styles.text,
    toggled ? { color: 'white' } : { color: 'black' }, 
  ];

  return (
    <Pressable style={containerStyle} onPress={onPress} >
      <CustomText style={textStyle} text={text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 25,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ToggleButton;