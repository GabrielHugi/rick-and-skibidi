import React from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={'Search...'}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
      <View style={styles.buttonContainer}>
        <Button title="Search" onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: '20%',
  },
});