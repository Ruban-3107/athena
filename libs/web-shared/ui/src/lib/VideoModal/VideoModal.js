import './VideoModal.css';
import React from 'react';
import { Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player';

export function VideoModal(props) {
  console.log('propsssssssssssssssssss', props);
  const Element = props.renderElement || 'Modal';
  return (
    <Element
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className='video-model'
        sytle ={{display:'none'}}
      >
     <ReactPlayer  
     url={props.url} 
     controls = {true}
     className='video-course'
     
     />
     </Element>
  );
}
export default VideoModal;
