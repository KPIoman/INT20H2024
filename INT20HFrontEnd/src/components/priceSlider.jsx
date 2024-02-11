import React, { useEffect, useRef } from 'react';
import ReactSlider from 'react-slider'
import '../css/priceSlider.css'

const PriceSlider = () => {

  return (
    <ReactSlider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        defaultValue={[0, 100]}
        ariaLabel={['Lower thumb', 'Upper thumb']}
        ariaValuetext={state => `Thumb value ${state.valueNow}`}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        pearling
        minDistance={1}
    />
  );
};

export default PriceSlider;
