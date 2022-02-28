import React, {useContext} from 'react';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';
import {obtenerPrimerNombre} from './obtenerPrimerNombre';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context/AuthContext';

function useLoguearFacebook() {
  let {abrirModal} = useContext(AuthContext);

  const loguearFacebook = async () => {
    try {
      abrirModal(true);
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      const datosFb = await auth().signInWithCredential(facebookCredential);

      // if (datosFb.additionalUserInfo?.isNewUser === true) {
      const {profile} = datosFb.additionalUserInfo as any;
      const {user} = datosFb;

      const primerNombre = obtenerPrimerNombre(profile.name);

      //Teniendo los datos de facebook procedemos a crear usuario
      await firestore()
        .collection('usuarios')
        .add({
          nombreCompleto: profile.name,
          primerNombre: primerNombre,
          completoTutorial: false,

          fechaCreacion: new Date(),
          datosPersonales: {
            fechaNacimiento: new Date(),
            genero: '',
            intensidadEntrenamientos: '',
          },
          idUsuario: user.uid,
          //el type large hace grande la foto
          fotoPerfil: user.photoURL + '?type=large',
          correo: profile.email,
        });
      // }

      setTimeout(() => {
        abrirModal(false);
      }, 5000);
    } catch (e) {
      abrirModal(false);
    }
  };

  return {
    loguearFacebook,
  };
}

export default useLoguearFacebook;
