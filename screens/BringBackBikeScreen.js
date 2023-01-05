import React from 'react';
import {useState} from "react";
import { StyleSheet, Text, View, Alert,TouchableOpacity,Image } from 'react-native';
import { auth, db } from '../config';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Rating  } from "react-native-elements";

const parkImage = 'https://images.adsttc.com/media/images/5c52/f239/284d/d12a/6f00/0035/large_jpg/11_02.jpg?1548939830';

export const BringBackBikeScreen = ({ navigation }) => {
 
  const [ratingState, setRatingState] = useState(0);

  // TODO: actualizar rating
  async function updateUserAndRating(uid) {
    try {
      const userDocRef = doc(db, "usuarios", uid);
      const userDocSnap = await getDoc(userDocRef);
      const parkDocRef = doc(db, "estacionamientos", userDocSnap.data().idUsingPark);
      await updateDoc(userDocRef, {usingPark: false, idUsingPark: ""});
      await updateDoc(parkDocRef, {ratingPark: ratingState});
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
      <Image source={{ uri: parkImage }}
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
      alertText("Solicitud exitosa", "¡Has retirado tu bicicleta con éxito!");}} 
      style={styles.returnBtn}>
      <Text style={styles.text}>Retirar bicicleta</Text>
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