import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon, Image } from 'react-native-elements';
import realm from '../../store/realm';
import { AddImageButtonComponent, HeaderComponent, MainComponent, NoteImagePreview } from '../components/NoteComponent';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const AddNoteScreen = (props) => {
  const { navigation } = props;

  const [tempNote, setTempNote] = useState('');
  const [tempImage, setTempImage] = useState('');

  const saveNote = (newNote) => {
    const allData = realm.objects('Note')
    const dataLength = allData.length;
    let lastIdFromRealm = 0;

    if (dataLength !== 0) {
      lastIdFromRealm = allData[dataLength - 1].id;
    }

    if (newNote !== '') {
      realm.write(() => {
        realm.create("Note", {
          id: dataLength === 0 ? 1 : lastIdFromRealm + 1,
          note: newNote,
          date: new Date().toISOString(),
          image: tempImage
        })
      })
      Alert.alert('Berhasil!', 'Catatan telah tersimpan', [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ])
      const data = realm.objects("Note");
      console.log(data);
    } else {
      alert("Catatan Kosong!");
    }
  }

  const currentDate = () => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]

    const todayDate = new Date()
    const dateOnly = todayDate.getDate();
    const monthOnly = todayDate.getMonth();
    const yearOnly = todayDate.getFullYear();

    return `${months[monthOnly]} ${dateOnly}, ${yearOnly}`
  }

  const openGallery = async () => {
    const result = await launchImageLibrary({ includeBase64: true });
    setTempImage(result.assets[0].base64)
  }

  const deleteImage = () => {
    setTempImage('')
  }
  return (
    <View style={styles.mainContainer}>
      <HeaderComponent title={"Create"} onPress={() => saveNote(tempNote)} />
      <MainComponent date={currentDate()} onChangeText={(text) => setTempNote(text)} />
      <Image source={{ uri: `data:image/jpeg;base64,${tempImage}` }} width={500} height={100} />
      {
        tempImage === '' ? <AddImageButtonComponent onPress={() => openGallery()} /> :
          <NoteImagePreview addImageOnPress={() => openGallery()} deleteImageOnPress={() => deleteImage()} imageSource={tempImage} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },

})

export default AddNoteScreen;