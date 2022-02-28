import React, {useEffect, useContext} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {obtenerPrimerNombre} from './obtenerPrimerNombre';
import {AuthContext} from '../context/AuthContext';
import {Alert} from 'react-native';
import {generarCodigoCupon} from './generarCodigoCupon';

function useLoguearGoogle() {
  let {abrirModal} = useContext(AuthContext);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '773942840110-s30l5j4r6st1od3ovc8pqnpcq448mi35.apps.googleusercontent.com',
    });
  }, []);

  //funcion para loguear con google
  const loguearGoogle = async () => {
    // Get the users ID token
    try {
      abrirModal(true);
      const {idToken, user} = await GoogleSignin.signIn();

      //Obtenemos el nombre y la foto de google
      const primerNombre = obtenerPrimerNombre(user.name as any);
      const nombreCompleto = user.name;
      const fotoPerfil = user.photo;
      const correoGm = user.email;

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const datosUsuario = await auth().signInWithCredential(googleCredential);

      //Esto es para confirmar si es primera vez que se logue con google
      // si esto es cierto se generan los datos del usuario
      //  y si no simplemente se accede a la cuenta

      if (datosUsuario.additionalUserInfo?.isNewUser === true) {
        //Teniendo los datos de google procedemos a crear usuario

        //esto sirve para crear la vigencia de las clases gratis
        let hoy = new Date();
        let diasVigencia = 15;
        let cupon = generarCodigoCupon();
        await firestore()
          .collection('usuarios')
          .add({
            nombreCompleto: nombreCompleto,
            primerNombre: primerNombre,
            puedeUsarCupon: true,
            completoTutorial: false,
            clases: 0,
            suscripcionActual: null,
            fechaCreacion: new Date(),
            clasesGratis: {
              activo: true,
              fechaVigencia: hoy.setDate(hoy.getDate() + diasVigencia),
              clasesGratis: 3,
            },
            datosPersonales: {
              fechaNacimiento: new Date(),
              genero: '',
              intensidadEntrenamientos: '',
            },

            idUsuario: datosUsuario.user.uid,
            fotoPerfil: fotoPerfil + '0',
            correo: correoGm,

            categoriaDominante: '',
            nombresClasesTomadas: {},
            categoriasClasesTomadas: {},
            estudiosFavoritos: [],
            cupones: {
              numero: cupon,
              puedeUsar: true,
            },
            ultimaClase: {},
            historialClases: [],
            proximasClases: [],
            clasesDeLaSemana: [],
            clasesRecomendadas: [],
          });
      }

      setTimeout(() => {
        abrirModal(false);
      }, 5000);
    } catch (e) {
      Alert.alert('hubo un error');
      abrirModal(false);
      console.log(e);
    }
  };

  return {
    loguearGoogle,
  };
}

export default useLoguearGoogle;
