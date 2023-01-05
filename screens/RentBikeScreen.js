import React from 'react';
import { StyleSheet, Text, View, Image,Alert,TouchableOpacity } from 'react-native';
import { Rating  } from "react-native-elements";
import { auth, db } from '../config';
import { doc, updateDoc } from "firebase/firestore";

const rentBikeImage = 'https://static.thenounproject.com/png/1332193-200.png';

export const RentBikeScreen = ({ navigation, route }) => {

  async function updateUser(uid, parkId) {
    const docRef = doc(db, "usuarios", uid);
    try {
      await updateDoc(docRef, { usingRent: true, idUsingRent: parkId});
    } catch (e) {
      console.error("Error updating document: ", e);
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
       <Image source={{ uri: rentBikeImage }}
                    style={styles.rentBikeImg}
                  />
      <View style={styles.imagen}>
         <Text style={styles.textPopup}>¿Desea rentar una bicicleta?</Text>
         <Text style={styles.textTarifa}>Tarifa: CLP$50/minuto</Text>
        <Rating
        ratingCount={5}
        fractions={1}
        imageSize={35}
        showRating
        readonly
        showReadOnlyText={false}
        style={styles.rating}
        minValue={1}
        startingValue={route.params.rating}
        tintColor={"#f2f2f2"}
        ratingTextColor={"#3f2949"}
        />
      </View>
      <View style={styles.containerRentarBtn}>
        <TouchableOpacity onPress={() => {
          updateUser(auth.currentUser.uid, route.params.id);
          navigation.goBack(); 
          alertText("Solicitud exitosa", "¡Has rentado una bicicleta con éxito!");
          }} 
          style={styles.rentarBtn}>
          <Text style={styles.text}>Rentar bicicleta</Text>
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
  rentarBtn: {
    backgroundColor: "#f57c00",
    position: 'relative',
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 3,
    zIndex: 3,
    borderRadius: 16,
    bottom: 30
  },
  imagen: {
    position: 'relative',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 16,
    bottom: 60
  },
  text: {
    fontSize: 18,
    color: '#000'
  },
  textPopup: {
    justifyContent: 'center',
    color: '#3f2949',
    textAlign: "center",
    fontSize: 27,
    paddingVertical: 15,
  },
  textTarifa: {
    justifyContent: 'center',
    color: '#ee5555',
    fontSize: 20,
    paddingHorizontal: 30,
  },
  rentBikeImg: { 
    width: 200, 
    height: 200 
  },
  containerRentarBtn: { 
    flexDirection: "row" 
  },
  rating : { 
    paddingVertical: 10 
  }
});