import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, FlatList, TextInput }
  from 'react-native';
import { Icon } from 'react-native-elements';
import realm from '../../store/realm';
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


  useEffect(() => {
    const noteListPage = navigation.addListener('focus', () => {
      const note = realm.objects('Note')
      const noteByDate = note.sorted('date', true)
      setData(noteByDate)
      setSearchText('');
    })
    return noteListPage;
  }, [])

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Notes
        </Text>
      </View>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={{ color: 'grey' }}>Tidak ditemukan</Text>
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
                <Text style={styles.dateText}>
                  {/* {new Date(item.date).toLocaleString("en-US")} */}
                  {dateFormat(item.date)}
                </Text>
              </TouchableOpacity>
            </View>
          )
        }} />
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
      </View>
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
    padding: 8
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
    margin: 8
  }


});
export default NoteListScreen