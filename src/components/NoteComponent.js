import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements';
import React from 'react'

export const HeaderComponent = (props) => {
  const { title } = props;
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.button} {...props}>
        <Icon name="check" type="font-awesome-5" size={18} />
      </TouchableOpacity>
    </View>
  )
}

export const MainComponent = (props) => {
  const { date } = props;
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.date}>Date : {date}</Text>
      <TextInput multiline placeholder='Write Here' style={styles.input} {...props} placeholderTextColor={'grey'} />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  headerContainer: {
    padding: 8,
    backgroundColor: 'moccasin',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 20,
    padding: 8,
    fontWeight: 'bold'
  },
  button: {
    padding: 8
  },
  date: {
    paddingTop: 16,
    paddingLeft: 16,
    color: 'grey'
  },
  input: {
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 16,
    textAlignVertical: 'top',
    color: 'grey',
  }
})