import realm from "."

export const StudentSchema = {
  name: 'Student',
  properties:{
    id: 'int'
    name: 'string',
    telp: 'string',
    address: 'string'
  },
  primaryKey: 'id'
}

realm.write(()=>{
  realm.create('Student', {
    id: 1,
    name: 'Asal',
    telp: 'Asal',
    address: 'Asal'
  })
})

const data = realm.objects('Student')


const currentDate = new Date().toISOString();