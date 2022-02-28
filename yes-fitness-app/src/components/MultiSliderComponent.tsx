import React, {useState, useCallback} from 'react';

import {View} from 'react-native';
// import RangeSlider from 'rn-range-slider';
import {RangeSlider} from '@sharcoux/slider';

export const MultiSliderComponent = ({
  scrollStatus,
  setScrollStatus,
  filtrosQuery,
  setFiltrosQuery,
}: any) => {
  return (
    // <Slider
    //   animateTransitions
    //   onSlidingComplete={() => {
    //     setScrollStatus(true);
    //   }}
    //   onSlidingStart={() => {
    //     setScrollStatus(false);
    //   }}
    //   value={[0, 20]}
    //   minimumValue={0}
    //   maximumValue={20}
    //   step={1}
    // />

    // <MultiSlider
    //   // values={sliderOneValue}
    //   sliderLength={310}
    //   // onValuesChangeStart={sliderOneValuesChangeStart}
    //   // onValuesChange={sliderOneValuesChange}
    //   // onValuesChangeFinish={sliderOneValuesChangeFinish}
    // />

    // <RangeSlider
    //   gravity={'center'}
    //   min={200}
    //   max={1000}
    //   step={20}
    //   selectionColor="#3df"
    //   blankColor="#f618"
    //   // onValueChanged={(low, high, fromUser) => {
    //   //     this.setState({rangeLow: low, rangeHigh: high})
    //   // }}
    // />
    <RangeSlider
      range={[filtrosQuery.primeraHora, filtrosQuery.segundaHora]} // set the current slider's value
      minimumValue={6} // Minimum value
      maximumValue={22} // Maximum value
      step={1} // The step for the slider (0 means that the slider will handle any decimal value within the range [min, max])
      minimumRange={1} // Minimum range between the two thumbs
      crossingAllowed={false} // If true, the user can make one thumb cross over the second thumb
      outboundColor="#C3C3C3" // The track color outside the current range value
      inboundColor="#000000" // The track color inside the current range value
      thumbStyle={{
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,

        elevation: 5,
        borderColor: '#C3C3C3',
        borderWidth: 0.1,
        overflow: 'visible',
      }} // Override the thumb's style
      trackStyle={undefined} // Override the tracks' style
      minTrackStyle={undefined} // Override the tracks' style for the minimum range
      midTrackStyle={undefined} // Override the tracks' style for the middle range
      maxTrackStyle={undefined} // Override the tracks' style for the maximum range
      vertical={false} // If true, the slider will be drawn vertically
      inverted={false} // If true, min value will be on the right, and max on the left
      enabled={true} // If false, the slider won't respond to touches anymore
      trackHeight={4} // The track's height in pixel
      thumbSize={28} // The thumb's size in pixel
      thumbImage={undefined} // An image that would represent the thumb
      slideOnTap={true} // If true, touching the slider will update it's value. No need to slide the thumb.
      onValueChange={(range: [number, number]) => {
        setFiltrosQuery({
          ...filtrosQuery,
          primeraHora: range[0],
          segundaHora: range[1],
        });
      }} // Called each time the value changed. The type is (range: [number, number]) => void
      onSlidingStart={() => {
        setScrollStatus(false);
      }} // Called when the slider is pressed. The type is (range: [number, number]) => void
      onSlidingComplete={() => {
        setScrollStatus(true);
      }} // Called when the press is released. The type is (range: [number, number]) => void
    />
  );
};
