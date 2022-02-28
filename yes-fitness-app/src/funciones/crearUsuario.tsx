import auth from '@react-native-firebase/auth';

export const crearUsuario = async (email: string, password: string) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
    console.log('Usuario correctamente Registrado');
  } catch (e) {
    console.log('hubo un error');
  }
};
