import './ImagePreview.css';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CrossIcon, Box, Span } from '@athena/web-shared/ui';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};
const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};
const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};
export function ImagePreview(props) {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState('');
  const MAX_SIZE = 102400;

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      // 'image/*': [],
      'application/pdf': [],
    },
    maxSize: 102400,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setErrors('');
      if (rejectedFiles && rejectedFiles.length) {
        console.log('rejectedFilesrejectedFiles:', rejectedFiles);
        rejectedFiles.forEach((file) => {
          file.errors.forEach((err) => {
            if (err.code === 'file-too-large') {
              setErrors('* File Size is too large');
            }
            if (err.code === 'file-invalid-type') {
              setErrors('* Invalid File Format');
            }
          });
        });
      }

      if (acceptedFiles && acceptedFiles.length) {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      }
    },
  });

  const removeFile = (file) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  useEffect(() => {
    props.fileData(files);
  }, [files]);

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div className="d-flex align-items-center">
        <p className="mt-3">{file.name}</p>
        <span
          className="closes ms-2 mt-3"
          title="Delete"
          onClick={() => removeFile(file)}
        >
          <CrossIcon/>
        </span>
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <Box className="">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box className="upload-wrapper d-flex gap-3 align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="72"
            height="72"
            viewBox="0 0 72 72"
          >
            <circle
              id="Ellipse_40"
              data-name="Ellipse 40"
              cx="36"
              cy="36"
              r="36"
              fill="#fff"
            />
            <g id="Frame" transform="translate(20.504 20.969)">
              <path id="Vector" d="M0,0H30.991V30.991H0Z" fill="none" />
              <path
                id="Vector-2"
                data-name="Vector"
                d="M24.535,15.5v3.874h3.874v2.583H24.535v3.874H21.952V21.952H18.078V19.369h3.874V15.5ZM24.545,0a1.282,1.282,0,0,1,1.281,1.282V12.913H23.243V2.583H2.583V20.659L15.5,7.748l3.874,3.874v3.653L15.5,11.4l-9.262,9.26H15.5v2.583H1.281A1.282,1.282,0,0,1,0,21.961V1.282A1.291,1.291,0,0,1,1.281,0ZM7.748,5.165a2.583,2.583,0,1,1-1.826.756,2.583,2.583,0,0,1,1.826-.756Z"
                transform="translate(2.583 3.874)"
                fill="#9fa7c6"
              />
            </g>
          </svg>
          <p className="upload-info m-0">
            Click to select, or drop the file here <br />
            <Span>(PDF File, smaller than 100kb)</Span>
          </p>
        </Box>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
      {errors ? (
        <p style={{ color: 'red', padding: 5, margin: 0, fontSize: 14 }}>
          {errors}
        </p>
      ) : (
        ' '
      )}
    </Box>
  );
}
export default ImagePreview;
