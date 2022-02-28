import {obtenerPrimerNombre} from './obtenerPrimerNombre';
import firestore from '@react-native-firebase/firestore';

export const crearUsuario = async (
  nombre: string,
  contraseña: string,
  correo: string,
) => {
  //Esto es para obtener el nombre de pila
  // const primerNombre = obtenerPrimerNombre(nombre);
  // abrirModal(true);
  // try {
  //    const datosUsuario = await auth().createUserWithEmailAndPassword(
  //      correo,
  //      contraseña,
  //    );
  //    await firestore().collection('usuarios').add({
  //      nombreCompleto: nombre,
  //      primerNombre: primerNombre,
  //      completoTutorial: false,
  //      fechaCreacion: Date.now(),
  //      idUsuario: datosUsuario.user.uid,
  //      correo: correo,
  //      fotoPerfil:
  //        'https://firebasestorage.googleapis.com/v0/b/tinder-perros-desarrollo.appspot.com/o/fotos%2Fhuella_perro.jpeg?alt=media&token=3bd2c2ea-b1c6-4423-8e1a-ee32fa279c08',
  //    });
  //    abrirModal(false);
  // } catch (e) {
  //    abrirModal(false);
  //    console.log('hubo un error');
  //   console.log(e);
  // }
};
