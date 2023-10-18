import './Bulkfileupload.css';
import {useState,useEffect} from 'react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {Reactdropzone,DownloadIcon,QuestionMarkIcon} from '@athena/web-shared/ui';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../utils/src';

export const Bulkfileupload = (props) => {
  const auth = useAuth();
  console.log('Auth details', auth?.user?.role?.[0]?.name);

  const { identifiedRole,downloadUrl } = props
  console.log("identifiiiingrolleeee", props);

  const [existingFile, setExistingFile] = useState(true);
  const [uploadFileData, setUploadFileData] = useState([]);
  

  const fileData = (data) => {
    console.log('uplodedData:::::::::::', data[0]);
    props.uploadFunction(data);
    setUploadFileData(data);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Use template to bulk upload users
    </Tooltip>
  );

 

  useEffect(() => {
    console.log('//////upload file', uploadFileData);
    if (uploadFileData == null) {
      setExistingFile(false);
    } else {
      setExistingFile(true);
    }
  }, [uploadFileData]);

  
  

  const getSuccessMessage = async () => {
    toast.success('User creation template downloaded successfully!');
  };

  console.log("process.env.NX_ADMIN_TEMPLATE",process.env.NX_ADMIN_TEMPLATE,identifiedRole,identifiedRole  ? process.env.NX_CLIENT_REP_TEMPLATE  : process.env.NX_ADMIN_TEMPLATE);

  return (
    <Row>
    <Col lg={12}>
      <Row>
        <Col lg={6}>
          <div className="d-btn">
            <a
              href ={downloadUrl.value      
              }
              className="bo"
              onClick={getSuccessMessage}
            >
              <DownloadIcon /> &nbsp;Download Template&nbsp;
            </a>

            <OverlayTrigger
              placement="bottom"
              delay={{ show: 550, hide: 400 }}
              overlay={renderTooltip}
            >
              <button className="box-btn">
                <QuestionMarkIcon />
              </button>
            </OverlayTrigger>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={2} className="d-btn1">
          <p className="text-center" >
            Bulk Upload:{' '}
          </p>
        </Col>
        <Col lg={4} className="dropbox me-2">
          <div className="d-flex bluk-box">
            <Reactdropzone
              isFileDeleted={props.isFileDeleted}
              existingFile={existingFile}
              userdropzone={props.userdropzone}
              fileData= {fileData}
              dropboxclass = 'dropzone-box dropzonewidth'
              fileType = {props.fileType}
            />
          </div>
        </Col>
      </Row>
    </Col>
  </Row>
  );
}
export default Bulkfileupload;
