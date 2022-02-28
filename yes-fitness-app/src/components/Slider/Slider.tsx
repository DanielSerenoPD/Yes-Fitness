import React, {useState, useRef} from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import {FadeInImage} from '../FadeInImage';

const {width, height} = Dimensions.get('window');

export const Slider = ({arrayFotos}: any) => {
  let [active, setActive] = useState(0);

  const flatlistRef = useRef<any>();

  //Funcion que ponen activo el punto de la foto seleccionada
  let onChange = ({nativeEvent}: any) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  return (
    <>
      <ScrollView
        ref={flatlistRef}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        onScroll={nativeEvent => onChange(nativeEvent)}
        style={{width}}>
        {arrayFotos.map((dato: string, index: number) => (
          <FadeInImage
            key={index}
            uri={dato}
            style={{
              width,
              height: 447,
            }}
          />
        ))}
      </ScrollView>
      {/* Dots */}
      <View
        style={{
          bottom: 25,

          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        {arrayFotos.map(({}, index: number) => (
          <View
            // onPress={() => {
            //   scrollToIndex(index);
            // }}
            key={index.toString()}
            style={{
              width: 10,
              height: 10,
              borderRadius: 50,
              backgroundColor: active === index ? '#FFFFFF' : '#979797',
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>
    </>
  );
};
