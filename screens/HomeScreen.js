import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import MapView, { Marker, UrlTile, Callout } from "react-native-maps";

import { signOut } from 'firebase/auth';
import { auth, db } from '../config';
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Rating  } from "react-native-elements";

export const HomeScreen = ({ navigation }) => {
  const [showMarkers, setShowMarkers] = useState(true);
  const [puntos, setPuntos] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState(0);
  const [usingRent, setUsingRent] = useState(false);
  const [usingPark, setUsingPark] = useState(false);
  const [isClient, setIsClient] = useState(true);

  const markerIcon = require('../assets/bike.png');

  const confirmParkImage = 'https://images.adsttc.com/media/images/5c52/f239/284d/d12a/6f00/0035/large_jpg/11_02.jpg?1548939830';
  const rentBikeImage = 'https://static.thenounproject.com/png/1332193-200.png';
  const urlTemplateImage = 'http://c.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const center = {
    latitude: -38.7333,
    longitude: -72.6067,
    latitudeDelta: 0.15,
    longitudeDelta: 0.0421,
  };

  const user = auth.currentUser;
  const puntoskeys = Object.keys(puntos);

  useEffect(() => {
    updateParks();
    updateDocUser();
  }, []); 

  function updateParks() {
    const q = query(collection(db, "estacionamientos"));
    onSnapshot(q, (querySnapshot) => {
      const _puntos = [];
      querySnapshot.forEach((doc) => {
      _puntos.push({_data: doc.data(), _id: doc.id});
      });
      setPuntos(_puntos);
      console.log("Parks updated");
    });
  }

  function updateDocUser() {
    const q = doc(db, "usuarios", user.uid);
    onSnapshot(q, (doc) => {
      if (doc.exists()) {
        const docUser = doc.data();
        setUsingRent(docUser.usingRent);
        setUsingPark(docUser.usingPark);
        setIsClient(docUser.isClient);
        console.log("User updated");
      } else {
        console.log("No se encuentra el usuario en la BD");
      }
  });
  }

  async function updateUserAfterUsePark(parkId) {
    const docRef = doc(db, "usuarios", user.uid);
    try {
      await updateDoc(docRef, { usingPark: true, idUsingPark: parkId});
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

  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  function ratingCompleted(rating) {
    console.log("Rating is: " + rating)
  }

  return (
    <View style={styles.container}>

      <MapView style={styles.map} maxZoomLevel={19} region={center}>
        {showMarkers ? puntoskeys.map((key) =>
          <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            image={markerIcon}
            coordinate={{ latitude: parseFloat(puntos[key]._data.latitud), longitude: parseFloat(puntos[key]._data.longitud) }}
            key={key}>
            <Callout tooltip={true} onPress={() => { setShowModal(!showModal); setActiveModal(key); console.log(puntos) }}>
              <View style={styles.popupBike}>
                <Text style={styles.textPopupBike}>{puntos[key]._data.nombre}</Text>
              </View>
              {isClient ? 
              <Modal
              animationType={'fade'}
              transparent={false}
              visible={showModal}
              onRequestClose={() => {
                setShowModal(false);
              }}>
              {/*All views of Modal*/}
              {/*Animation can be slide, slide, none*/}
              <View style={styles.modal}>
              <Image source={{ uri: confirmParkImage }}
                  style={styles.confirmParkImg}
                />
                <Rating
                  ratingCount={5}
                  fractions={1}
                  imageSize={35}
                  showRating
                  readonly
                  showReadOnlyText={false}
                  onFinishRating={ratingCompleted}
                  style={styles.rating}
                  minValue={1}
                  startingValue={puntos[activeModal]._data.ratingPark}
                  tintColor={"#dddddd"}
                  ratingTextColor={"#3f2949"}
                />
                <Text style={styles.textTarifa}>Tarifa: CLP$25/minuto</Text>
                { !usingPark ? 
                 <View>
                  <Text style={styles.textPopup}>¿Desea solicitar este estacionamiento?</Text>
                  <View style={styles.confirmParkBtnContainer}>
                  <TouchableOpacity style={styles.confirmParkBtn} onPress={() => { 
                    updateUserAfterUsePark(puntos[activeModal]._id);
                    setShowModal(!showModal); 
                    alertText('Solicitud exitosa', '¡El estacionamiento ha sido solicitado con éxito!');
                    }}>
                      <Text style={styles.text}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmParkBtn} onPress={() => { setShowModal(!showModal); }}>
                    <Text style={styles.text}>Rechazar</Text>
                  </TouchableOpacity>
                  </View>
                </View>
                : null}
                  { !usingRent ?
                  <View style={styles.rentBikeBtnContainer}>
                  <Image source={{ uri: rentBikeImage }}
                    style={styles.rentBikeImg} ></Image>
                    <TouchableOpacity style={styles.rentBikeBtn} onPress={
                      () => { setShowModal(!showModal); navigation.navigate('RentBike', 
                      {rating: puntos[activeModal]._data.ratingRent, 
                      id: puntos[activeModal]._id}); }}>
                      <Text style={styles.text}>Rentar bicicleta</Text>
                    </TouchableOpacity>
                    </View>
                  : null }
              </View>
            </Modal>
              : null }
            </Callout>
          </Marker>
        ) : null}

        <UrlTile urlTemplate={urlTemplateImage} maximumZ={19} />
      </MapView>

      <View style={styles.separacion}></View>

      {/*Boton de Mostrar/Ocultar estacionamiento*/}
      {isClient ? 
      <View>
      {showMarkers ?
        <TouchableOpacity onPress={() => setShowMarkers(false)} style={styles.btn}>
          <Text style={styles.text}>Ocultar Estacionamientos</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={() => setShowMarkers(true)} style={styles.btn}>
          <Text style={styles.text}>Buscar Estacionamientos</Text>
        </TouchableOpacity>
      }
      </View>
      : null}

      {/*Boton de Crear estacionamiento*/}
      { !isClient ?
        <TouchableOpacity onPress={() => navigation.navigate('ParkCreation')} style={styles.btn}>
          <Text style={styles.text}>Crear Estacionamiento</Text>
        </TouchableOpacity>
      : null }
      
      {/*Boton de Retirar bicicleta*/}
      { usingPark ?
        <TouchableOpacity onPress={() => navigation.navigate('BringBackBike')} style={styles.btn}>
          <Text style={styles.text}>Retirar bicicleta</Text>
        </TouchableOpacity>
      : null }

      {/*Boton de Devolver bicicleta*/}
      { usingRent ?
        <TouchableOpacity onPress={() => navigation.navigate('ReturnBike')} style={styles.btn}>
          <Text style={styles.text}>Devolver bicicleta</Text>
        </TouchableOpacity>
      : null }
      
      {/*Boton de Salir*/}
      <TouchableOpacity onPress={handleLogout} style={styles.btn}>
        <Text style={styles.text}>Salir</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  separacion: {
    flex: 0.06,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: "#f57c00",
    justifyContent: "center",
    position: 'relative',
    bottom: 30,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 19,
    elevation: 3,
    zIndex: 3,
    borderRadius: 16
  },
  text: {
    fontSize: 14,
    color: '#000'
  },
  textPopup: {
    justifyContent: 'center',
    color: '#3f2949',
    textAlign: "center",
    fontSize: 27,
    paddingHorizontal: 30,
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15
  },
  textTarifa: {
    justifyContent: 'center',
    color: '#ee5555',
    fontSize: 20,
    paddingHorizontal: 30,
    marginTop: 14,
    marginBottom: 2
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#dddddd',
    paddingVertical: 45,
  },
  confirmParkBtn: {
    flex: 2,
    backgroundColor: "#f57c00",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    elevation: 6,
    zIndex: 3,
    borderRadius: 16
  },
  confirmParkBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  rentBikeBtnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 21,
  },
  rentBikeBtn: {
    backgroundColor: "#f57c00",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 6,
    zIndex: 3,
    borderRadius: 16
  },
  popupBike: {
    backgroundColor: '#000', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 8
  },
  textPopupBike: {
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold'
  },
  map: {
    flex: 1, 
    width: '100%'
  },
  rentBikeImg: { 
    width: 100, 
    height: 100 
  },
  confirmParkImg: { 
    width: 180, 
    height: 180 
  },
  rating: { 
    paddingVertical: 5 
  }
});