import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HeaderComponent, MainComponent } from '../components/NoteComponent'
import realm from '../../store/realm';
import { AddImageButtonComponent, NoteImagePreview } from '../components/NoteComponent';

const EditNoteScreen = (props) => {
  const { route, navigation } = props;
  const id = route.params.id;

  const [dataToUpdate, setDataToUpdate] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [tempImage, setTempImage] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const editNote = (text) => {
    setNewNote(text);
    setIsEdit(true);
  }

  const dateFormat = (date) => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]

    const noteDate = new Date(date)
    const dateOnly = noteDate.getDate();
    const monthOnly = noteDate.getMonth();
    const yearOnly = noteDate.getFullYear();

    return `${months[monthOnly]} ${dateOnly}, ${yearOnly}`
  }

  const saveNote = (val) => {
    if (val === '') {
      alert("Note tidak bisa kosong!")
    } else {
      const allData = realm.objects('Note')
      allData.forEach((item) => {
        if (item.id === id && item.note !== val) {
          realm.write(() => {
            item.note = val;
            item.date = new Date().toISOString();
            navigation.navigate('NoteList')
          })
        } else if (item.id === id && item.note === val) {
          alert("Note tetap sama!")
        }
      })

    }
  }

  const openGallery = async () => {
    const result = await launchImageLibrary({ includeBase64: true });
    setTempImage(result.assets[0].base64)
  }

  const deleteImage = () => {
    setTempImage('')
  }

  useEffect(() => {
    const data = realm.objects('Note').filtered(`id = ${id}`);
    setDataToUpdate(data);
  }, [])

  useEffect(() => {
    console.log("state variable");
    console.log(dataToUpdate);
  }, [dataToUpdate])

  return (
    <View style={styles.mainContainer}>
      <HeaderComponent title="Edit" onPress={
        () => saveNote(isEdit ? newNote : dataToUpdate[0].note)
      } />
      {
        dataToUpdate.length !== 0 ?
          <>
            <MainComponent date={dateFormat(dataToUpdate[0].date)} value={isEdit ? newNote : dataToUpdate[0].note} onChangeText={(text) => editNote(text)} />
            {
              dataToUpdate[0].image === '' ? <AddImageButtonComponent onPress={() => openGallery()} /> :
                <NoteImagePreview addImageOnPress={() => openGallery()} deleteImageOnPress={() => deleteImage()} imageSource={dataToUpdate[0].image} />
            }
          </>
          : null
      }

    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  }
})

export default EditNoteScreen