import './ImageComponent.css';
import React,{useState,useEffect} from 'react';
import { Spinner } from 'react-bootstrap';
import { apiRequest } from '@athena/web-shared/utils';

export const ImageComponent = React.memo(({ image_url }) => {
  const [continueImgLoading, setContinueImgLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  const getFromS3 = async (image) => {
    try {
      setContinueImgLoading(true)
      const img = await apiRequest(`api/courses/topics/convertFileToLinkS3/${image}`, 'POST', {})
      if (img.status == 'success') {
        setContinueImgLoading(false)
        return img.value;

      } else {
        setContinueImgLoading(false)
      }

    } catch (error) {
      console.log("error in learner continue learning :", error)
    }
  }

  useEffect(() => {
    getFromS3(image_url)
      .then((image) => {
        setContinueImgLoading(false);
        setImageSrc(image);
      })
      .catch((error) => {
        setContinueImgLoading(false);
        console.error(error);
      });
  }, [image_url]);

  return (
    <>
      {continueImgLoading ? (
        <Spinner></Spinner>
      ) : (
        <img
          className="rounded-3 mb-2"
          width="65px"
          height="65px"
          src={imageSrc}
        />
      )}
    </>
  );
});

export default ImageComponent;
