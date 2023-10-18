import './Loader.css';
import React, { useEffect } from 'react';
import { Box } from '@athena/web-shared/ui';
export function Loader(props) {
  useEffect(() => {
    if (Object.keys(props).length > 0) {
      console.log('propssssssooooooooo', props);
    }
  }, [props]);
  return (
    <div className="loader">
      <svg
        id="svg-loader"
        viewBox="2  2 47 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="svg-path"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.94636 20.9152C14.5343 19.5085 19.365 21.8643 20.7153 26.1789C22.0668 30.4977 18.4548 37.768 13.8669 39.1747C9.27892 40.5815 4.46297 38.2257 3.1114 33.9069C1.76114 29.5924 5.35842 22.3219 9.94636 20.9152Z"
          fill="url(#paint0_linear_1713_37851)"
        />
        <path
          id="svg-path"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M20.9112 1.12687C22.3039 0.355357 23.829 -0.00438726 25.3355 4.03628e-05C26.8431 -0.00438726 28.367 0.355357 29.761 1.12687C30.6628 1.62498 31.4381 2.2537 32.0776 2.97872L32.0996 3.00308C32.1217 3.02854 32.1437 3.05399 32.1658 3.07835C32.4675 3.43034 32.7484 3.81223 32.9933 4.22289L45.7985 25.429C48.23 29.4592 46.7758 34.6584 42.5615 36.9873C38.3473 39.3129 32.9109 37.9171 30.4747 33.888L28.3415 30.3514C26.5541 27.3938 24.2886 22.7392 21.9546 20.532C19.4662 18.1854 16.0481 16.7365 12.2807 16.7365C11.5101 16.7365 10.7522 16.7984 10.0117 16.9158L16.7759 5.71389C17.3109 4.82615 17.8227 3.87089 18.5064 3.07835C18.5284 3.05399 18.5505 3.02854 18.5725 3.00308L18.5934 2.97872C19.2341 2.2537 20.0094 1.62498 20.9112 1.12687Z"
          fill="url(#paint1_linear_1713_37851)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1713_37851"
            x1="6.64836"
            y1="35.0983"
            x2="21.307"
            y2="25.7211"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#006ED5" />
            <stop offset="1" stop-color="#51D7F4" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1713_37851"
            x1="25.9759"
            y1="-7.56764e-07"
            x2="9.86696"
            y2="24.3275"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#006ED5" />
            <stop offset="1" stop-color="#51D7F4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function TestCaseLoader() {
  return (
    <Box className="text-case-loader text-center mt-3">
      <img src="assets/images/test-loader.gif" />
      {/* <ProgressBar now={60} className='mt-3' />
            <p className='text-grey mt-3'>Running tests....Estimated running time - 6s</p>
            <Button variant='outline-secondary'>Cancel</Button> */}
    </Box>
  );
}
