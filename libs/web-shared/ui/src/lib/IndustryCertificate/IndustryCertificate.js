import './IndustryCertificate.css';
import {
  Box,
  Span,
  EyeIcon,
  LinkIcon,
  EditIcon,
  PrivacyDropdown,
  DeleteModal,
  DeleteIcon,
  CertificateModal,
  PdfModal,
  Avatar,
  DocModal,
  EditIconLight,
  Modal
} from '@athena/web-shared/ui';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiRequest } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
import Moment from 'react-moment';

export function IndustryCertificate(props) {
  const userData = localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))
    : null;
  const [pdfModalState, setPdfModalState] = useState({
    open: false,
    header: false,
    url: ""
  });
  const [CertificatemodalShow, setCertificateModalShow] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [updateCertification, setUpdateCertification] = useState(null);
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);

  const handleClose = () => {
    setShow(false);
    props.getProfiledata();
  };

  const handleCertificationDelete = async (id) => {
    console.log("$$$$$$$$$$$$$$$");
    setPending(true);
    const deleteCertificationResponse = await apiRequest(
      `api/users/certifications/cert/${id}`,
      'DELETE'
    );
    if (deleteCertificationResponse) {
      setPending(false);
      handleClose();
      setCertificateData(null);
      setUpdateCertification(null);
      setDeleteItem(null);
      toast.success('Certificate deleted successfully!');
    }
  };
  console.log(certificateData?.certificate_upload, 'cccc')
  return (
    <>
      <DeleteModal
        show={show}
        header={false}
        onHide={() => {
          handleClose();
          setDeleteItem(null);
        }}
        deleteResponse={() => {
          //  if (deleteItem?.providers?.label) {
          handleCertificationDelete(deleteItem?.id);
          //  }
        }}
        deleteData={deleteItem?.providers?.label}
        type='Certificate'
        pending={pending}
      />
      {/* <Modal 
        show={show}
        onHide={() => {
          handleClose();
          setDeleteItem(null);
        }}
        deleteResponse={() => {
          if (deleteItem?.providers.label) {
            handleCertificationDelete(deleteItem?.id);
          }
        }}
        deleteData={deleteItem?.providers.label}
        type='Certificate'
      /> */}
      <DocModal
        docState={pdfModalState}
        setdocState={setPdfModalState}
        isModal={true}
      />
      <CertificateModal
        show={CertificatemodalShow}
        onHide={() => {
          setCertificateModalShow(false);
          props.getProfiledata();
          setCertificateData(null);
        }}
        certificateDetails={certificateData}
        UpdateCertification={updateCertification}
      />
      <Box>
        <Box className="d-flex justify-content-between align-items-center profile-sec">
          <button
            onClick={() => {
              setCertificateModalShow(true);
              setCertificateData(null);
              setUpdateCertification(null);
            }}
            type="button"
            className="certificate-btn text-white"
          // name="+ Add Certificate"
          >
            + Add Certificate
          </button>
          {/* <PrivacyDropdown /> */}
        </Box>
        {props.profileData?.userProfilesUser?.usersUsersCertification &&
          props.profileData?.userProfilesUser?.usersUsersCertification.length
          ? props.profileData?.userProfilesUser?.usersUsersCertification.map(
            (certificate, index) => (
              <Box className="mt-3 mt-md-5" key={index}>
                <ul className="profile-list">
                  <li>
                    <Span>
                      <Avatar src={certificate?.providers?.logo} alt="logo" />
                      {/* <img src={certificate?.providers?.logo} alt="logo" /> */}
                    </Span>
                    <Span className="detailalign">
                      <Span className="profile-title">
                        {certificate?.providers?.label} &nbsp; &nbsp; &nbsp;
                        {/* <EyeIcon /> */}
                      </Span>
                      <ul className="pl-details mt-2">
                        <li>
                          <Span>Valid from</Span>
                          <Span>
                            <Moment format="MMM YYYY">
                              {certificate.date_achieved}
                            </Moment>{' '}
                            {certificate.date_expires == null ? (
                              ''
                            ) : (
                              <>
                                -
                                <Moment format="MMM YYYY">
                                  {certificate.date_expires}
                                </Moment>
                              </>
                            )}
                          </Span>
                        </li>
                        <li>
                          <Span>Certificate ID</Span>
                          <Span>
                            {certificate.certification_id == ''
                              ? '-'
                              : certificate.certification_id}
                          </Span>
                        </li>
                      </ul>
                      <ul className="cd-link-list">
                        <li>
                          <EyeIcon />
                          &nbsp; &nbsp;
                          <Link
                            className="view-more"
                            onClick={() => {
                              setCertificateData(certificate);
                              setPdfModalState({
                                open: true,
                                url: certificate?.certificate_upload,
                                header: false
                              })    
                            }}
                          >
                            View certificate
                          </Link>
                        </li>
                        <li>
                          <LinkIcon />
                          &nbsp; &nbsp;
                          <a
                            className="view-more"
                            href={
                              certificate?.certification_url &&
                              certificate.certification_url
                            }
                            target={certificate.certification_url && '_blank'}
                          >
                            Visit certificate URL
                          </a>
                        </li>
                        <li>
                          <EditIconLight />
                          &nbsp; &nbsp;
                          <Link
                            className="view-more"
                            onClick={() => {
                              setCertificateModalShow(true);
                              setUpdateCertification(certificate.id);
                              setCertificateData(certificate);
                            }}
                          >
                            Edit
                          </Link>
                        </li>
                        <li>
                          <DeleteIcon />
                          &nbsp;
                          <Link
                            className="view-more"
                            onClick={() => {
                              setShow(true);
                              setDeleteItem(certificate);
                            }}
                          >
                            Delete
                          </Link>
                        </li>
                      </ul>
                    </Span>
                  </li>
                </ul>
              </Box>
            )
          )
          : null}
      </Box>
    </>
  );
}
export default IndustryCertificate;
