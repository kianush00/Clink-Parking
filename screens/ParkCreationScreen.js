import React from 'react';
import {useState} from "react";
import { StyleSheet, Text, View, Alert,TextInput,TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { collection, addDoc } from "firebase/firestore"; 

import { db } from '../config';


export const ParkCreationScreen = ({ navigation }) => {
  const [state, setState] = useState({
    nombre: "",
    latitud: "",
    longitud: "",
  });

  function alertText(title, text) {
    Alert.alert(  
      title,  
      text,  
      [{text: 'OK', onPress: () => console.log('OK Pressed')}]  
  );  
  }

  async function writeUserDataAndLeave(name, lat, long) {
    if (name === "" || lat === "" || long === "") {
      alertText("Texto inválido", "Hay campos faltantes. Por favor rellene todos los campos.");
    } else if (isNaN(parseFloat(lat)) || isNaN(parseFloat(long))) {
      alertText("Texto inválido", "Hay campos erróneos.");
    } else {
      try {
        const docRef = await addDoc(collection(db, "estacionamientos"), {
          latitud: lat,
          longitud: long,
          nombre: name,
          ratingPark: 0,
          ratingRent: 0
        });
        console.log("New park written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      alertText("Solicitud exitosa", "¡El estacionamiento ha sido creado con éxito!");
      navigation.goBack();
    }
    
  }

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value })
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.formulario}>
          <TextInput 
            placeholder="Nombre estacionamiento" 
            onChangeText={(value) => handleChangeText("nombre", value)} />
        </View>
        <View style={styles.formulario}>
          <TextInput 
            placeholder="Latitud"
            onChangeText={(value) => handleChangeText("latitud", value)} />
        </View>
        <View style={styles.formulario}>
          <TextInput 
          placeholder="Longitud"
          onChangeText={(value) => handleChangeText("longitud", value)} />
        </View>
        <View style={{ flexDirection:"row" }}>
        <TouchableOpacity onPress={() => writeUserDataAndLeave(state.nombre, state.latitud, state.longitud)} 
        style={styles.salir}>
          <Text style={styles.text}>Guardar</Text>
        </TouchableOpacity> 
      </View>
        
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    padding: 35,
    marginTop: 200,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  formulario: {
    flex: 1,
    padding: 3,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc'
  },
  salir: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#f57c00",
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginTop: 55,
    marginLeft: 12,
    elevation: 3,
    zIndex: 3,
    borderRadius: 16,
  },
  text: {
    fontSize: 15,
    color: '#000'
  }
});