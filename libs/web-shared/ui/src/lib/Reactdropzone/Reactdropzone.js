import './Reactdropzone.css';
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, UploadIconExercises, Box, Span, CameraIcon } from '@athena/web-shared/ui';
import { Row, Col } from 'react-bootstrap';
import { apiRequest } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';

export const Reactdropzone = (props) => {
  let disabled = props.disabled;
  const [files, setFiles] = useState([]);

  const sendData = (acceptedFiles) => {
    props.sendDataToParent(acceptedFiles);
  };

  const onSubmit = async (value) => {
    console.log('filesss', value);
    const formData = new FormData();

    formData.append('certificate_upload', value[0]);

    [...formData.entries()].forEach((e) => console.log('zzzzzzzzz', e));

    console.log('dataForm,', formData);

    if (props.profileData) {
      setPending(true);
      const UpdatePictureResponse = await apiRequest(
        `api/users/profiles/imageupload/${props.profileData.user_id}`,
        'PUT',
        formData,
        true
      );
      console.log('UpdatePictureResponse::', UpdatePictureResponse);
      if (UpdatePictureResponse?.status === 'success') {
        props.getProfiledata();
        toast.success('Profile picture updated successfully!');
        setErrorMsgs([]);
        setPending(false);
      } else {
        if (UpdatePictureResponse?.message && typeof UpdatePictureResponse?.message === 'string') {
          toast.error(
            UpdatePictureResponse?.message.message
              ? UpdatePictureResponse.message.message
              : UpdatePictureResponse.message === `Cannot read properties of undefined (reading 'success')` ? 'Sometimes went wrong' : null
          );
          setPending(false);
        } else if (UpdatePictureResponse?.message && Array.isArray(UpdatePictureResponse?.message)) {
          setErrorMsgs(UpdatePictureResponse?.message);
          setPending(false);
        }
      }
    }
  };

  const fileTypeAccept = {
    xlsx: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': []
    },
    xls: {
      'application/vnd.ms-excel': []
    },
    images: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': []
    },
    exerfiletype: {
      'text/plain': []
    },
    topicfiles: {
      'application/msword': [], // DOC file
      'application/pdf': [], // PDF file
      'application/vnd.ms-powerpoint': [], // PPT file
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], // DOCX
      'video/mp4': [], // mp4
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow': [], // PPSX file
      'application/vnd.ms-excel': [], // Excel 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': [] // PPTX
    },
    topicfilesNoPdf: {
      'application/msword': [], // DOC file
      'application/vnd.ms-powerpoint': [], // PPT file
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], // DOCX
      'video/mp4': [], // mp4
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow': [], // PPSX file
      'application/vnd.ms-excel': [], // Excel 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': [] // PPTX
    }
  };


  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noClick: disabled,
    accept: props.fileType
      ? fileTypeAccept[props.fileType]
      : fileTypeAccept.topicfilesNoPdf,
    maxSize: props.maxSize,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length) {
        rejectedFiles.forEach((file) => {
          console.log("uiuiiuiuiu", file);
          file.errors.forEach((err) => {
            if (err.code === 'file-too-large') {
              props.setError(props.name, {
                type: 'Maxsize',
                message: '* File Size is too large',
              });
            }
            if (err.code === 'file-invalid-type') {
              props.setError(props.name, {
                type: 'Fileformat',
                message: '* Invalid File Format',
              });
            }
          });
        });
      }
      if (acceptedFiles && acceptedFiles.length) {
        props.setError(props.name, '')
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );

        {
          props.dropboxclass === 'dropbox-picture'
            ? onSubmit(acceptedFiles)
            : sendData(acceptedFiles);
        }
      }
    },
  });


  useEffect(() => {
    if (files.length > 0) {
      props.fileData(files);
    }
  }, [files]);



  useEffect(() => {
    if (props.isFileDeleted) {
      setFiles([]);
    }
  }, [props.isFileDeleted]);

  // const fileExtensionName = (files) => {
  //   const ccc = files.map((file) => {
  //     const extension = file.name;
  //     console.log('Xtensin', extension);
  //     const extensionName = extension.split('.');
  //     setExtension(extensionName[1]);
  //   });
  // };

  const img = {
    display: 'block',
    // width: 'auto',
    height: '100%',
    width: '50%',
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  // console.log('props.dropboxclass', thumbs);

  return (
    <Box>
      <Row>
        <Col className="tumb1">
          <div {...getRootProps({ className: `${props.dropzoneclass}` })}>
            <input {...getInputProps()} />
            {props.dropboxclass === 'dropbox-picture' ? (
              <Span>
                <CameraIcon />
              </Span>
            ) : props.dropboxclass === "dropbox-uploadfile"
              ? (
                <div className='d-flex'>
                  <Span><UploadIconExercises onClick={sendData} /></Span>
                  &nbsp; Upload file</div>
              )
              : (
                // files.length === 0 && (
                <Box
                  className={
                    props.dropboxclass
                      ? props.dropboxclass
                      : 'dropzone-boxsmall dropzonewidth'
                  }
                >
                  {props.trainercourse ? (
                    <>
                      <UploadIcon />
                      <div className="ms-4">
                        <p className="sumtrt">
                          {props.userdropzone?.title
                            ? props.userdropzone.title
                            : ''}{' '}
                        </p>
                        <p className="subtrt">Drop your file here or browse</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadIcon />
                      <br></br>
                      <p className="upload-info mt-0 font-h">
                        {props.userdropzone?.title
                          ? props.userdropzone.title
                          : ''}
                        <br />
                      </p>
                      <Span className="span-txt">
                        {props.userdropzone?.size
                          ? props.userdropzone.size
                          : ''}{' '}
                        <br />
                        Accepted File Type:{' '}
                        {props.userdropzone?.type
                          ? props.userdropzone.type
                          : ''}
                      </Span>
                    </>
                  )}
                </Box>
                // )
              )}
          </div>
        </Col>
      </Row>
    </Box>
  );
}
export default React.memo(Reactdropzone);
