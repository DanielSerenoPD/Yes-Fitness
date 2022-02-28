import React, {useEffect, useState, useRef, useCallback} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

export function useAbrirModal() {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // callbacks
  const abrirBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const cerrarBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const [modal, abrirModal] = useState(false);

  return {
    modal,
    abrirModal,

    abrirBottomSheet,
    bottomSheetModalRef,
    cerrarBottomSheet,
  };
}
