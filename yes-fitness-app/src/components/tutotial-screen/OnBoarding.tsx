import React, {useState, useRef, useContext} from 'react';
import {View, FlatList, Animated, Alert} from 'react-native';
import {NextButton} from './NextButton';
import {OnBoardingItem} from './OnBoardingItem';
import {Paginator} from './Paginator';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../context/AuthContext';
import {ModalCargando} from '../ModalCargando';

const data = [
  {
    id: 1,
    title: 'Explora',
    description:
      'Be My Dog te permite explorar y conocer a todos los perros en adopcion cercanos a ti y funciona en cualquier parte del mundo.',
    image: require('../../../assets/imagenes/tutorial-carrousel/perros_tinder.png'),
  },
  {
    id: 2,
    title: 'Modo Tinder',
    description:
      'Desliza a la derecha cada vez que un perro te llame la atencion, esto guardara la informacion en favoritos para que al final tengas todos los datos del el perro que mas te gusto',
    image: require('../../../assets/imagenes/tutorial-carrousel/perros_tinder.png'),
  },
  {
    id: 3,
    title: 'Mapa',
    description:
      'Explora mediante un mapa a todos los perros que hay en adopcion en tu estado',
    image: require('../../../assets/imagenes/tutorial-carrousel/perros_tinder.png'),
  },
  {
    id: 4,
    title: 'Dar en adopcion',
    description:
      'Solo pulsa el boton de dar en adopcion, sube tus datos y el perro aparecera en la comunidad de be my dog, es totalmente gratis.',
    image: require('../../../assets/imagenes/tutorial-carrousel/perros_tinder.png'),
  },
  {
    id: 5,
    title: 'Comenzar',
    description:
      'Oprime el boton para arrancar la app, este tutorial estara disponible para ti en todo momento en la parte de ajustes',
    image: require('../../../assets/imagenes/tutorial-carrousel/perros_tinder.png'),
  },
];

export const OnBoarding = () => {
  const {datosUsuario, abrirModal, guardarCompletoTutorial} =
    useContext(AuthContext);

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<any>(0);

  const viewableItemsChanged = useRef(({viewableItems}: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const iniciarApp = async () => {
    abrirModal(true);
    try {
      await firestore()
        .collection('usuarios')
        .doc(datosUsuario.idDocumento)
        .update({
          pais: datosUsuario.pais,
          estado: datosUsuario.estado,
          completoTutorial: true,
        });
      abrirModal(false);
      guardarCompletoTutorial(true);
    } catch (e) {
      abrirModal(false);
    }
  };

  const scrollTo = () => {
    if (currentIndex < data.length - 1) {
      slidesRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      //Una vez que el tutorial acaba se actualizan
      // los datos de paises y tambien se actualiza de
      // que el usuario ya acabo el tutorial
      iniciarApp();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 3,
        }}>
        <FlatList
          data={data}
          renderItem={({item}) => <OnBoardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={item => item.id as any}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          onViewableItemsChanged={viewableItemsChanged as any}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef as any}
        />
      </View>
      <Paginator data={data} scrollX={scrollX} />
      <NextButton
        scrollTo={scrollTo}
        percentage={(currentIndex + 1) * (100 / data.length)}
      />

      <ModalCargando />
    </View>
  );
};
