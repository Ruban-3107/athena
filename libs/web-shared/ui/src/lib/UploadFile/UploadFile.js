import './UploadFile.css';
import { Row, Col} from 'react-bootstrap';
import {
  Reactdropzone,
 
} from '@athena/web-shared/ui';
export const UploadFile=(props)=> {
  const fileData = (data) => {
    console.log('uplodedData:::::::::::', data[0]);
    props.uploadFunction(data);
  };

  return (
    <Row className="mt-4">
    <Col lg={12}>
      <Row>
        <Col xl={4} className="d-btn1">
          <p className="text-center ">{props.labelName}</p>
        </Col>
        <Col xl={8} className="dropbox me-3">
          <Reactdropzone
            fileData={fileData}
            userdropzone={props.userdropzone}
            dropzoneclass={`dropzone2`}
          />
        </Col>
      </Row>
    </Col>
  </Row>
  );
}
export default UploadFile;
