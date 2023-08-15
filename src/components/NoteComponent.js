import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
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

export const AddImageButtonComponent = (props) => {
  return (
    <TouchableOpacity {...props}>
      <View style={styles.imageButton}>
        <Icon name='image' type='entypo' size={20} color='grey' />
        <Text style={styles.imageButtonText}>Add Image</Text>
      </View>
    </TouchableOpacity>
  )
}

export const NoteImagePreview = (props) => {
  const { imageSource, addImageOnPress, deleteImageOnPress } = props;
  return (
    <View style={styles.imageContainer} >
      <Image source={{ uri: `data:image/jpeg;base64,${imageSource}` }} style={{ width: 180, height: 180, borderRadius: 15, marginRight: 20 }} />
      <View>
        <TouchableOpacity onPress={addImageOnPress}>
          <Text style={[styles.textGrey]}>
            <Icon name='edit' type='ant-design' size={15} color={'grey'} />{'  '}
            Change</Text>
        </TouchableOpacity>
        <View style={{ height: 18 }}></View>
        <TouchableOpacity onPress={deleteImageOnPress}>
          <Text style={{ color: 'red' }}>
            <Icon name='delete' type='ant-design' size={15} color={'red'} />{'  '}
            Delete</Text>
        </TouchableOpacity>
      </View>
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
  },
  imageButton: {
    borderColor: 'grey',
    borderRadius: 16,
    borderWidth: 1,
    margin: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  imageButtonText: {
    color: 'grey',
    marginLeft: 10
  },
  imageContainer: {
    padding: 8,
    margin: 8,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textGrey: {
    color: 'grey'
  }
})