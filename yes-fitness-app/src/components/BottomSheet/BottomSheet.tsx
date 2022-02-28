import React, {useCallback, useMemo, useRef, useContext, Children} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {AuthContext} from '../../context/AuthContext';
import CustomBackdrop from './CustomBackdrop';
import EquisBlanca from '../../../assets/imagenes/iconos-otros/EquisBlanca.svg';

const BottomSheet = ({children}: any) => {
  const {bottomSheetModalRef, cerrarBottomSheet} = useContext(AuthContext);

  // variables
  // 525 px
  const snapPoints = useMemo(() => ['75%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} opacity={0.9} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      //jalar desde el contenido
      enablePanDownToClose={true}
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View style={styles.contentContainer}>
        <View
          style={{
            marginHorizontal: 24,
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={cerrarBottomSheet}
            activeOpacity={0.6}
            style={styles.cerrar}>
            <EquisBlanca />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  cerrar: {
    width: 26,
    height: 26,
    backgroundColor: 'black',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomSheet;
