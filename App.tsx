import { StyleSheet, View, Text, TextInput, Button, Image, Alert, TouchableOpacity, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Axios from 'axios'

const Item = ({ name, email, bidang, onPress, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: `https://robohash.org/${name}` }} style={styles.avatars} />
      </TouchableOpacity>
      <View style={styles.desc}>
        <Text style={styles.descNama}>{name}</Text>
        <Text style={styles.descEmail}>{email}</Text>
        <Text style={styles.descBidang}>{bidang}</Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.Delete}>x</Text>
      </TouchableOpacity>
    </View>
  )
}
const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bidang, setBidang] = useState("");
  const [users, setUsers] = useState([]);
  const [button, setButton] = useState("Simpan");
  const [selectedUser, setSelectedUser] = useState({}); 

  useEffect(() => {
    getData();
  }, []);
  // -----------------------
  const submit = () => {
    const data = {
      name,
      email,
      bidang,
    }
    if (button === 'Simpan') {
      Axios.post('http://192.168.1.10:3004/users', data)
        .then(res => {
          console.log('res: ', res);
          setName("");
          setEmail("");
          setBidang("");
          getData();
        })
    } else if (button === 'Update') {
      Axios.put(`http://192.168.1.10:3004/users/${selectedUser.id}`, data)
        .then(res => {
          console.log('res Update: ', res);
          setName("");
          setEmail("");
          setBidang("");
          getData();
          setButton("Simpan");
        })
    }
  }

  const getData = () => {
    Axios.get('http://192.168.1.10:3004/users')
      .then(res => {
        setUsers(res.data);
      })
  }

  const selectItem = (item) => {
    setSelectedUser(item);
    setName(item.name);
    setEmail(item.email);
    setBidang(item.bidang);
    setButton("Update")
  }

  const deleteItem = (item) => {
    Axios.delete(`http://192.168.1.10:3004/users/${item.id}`)
    getData();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Local API (Json Server)</Text>
      <Text style={{ marginBottom: 12 }}>Masukan Jurusan Mahasiswa</Text>
      <TextInput placeholder='Nama Lengkap' style={styles.input} value={name} onChangeText={(value) => setName(value)} />
      <TextInput placeholder='Email' style={styles.input} value={email} onChangeText={(value) => setEmail(value)} />
      <TextInput placeholder='Bidang' style={styles.input} value={bidang} onChangeText={(value) => setBidang(value)} />
      <Button title={button} onPress={submit} />
      <View style={styles.Line} />
      {users.map(user => {
        return (
          <Item
            key={user.id}
            name={user.name}
            email={user.email}
            bidang={user.bidang}
            onPress={() => selectItem(user)}
            onDelete={() => Alert.alert(
              'Peringatan',
              'Anda yakin akan menghapus user ini?',
              [
                {
                  text: 'Tidak',
                  onPress: () => console.log('button tidak')
                },
                {
                  text: 'Ya',
                  onPress: () => deleteItem(user)
                }
              ])} />
        )
      })}
    </View>
  )
}


export default App

const styles = StyleSheet.create({
  container: { padding: 20 },
  textTitle: { textAlign: 'center', marginBottom: 20 },
  Line: { height: 2, backgroundColor: 'black', marginVertical: 20 },
  input: { borderWidth: 1, marginBottom: 12, borderRadius: 25, paddingHorizontal: 18 },
  itemContainer: { flexDirection: 'row' },
  avatars: { width: 80, height: 80, borderRadius: 100, backgroundColor: 'white' },
  desc: { marginLeft: 18, marginBottom: 50, flex: 1 },
  descNama: { fontSize: 20, fontWeight: 'bold' },
  descEmail: { fontSize: 16 },
  descBidang: { fontSize: 12, marginTop: 8 },
  Delete: { fontSize: 30, fontWeight: 'bold', color: 'red' }
})