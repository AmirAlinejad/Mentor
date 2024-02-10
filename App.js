import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from "react";
import { filterKeywordsOpenAI, scoreMentor } from "./functions/functions";

export default function App() {
  const [response, setResponse] = useState("");

  const generateKeywords = async () => {
    // disabled for now to avoid OpenAI charges
    // setResponse(await filterKeywordsOpenAI("The quick brown fox jumps over the lazy dog."));
  };

  return (
    <View style={styles.container}>
      <Button title="Generate Text" onPress={generateKeywords} />
      <Text>{response}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
