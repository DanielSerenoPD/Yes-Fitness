import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export function reautenticar(passwordActual: string) {
  const user: any = auth().currentUser;
  const credenciales = auth.EmailAuthProvider.credential(
    user.email,
    passwordActual,
  );

  return user.reauthenticateWithCredential(credenciales);
}
