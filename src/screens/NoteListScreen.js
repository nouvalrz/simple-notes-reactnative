import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList, TextInput, Image }
  from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import realm from '../../store/realm';
import { Alert } from 'react-native';
import { useBackHandler } from '@react-native-community/hooks';
const NoteListScreen = (props) => {
  const { navigation } = props;

  // const options = {
  //   weekday: "long",
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // };
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('');
  const [isEdit, setIsEdit] = useState(false);


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

  const searchData = (query) => {
    const dataFromDatabase = realm.objects('Note').sorted('date', true)

    const searchedData = dataFromDatabase.filter((item) => {
      const itemData = item.note.toLowerCase()
      const queryData = query.toLowerCase()
      return itemData.indexOf(queryData) > -1;
    })
    setData(searchedData)
    setSearchText(query)
  }

  const setCheckBox = (id, value) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        item.checkedStatus = !value;
      }
      return item;
    })

    setData(newData);
  }

  const changeIsEdit = () => {
    if (isEdit) {
      const newData = data.map((item) => {
        item.checkedStatus = false;
        return item;
      })

      setData(newData);
    }
    setIsEdit(!isEdit)
  }

  const removeNotes = (checkTrue) => {
    realm.write(() => {
      checkTrue.forEach((val) => {
        const data = realm.objects('Note').filtered(`id = ${val}`)
        realm.delete(data)
      })
    })
    collectNotes()
    setIsEdit(false);
    if (checkTrue.length !== 0) {
    } else {
      alert('Anda belum memilih notes!')
    }

  }

  const removeAlert = () => {

    const checkTrue = [];

    data.forEach((item) => {
      if (item.checkedStatus) {
        checkTrue.push(item.id)
      }
    })

    console.log(checkTrue)
    if (checkTrue.length !== 0) {
      Alert.alert('Alert', 'Apakah yakin ingin menghapus notes', [
        {
          text: "BATAL",
          onPress: () => null
        },
        {
          text: "YAKIN",
          onPress: () => removeNotes(checkTrue)
        }

      ])
    } else {
      alert("Tidak ada catatan yang dipilih")
    }

  }

  const collectNotes = () => {
    const note = realm.objects('Note')
    const noteByDate = note.sorted('date', true)
    const newDataWithCheckbox = noteByDate.map((item) => {
      item.checkedStatus = false
      return item
    })
    setData(newDataWithCheckbox)
  }

  useEffect(() => {
    const noteListPage = navigation.addListener('focus', () => {
      collectNotes();
      setSearchText('');
    })
    return noteListPage;
  }, [])

  useBackHandler(() => {
    if (isEdit) {
      setIsEdit(!isEdit)
      return true
    }
    return false
  })
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Notes
        </Text>
        {
          data.length !== 0 ?
            <TouchableOpacity style={styles.editButton} onPress={() => changeIsEdit()}>
              {
                isEdit ? <Text style={{ color: 'grey' }}>Cancel</Text> : <Text style={{ color: 'grey' }}>Edit</Text>
              }
            </TouchableOpacity> : null
        }
      </View>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={{ color: 'grey' }}>Tidak ada catatan</Text>
          </View>
        }
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        ListHeaderComponent={
          <View style={styles.searchBox}>
            <Icon name='search' type='font-awesome' size={18} style={styles.searchIcon} color='grey' />
            <TextInput
              placeholder='Search here'
              style={styles.searchInput}
              placeholderTextColor='grey'
              onChangeText={(text) => searchData(text)}
              value={searchText}
            />
          </View>
        }
        renderItem={({ item }) => {
          return (
            <View style={styles.mainDataContainer}>
              <TouchableOpacity style={styles.noteButton} onPress={() => navigation.navigate('EditNote', { id: item.id })}>
                <View style={styles.noteContainer}>
                  <Text style={styles.noteText}>
                    {item.note}
                  </Text>
                </View>
                <View>
                  {
                    item.image !== '' ? <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={{ width: 80, height: 80, borderRadius: 15, marginBottom: 12 }} /> : null
                  }
                </View>
                <Text style={styles.dateText}>
                  {/* {new Date(item.date).toLocaleString("en-US")} */}
                  {dateFormat(item.date)}
                </Text>
              </TouchableOpacity>
              {
                isEdit ?
                  <CheckBox size={20} containerStyle={styles.checkBox} onPress={() => setCheckBox(item.id, item.checkedStatus)} checked={item.checkedStatus} />
                  : null
              }
            </View>
          )
        }} />
      {
        !isEdit ?
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("CreateNote")}
            >
              <Icon name="plus" type="antdesign"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View> :
          <TouchableOpacity style={styles.deleteButton} onPress={() => removeAlert()}>
            <Icon name='delete' type='antdesign' size={20} color='white' />
            <View style={styles.containerDeleteText}>
              <Text style={styles.deleteText}>Delete</Text>
            </View>
          </TouchableOpacity>
      }
    </View>)
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    padding: 8,
    backgroundColor: 'moccasin',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    padding: 8,
    fontWeight: 'bold',
    color: 'black'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16
  },
  addButton: {
    backgroundColor: 'pink',
    padding: 16,
    borderRadius: 100
  },
  flatListContainer: {
    padding: 8,
  },
  mainDataContainer: {
    margin: 8,
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  noteButton: {
    flex: 1,
    padding: 8,
    margin: 8
  },
  noteContainer: {
    maxHeight: 40,
    paddingBottom: 10
  },
  noteText: {
    textAlign: 'justify',
    color: 'grey',
    fontWeight: "600"
  },
  dateText: {
    fontSize: 12,
    color: 'grey'
  },
  searchBox: {
    flexDirection: 'row',
    borderWidth: 1,
    margin: 8,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center'
  },
  searchIcon: {
    padding: 8,
    paddingRight: 0
  },
  searchInput: {
    height: 30,
    padding: 8,
    flex: 1,
    color: 'grey'
  },
  emptyList: {
    alignItems: 'center',
    margin: 8,
  },
  checkBox: {
    paddingHorizontal: 0
  },
  editButton: {
    position: 'absolute',
    right: 8,
    padding: 16
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerDeleteText: {
    marginLeft: 8
  },
  deleteText: {
    color: 'white'
  }


});
export default NoteListScreen