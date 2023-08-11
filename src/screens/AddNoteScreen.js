import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import realm from '../../store/realm';
import { HeaderComponent, MainComponent } from '../components/NoteComponent';

const AddNoteScreen = (props) => {
  const { navigation } = props;

  const [tempNote, setTempNote] = useState('');

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
          date: new Date().toISOString()
        })
      })
      alert("Catatan Berhasil Disimpan!");
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

  return (
    <View style={styles.mainContainer}>
      <HeaderComponent title={"Create"} onPress={() => saveNote(tempNote)} />
      <MainComponent date={currentDate()} onChangeText={(text) => setTempNote(text)} />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
})

export default AddNoteScreen;