import React from 'react';
import {useState} from "react";
import { StyleSheet, Text, View, Alert,TouchableOpacity,Image } from 'react-native';
import { auth, db } from '../config';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Rating  } from "react-native-elements";

const returnBikeImage = 'https://images.ctfassets.net/p6ae3zqfb1e3/3NQndCfv11tmlgEQA4lZXm/7c9e97b71b30670172594f46fe3b8a8b/Screenshot_2021-08-26_at_16.46.30-removebg-preview.png?w=1500&q=60&fm=';

export const ReturnBikeScreen = ({ navigation }) => {
 
  const [ratingState, setRatingState] = useState(0);

  // TODO: actualizar rating
  async function updateUserAndRating(uid) {
    try {
      const userDocRef = doc(db, "usuarios", uid);
      const userDocSnap = await getDoc(userDocRef);
      const parkDocRef = doc(db, "estacionamientos", userDocSnap.data().idUsingRent);
      await updateDoc(userDocRef, {usingRent: false, idUsingRent: ""});
      await updateDoc(parkDocRef, {ratingRent: ratingState});
    } catch (e) {
      console.error("Error updating user: ", e);
    }
  }

  function alertText(title, text) {
    Alert.alert(  
      title,  
      text,  
      [{text: 'OK', onPress: () => console.log('OK Pressed')}]  
  );  
  }

  return (
    <View style={styles.container}>
      <View style={styles.return}>
      <Image source={{ uri: returnBikeImage }}
                    style={styles.imagen}
                  />
        <Rating
        ratingCount={5}
        imageSize={40}
        showRating
        onFinishRating={(rating) => setRatingState(rating)}
        style={styles.rating}
        minValue={1}
        startingValue={0}
        tintColor={"#f2f2f2"}
        ratingTextColor={"#3f2949"}
        />
      </View>
        <View style={styles.containerReturnBtn}>
    <TouchableOpacity onPress={() => {
      updateUserAndRating(auth.currentUser.uid);
      navigation.goBack();
      alertText("Solicitud exitosa", "¡La bicicleta ha sido devuelta con éxito!");}} 
      style={styles.returnBtn}>
      <Text style={styles.text}>Devolver bicicleta</Text>
    </TouchableOpacity> 
  </View>
    </View>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //the container will fill the whole screen.
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  returnBtn: {
    backgroundColor: "#f57c00",
    position: 'relative',
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 3,
    zIndex: 3,
    borderRadius: 16,
    bottom: 30
  },
  return: {
    position: 'relative',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 16,
    bottom: 60
  },
  imagen : { 
    width: 200, 
    height: 200 
  },
  text: {
    fontSize: 18,
    color: '#000'
  },
  containerReturnBtn: { 
    flexDirection: "row" 
  },
  rating: { 
    paddingVertical: 10 
  }
});