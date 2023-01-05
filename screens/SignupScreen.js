import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Images, Colors, auth, db } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';
import { doc, setDoc  } from "firebase/firestore"; 
import { RadioButton } from 'react-native-paper';

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [isClientState, setIsClientState] = useState(true);
  const [checked, setChecked] = React.useState('first');

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility
  } = useTogglePasswordVisibility();

  const handleSignup = async values => {
    const { email, password } = values;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        isClient: isClientState,
        usingPark: false,
        usingRent: false,
        idUsingPark: "",
        idUsingRent: ""
      }
      writeUser(user);
      console.log("Nuevo usuario registrado");
      console.log(user);
    })
    .catch(error => setErrorState(error.message)
    );
  };

  async function writeUser(_user) {
    try {
      await setDoc(doc(db, "usuarios", _user.uid), _user);
      console.log("New user written with ID: ", _user.uid);
    } catch (e) {
      console.error("Error adding document: ", e); 
    }
  } 

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        {/* LogoContainer: consits app logo and screen title */}
        <View style={styles.logoContainer}>
          <Logo uri={Images.logo} />
          <Text style={styles.screenTitle}>Crear cuenta</Text>
        </View>
        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={signupValidationSchema}
          onSubmit={values => handleSignup(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur
          }) => (
            <>
              {/* Input fields */}
              <TextInput
                name='email'
                leftIconName='email'
                placeholder='Ingresar email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                name='password'
                leftIconName='key-variant'
                placeholder='Contraseña'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType='newPassword'
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              <TextInput
                name='confirmPassword'
                leftIconName='key-variant'
                placeholder='Confirmar Contraseña'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType='password'
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />
              {/* Boton de seleccion de tipo de usuario */}
              <View style={styles.isClientBtnStyle}>
                <View style={{ flex: 1 }}>
                <RadioButton
                value="first"
                status={ checked === 'first' ? 'checked' : 'unchecked' }
                onPress={() => {setChecked('first'); setIsClientState(true);} }
              />
                </View>
                <View style={styles.isClientContainerTextStyle}>
                  <Text style={styles.isClientTextStyle}>Cliente</Text>
                </View>
              </View>

              <View style={styles.isClientBtnStyle}>
                <View style={{ flex: 1 }}>
                <RadioButton
                value="second"
                status={ checked === 'second' ? 'checked' : 'unchecked' }
                onPress={() =>  {setChecked('second'); setIsClientState(false);}}
              />
                </View>
                <View style={styles.isClientContainerTextStyle}>
                  <Text style={styles.isClientTextStyle}>Clinker</Text>
                </View>
              </View>
              
              {/* Display Screen Error Mesages */}
              {errorState !== '' ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}
              {/* Signup button */}
              <Button style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </Button>
            </>
          )}
        </Formik>
        {/* Button to navigate to Login screen */}
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={'¿Ya tiene una cuenta?'}
          onPress={() => navigation.navigate('Login')}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12
  },
  logoContainer: {
    alignItems: 'center'
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.black,
    paddingTop: 20
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  borderlessButtonContainer: {
    marginTop: 16,
    marginBottom: 53,
    alignItems: 'center',
    justifyContent: 'center'
  },
  isClientBtnStyle: {
    flexDirection: 'row', 
    alignContent: 'center', 
    marginTop: 10
  },
  isClientContainerTextStyle: {
    flex: 4.8, 
    alignSelf: 'center'
  },
  isClientTextStyle: {
    fontSize: 17,
    color: Colors.black
  }
});
