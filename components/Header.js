import React from 'react';
// react native components
import { View, StyleSheet, Button } from 'react-native';
// my components
import CustomText from './CustomText';

const Header = ({ navigation, text, back, numberOfLines }) => {

  // go back to the previous screen
  const onBackPress = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {back && ( // if back is true, show the back button
        <View style={styles.backButton}>
          <Button
            onPress={onBackPress}
            title="Back"
          />
        </View>
      )}
      <View>
        <CustomText style={styles.title} text={text} font="bold" numberOfLines={numberOfLines} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginLeft: 10,
    justifyContent: 'left',
    flexDirection: 'row',
  },
  title: {
    fontSize: 50,
  },
  backButton: {
    marginTop: 12,
    marginRight: 10,
  },
});

export default Header;